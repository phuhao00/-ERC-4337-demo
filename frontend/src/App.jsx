import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import './App.css'
import AccountCreation from './components/AccountCreation'
import AccountInfo from './components/AccountInfo'
import SendTransaction from './components/SendTransaction'

function App() {
    const { address, isConnected } = useAccount()
    const [smartAccountAddress, setSmartAccountAddress] = useState(null)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            ⚡ Account Abstraction Demo
                        </h1>
                        <p className="text-gray-400">
                            ERC-4337 Smart Contract Wallet with Gasless Transactions
                        </p>
                    </div>
                    <ConnectButton />
                </header>

                {/* Main Content */}
                {!isConnected ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto border border-gray-700">
                            <svg
                                className="w-24 h-24 mx-auto mb-6 text-purple-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Connect Your Wallet
                            </h2>
                            <p className="text-gray-400 mb-8">
                                Connect your wallet to create and manage smart contract accounts
                            </p>
                            <ConnectButton />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-8">
                            <AccountCreation
                                ownerAddress={address}
                                onAccountCreated={setSmartAccountAddress}
                            />

                            {smartAccountAddress && (
                                <AccountInfo accountAddress={smartAccountAddress} />
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {smartAccountAddress && (
                                <SendTransaction
                                    accountAddress={smartAccountAddress}
                                    ownerAddress={address}
                                />
                            )}

                            {/* Info Cards */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    🎯 Features
                                </h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>ERC-4337 compliant smart contract wallets</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Gasless transactions via Paymaster</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Batch transactions support</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Social recovery capabilities</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Upgradeable account logic</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-16 text-center text-gray-500">
                    <p>Built with Solidity, Hardhat, React, Viem, Wagmi & RainbowKit</p>
                </footer>
            </div>
        </div>
    )
}

export default App
