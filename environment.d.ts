declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_ALCHEMY_RPC_URL: string
            NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL: string
            NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY: string
        }
    }
}

export {}