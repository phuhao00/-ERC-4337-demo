import { useEffect, useState } from 'react'

export default function AccountInfo({ accountAddress }) {
    const [info, setInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchAccountInfo = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/account/${accountAddress}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to fetch account info')
            }

            setInfo(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (accountAddress) {
            fetchAccountInfo()
        }
    }, [accountAddress])

    if (loading) {
        return (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <p className="text-gray-400">Loading account info...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <p className="text-red-400">{error}</p>
            </div>
        )
    }

    if (!info) return null

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">
                    💰 Account Info
                </h2>
                <button
                    onClick={fetchAccountInfo}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <span className="text-gray-400 text-sm">Address:</span>
                    <p className="text-white font-mono text-sm break-all">{info.address}</p>
                </div>

                <div>
                    <span className="text-gray-400 text-sm">Deployment Status:</span>
                    <p className="text-white text-sm">
                        {info.isDeployed ? (
                            <span className="text-green-400">✅ Deployed</span>
                        ) : (
                            <span className="text-yellow-400">⏳ Not Deployed</span>
                        )}
                    </p>
                </div>

                {info.isDeployed && (
                    <>
                        <div>
                            <span className="text-gray-400 text-sm">Balance:</span>
                            <p className="text-white text-lg font-semibold">
                                {info.balanceFormatted}
                            </p>
                        </div>
                    </>
                )}

                {!info.isDeployed && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                        <p className="text-blue-400 text-sm">
                            ℹ️ Account will be deployed with the first transaction
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
