import { useState } from 'react'
import { parseEther } from 'viem'
import useBiconomyAccount from '../hooks/useBiconomyAccount'

/**
 * Example component showing how to use Biconomy for gasless transactions
 * This is an alternative to the custom paymaster implementation
 */
export default function BiconomyExample() {
    const {
        smartAccount,
        loading: accountLoading,
        error: accountError,
        initializeBiconomy,
        sendSponsoredTransaction
    } = useBiconomyAccount()

    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [txLoading, setTxLoading] = useState(false)
    const [txResult, setTxResult] = useState(null)
    const [txError, setTxError] = useState(null)

    const handleInitialize = async () => {
        const result = await initializeBiconomy()
        if (result) {
            console.log('Biconomy account initialized:', result.address)
        }
    }

    const handleSendTransaction = async () => {
        if (!smartAccount) {
            setTxError('Please initialize Biconomy account first')
            return
        }

        if (!recipient || !amount) {
            setTxError('Please fill in all fields')
            return
        }

        setTxLoading(true)
        setTxError(null)
        setTxResult(null)

        try {
            const result = await sendSponsoredTransaction(
                recipient,
                parseEther(amount),
                '0x'
            )

            setTxResult(result)
            console.log('Transaction successful:', result)
        } catch (err) {
            setTxError(err.message)
        } finally {
            setTxLoading(false)
        }
    }

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
                🚀 Biconomy Gasless Transactions
            </h2>

            <div className="space-y-4">
                {!smartAccount ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">
                            Initialize Biconomy to enable gasless transactions
                        </p>
                        <button
                            onClick={handleInitialize}
                            disabled={accountLoading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                            {accountLoading ? 'Initializing...' : 'Initialize Biconomy'}
                        </button>
                        {accountError && (
                            <p className="text-red-400 text-sm mt-4">{accountError}</p>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                            <p className="text-green-400 text-sm">
                                ✅ Biconomy account active
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recipient Address
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

                        <button
                            onClick={handleSendTransaction}
                            disabled={txLoading}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all"
                        >
                            {txLoading ? 'Sending...' : 'Send Sponsored Transaction ⛽'}
                        </button>

                        {txError && (
                            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                                <p className="text-red-400 text-sm">{txError}</p>
                            </div>
                        )}

                        {txResult && (
                            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg space-y-2">
                                <div>
                                    <span className="text-gray-400 text-sm">Transaction Hash:</span>
                                    <p className="text-green-400 font-mono text-sm break-all">
                                        {txResult.transactionHash}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Status:</span>
                                    <p className="text-white text-sm">
                                        {txResult.success ? '✅ Success' : '❌ Failed'}
                                    </p>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    ⛽ This transaction was sponsored - no gas paid by user!
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                    ℹ️ About Biconomy
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                    <li>• No gas fees for users - transactions are sponsored</li>
                    <li>• Faster onboarding - users don't need ETH</li>
                    <li>• Built-in bundler and paymaster infrastructure</li>
                    <li>• Enterprise-grade reliability and scalability</li>
                </ul>
            </div>
        </div>
    )
}
