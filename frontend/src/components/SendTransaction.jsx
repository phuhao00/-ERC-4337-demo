import { useState } from 'react'
import { encodeFunctionData, parseEther } from 'viem'
import { useWalletClient } from 'wagmi'

export default function SendTransaction({ accountAddress, ownerAddress }) {
    const { data: walletClient } = useWalletClient()
    const [loading, setLoading] = useState(false)
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [usePaymaster, setUsePaymaster] = useState(true)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const sendTransaction = async () => {
        if (!walletClient) {
            setError('Wallet not connected')
            return
        }

        if (!recipient || !amount) {
            setError('Please fill in all fields')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            // Step 1: Prepare the call data
            const callData = encodeFunctionData({
                abi: [{
                    name: 'execute',
                    type: 'function',
                    stateMutability: 'nonpayable',
                    inputs: [
                        { name: 'dest', type: 'address' },
                        { name: 'value', type: 'uint256' },
                        { name: 'func', type: 'bytes' }
                    ],
                    outputs: []
                }],
                functionName: 'execute',
                args: [recipient, parseEther(amount), '0x']
            })

            // Step 2: Build UserOperation
            const userOp = {
                sender: accountAddress,
                nonce: 0, // Should fetch from EntryPoint
                callData,
                callGasLimit: 100000,
                verificationGasLimit: 150000,
                preVerificationGas: 21000,
                maxFeePerGas: 1000000000,
                maxPriorityFeePerGas: 1000000000
            }

            // Step 3: Get gas estimate
            const gasEstimate = await fetch('/api/userop/estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userOp)
            }).then(res => res.json())

            // Step 4: Get paymaster signature if needed
            let paymasterAndData = '0x'
            if (usePaymaster) {
                const paymasterResponse = await fetch('/api/paymaster/sign', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userOp })
                }).then(res => res.json())

                paymasterAndData = paymasterResponse.paymasterAndData
            }

            // Step 5: Sign the UserOperation
            // In a real implementation, this would involve signing the userOpHash
            const signature = await walletClient.signMessage({
                message: 'Sign this message to authorize the transaction'
            })

            // Step 6: Submit UserOperation
            const finalUserOp = {
                ...userOp,
                ...gasEstimate.gasEstimate,
                paymasterAndData,
                signature
            }

            const sendResponse = await fetch('/api/userop/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userOp: finalUserOp })
            })

            const sendData = await sendResponse.json()

            if (!sendResponse.ok) {
                throw new Error(sendData.error?.message || 'Failed to send transaction')
            }

            setResult(sendData)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
                🚀 Send Transaction
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        From (Smart Account)
                    </label>
                    <input
                        type="text"
                        value={accountAddress}
                        disabled
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 text-sm font-mono"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        To Address
                    </label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white font-mono"
                        placeholder="0x..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount (ETH)
                    </label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                        placeholder="0.001"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="usePaymaster"
                        checked={usePaymaster}
                        onChange={(e) => setUsePaymaster(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="usePaymaster" className="text-sm text-gray-300">
                        Use Paymaster (Gasless Transaction) ⛽
                    </label>
                </div>

                <button
                    onClick={sendTransaction}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all"
                >
                    {loading ? 'Processing...' : 'Send Transaction'}
                </button>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg space-y-2">
                        <div>
                            <span className="text-gray-400 text-sm">UserOp Hash:</span>
                            <p className="text-green-400 font-mono text-sm break-all">{result.userOpHash}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 text-sm">Status:</span>
                            <p className="text-white text-sm">{result.status}</p>
                        </div>
                        <p className="text-gray-300 text-sm">{result.message}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
