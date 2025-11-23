"use client"

import { useConnection, useReadContract } from "wagmi";
import { useEffect } from "react";
import { useBlockNumber } from "wagmi"
import { useQueryClient } from "@tanstack/react-query";
import { wrappedGGC } from "@/utils/constants/addresses";
import { wrappedGGCAbi } from "@/utils/abis/wrappedGGC";
import useMultiBaas from "@/hooks/useMultiBaas";
import { formatUnits } from "viem";

// Helper function to format BigInt values
const formatBalance = (value: bigint | undefined, decimals: number = 18): string => {
    if (value === undefined || value === null) return "0";
    try {
        return formatUnits(value, decimals);
    } catch {
        return value.toString();
    }
};

// Helper function to format address
const formatAddress = (address: string | undefined): string => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function Wrapper() {

    const { address, isConnected } = useConnection();
    
    const { getDepositEvents, getMintEvents } = useMultiBaas();
    console.log(getDepositEvents(), getMintEvents());

    const depositBalanceQueryClient = useQueryClient() 
    const mintBalanceQueryClient = useQueryClient() 
    const totalDepositQueryClient = useQueryClient()
    const totalPendingMintQueryClient = useQueryClient()
    const { data: blockNumber } = useBlockNumber({ watch: true }) 


    // read balance of deposited
    const { data: depositBalance, queryKey: depositBalanceQueryKey } = useReadContract({
        address: wrappedGGC,
        abi: wrappedGGCAbi,
        functionName: "depositBalance",
        args: [ address! ],
    });
    useEffect(() => { 
        depositBalanceQueryClient.invalidateQueries({ queryKey: depositBalanceQueryKey }) 
    }, [blockNumber, depositBalanceQueryClient, depositBalanceQueryKey]) 

    // read balance of mintable
    const { data: mintBalance, queryKey: mintBalanceQueryKey } = useReadContract({
        address: wrappedGGC,
        abi: wrappedGGCAbi,
        functionName: "mintBalance",
        args: [ address! ],
    });
    useEffect(() => { 
        mintBalanceQueryClient.invalidateQueries({ queryKey: mintBalanceQueryKey }) 
    }, [blockNumber, mintBalanceQueryClient, mintBalanceQueryKey]) 


    // read balance of total deposited
    const { data: totalDeposit, queryKey: totalDepositQueryKey } = useReadContract({
        address: wrappedGGC,
        abi: wrappedGGCAbi,
        functionName: "totalDeposited",
    });
    useEffect(() => { 
        totalDepositQueryClient.invalidateQueries({ queryKey: totalDepositQueryKey }) 
    }, [blockNumber, totalDepositQueryClient, totalDepositQueryKey]) 

    
    // read total pending mint
    const { data: totalPendingMint, queryKey: totalPendingMintQueryKey } = useReadContract({
        address: wrappedGGC,
        abi: wrappedGGCAbi,
        functionName: "totalPendingMint",
    });
    useEffect(() => { 
        totalPendingMintQueryClient.invalidateQueries({ queryKey: totalPendingMintQueryKey }) 
    }, [blockNumber, totalPendingMintQueryClient, totalPendingMintQueryKey]) 
    
    

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">     
            {isConnected ? (
                <div className="w-full max-w-md space-y-4">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Your Dashboard</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                            {formatAddress(address)}
                        </p>
                    </div>

                    {/* Balance Cards */}
                    <div className="space-y-3">
                        {/* Deposit Balance Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                        Deposit Balance
                                    </p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {formatBalance(depositBalance)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mint Balance Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                        Mintable Balance
                                    </p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {formatBalance(mintBalance)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Deposit Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                        Total Deposited
                                    </p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {formatBalance(totalDeposit)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Pending Mint Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                        Total Pending Mint
                                    </p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {formatBalance(totalPendingMint)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold">Connect your wallet</h1>
                </div>
            )}   
        </div>
    )
}