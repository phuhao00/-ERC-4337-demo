import { useState } from 'react'

export default function AccountCreation({ ownerAddress, onAccountCreated }) {
    const [loading, setLoading] = useState(false)
    const [salt, setSalt] = useState('0')
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const createAccount = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/account/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    owner: ownerAddress,
                    salt: parseInt(salt)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to create account')
            }

            setResult(data)
            if (data.address) {
                onAccountCreated(data.address)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getCounterfactualAddress = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/account/address/${ownerAddress}/${salt}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to get address')
            }

            setResult(data)
            if (data.address) {
                onAccountCreated(data.address)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
                📱 Create Smart Account
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Owner Address
                    </label>
                    <input
                        type="text"
                        value={ownerAddress}
                        disabled
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 text-sm font-mono"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Salt (for deterministic address)
                    </label>
                    <input
                        type="number"
                        value={salt}
                        onChange={(e) => setSalt(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                        placeholder="0"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={getCounterfactualAddress}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        {loading ? 'Loading...' : 'Get Address'}
                    </button>

                    <button
                        onClick={createAccount}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg space-y-2">
                        <div>
                            <span className="text-gray-400 text-sm">Smart Account Address:</span>
                            <p className="text-green-400 font-mono text-sm break-all">{result.address}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 text-sm">Status:</span>
                            <p className="text-white text-sm">
                                {result.isDeployed ? '✅ Deployed' : '⏳ Not deployed yet'}
                            </p>
                        </div>
                        {result.message && (
                            <p className="text-gray-300 text-sm">{result.message}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
