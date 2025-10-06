import { createSmartAccountClient, PaymasterMode } from '@biconomy/account'
import { useState } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'

export default function useBiconomyAccount() {
    const { data: walletClient } = useWalletClient()
    const publicClient = usePublicClient()
    const [smartAccount, setSmartAccount] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const initializeBiconomy = async () => {
        if (!walletClient) {
            setError('Wallet not connected')
            return null
        }

        setLoading(true)
        setError(null)

        try {
            const biconomySmartAccount = await createSmartAccountClient({
                signer: walletClient,
                bundlerUrl: `https://bundler.biconomy.io/api/v2/${process.env.VITE_CHAIN_ID}/nxt_${process.env.VITE_BICONOMY_PAYMASTER_API_KEY}`,
                biconomyPaymasterApiKey: process.env.VITE_BICONOMY_PAYMASTER_API_KEY,
                rpcUrl: process.env.VITE_RPC_URL
            })

            const address = await biconomySmartAccount.getAccountAddress()

            setSmartAccount(biconomySmartAccount)
            setLoading(false)

            return { account: biconomySmartAccount, address }
        } catch (err) {
            setError(err.message)
            setLoading(false)
            return null
        }
    }

    const sendSponsoredTransaction = async (to, value, data = '0x') => {
        if (!smartAccount) {
            throw new Error('Smart account not initialized')
        }

        try {
            const userOpResponse = await smartAccount.sendTransaction(
                {
                    to,
                    value,
                    data
                },
                {
                    paymasterServiceData: { mode: PaymasterMode.SPONSORED }
                }
            )

            const { transactionHash } = await userOpResponse.waitForTxHash()
            const userOpReceipt = await userOpResponse.wait()

            return {
                transactionHash,
                userOpReceipt,
                success: userOpReceipt.success
            }
        } catch (err) {
            throw new Error(`Transaction failed: ${err.message}`)
        }
    }

    return {
        smartAccount,
        loading,
        error,
        initializeBiconomy,
        sendSponsoredTransaction
    }
}
