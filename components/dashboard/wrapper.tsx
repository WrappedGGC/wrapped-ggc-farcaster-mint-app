"use client"

import { useConnection, useReadContract, useWriteContract } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { useBlockNumber } from "wagmi"
import { useQueryClient } from "@tanstack/react-query";
import { stablecoin, wrappedGGC } from "@/utils/constants/addresses";
import { wrappedGGCAbi } from "@/utils/abis/wrappedGGC";
import useMultiBaas from "@/hooks/useMultiBaas";
import { formatUnits, parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import type { UseWaitForTransactionReceiptReturnType } from "wagmi";
import { Coins } from "lucide-react";
import { Logs } from "./deposit/logs";

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


interface EventInput {
    name: string;
    type: string;
    value: string;
  }
  
  export interface EventData {
    event: {
      name: string;
      inputs: EventInput[];
    };
    triggeredAt: string;
    transaction: {
      txHash: string;
    };
  }
  
  interface EventsProps {
    txReceipt: UseWaitForTransactionReceiptReturnType['data'] | undefined;
  }

export function Wrapper() {

    const { address, isConnected } = useConnection();
    
    const { getDepositEvents, getMintEvents } = useMultiBaas();
    console.log(getDepositEvents(), getMintEvents());
    const [events, setEvents] = useState<EventData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Wrap fetchEvents with useCallback
  const fetchEvents = useCallback(async () => {
    setIsFetching(true);
    try {
      const fetchedEvents = await getDepositEvents();
      if (fetchedEvents) {
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsFetching(false);
    }
  }, [getDepositEvents]);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events whenever txReceipt changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

    const balanceQueryClient = useQueryClient()
    const depositBalanceQueryClient = useQueryClient() 
    const mintBalanceQueryClient = useQueryClient() 
    const totalDepositQueryClient = useQueryClient()
    const totalPendingMintQueryClient = useQueryClient()
    const { data: blockNumber } = useBlockNumber({ watch: true }) 


    // read balance of wggc
    const { data: balance, queryKey: balanceQueryKey } = useReadContract({
        address: wrappedGGC,
        abi: wrappedGGCAbi,
        functionName: "balanceOf",
        args: [ address! ],
    });
    useEffect(() => { 
        balanceQueryClient.invalidateQueries({ queryKey: balanceQueryKey }) 
    }, [blockNumber, balanceQueryClient, balanceQueryKey]) 


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
    
    // Write contract for minting
    const { writeContract, isPending } = useWriteContract();

    const handleBuyQuarterCoin = () => {
        if (!address) return;
        
        writeContract({
            address: wrappedGGC,
            abi: wrappedGGCAbi,
            functionName: "depositQuaterOZ",
            args: [stablecoin],
        });
    };

    const handleBuyHalfCoin = () => {
        if (!address) return;

        writeContract({
            address: wrappedGGC,
            abi: wrappedGGCAbi,
            functionName: "depositHalfOZ",
            args: [stablecoin],
        });
    };

    const handleBuyCoin = () => {
        if (!address) return;
        
        writeContract({
            address: wrappedGGC,
            abi: wrappedGGCAbi,
            functionName: "depositOZ",
            args: [stablecoin],
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">     
            {isConnected ? (
                <div className="w-full max-w-md space-y-4">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Your wrappedGGC Dashboard</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                            {formatAddress(address)}
                        </p>
                    </div>

                    <Logs events={events} />

                    {/* Balance Card - Top */}
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                    Balance
                                </p>
                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {formatBalance(balance)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Balance Cards - 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Deposit Balance Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                                    Deposit Balance
                                </p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    {formatBalance(depositBalance)}
                                </p>
                            </div>
                        </div>

                        {/* Mint Balance Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                                    Mintable Balance
                                </p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    {formatBalance(mintBalance)}
                                </p>
                            </div>
                        </div>

                        {/* Total Deposit Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                                    Total Deposited
                                </p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    {formatBalance(totalDeposit)}
                                </p>
                            </div>
                        </div>

                        {/* Total Pending Mint Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                                    Total Pending Mint
                                </p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    {formatBalance(totalPendingMint)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buy Gold Coin Buttons */}
                    <div className="space-y-3 mt-6">
                        <div className="space-y-2">
                            <Button
                                onClick={() => handleBuyCoin()}
                                disabled={isPending}
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:bg-amber-600 dark:hover:bg-amber-700 dark:disabled:bg-zinc-700 text-white font-semibold py-3"
                                size="lg"
                            >
                                <Coins />
                                {isPending ? "Processing..." : "Buy 1 oz Gold Coin"}
                            </Button>
                            <Button
                                onClick={() => handleBuyHalfCoin()}
                                disabled={isPending }
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:bg-amber-600 dark:hover:bg-amber-700 dark:disabled:bg-zinc-700 text-white font-semibold py-3"
                                size="lg"
                            >
                                <Coins />
                                {isPending ? "Processing..." : "Buy 1/2 oz Gold Coin"}
                            </Button>
                            <Button
                                onClick={() => handleBuyQuarterCoin()}
                                disabled={isPending }
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:bg-amber-600 dark:hover:bg-amber-700 dark:disabled:bg-zinc-700 text-white font-semibold py-3"
                                size="lg"
                            >
                                <Coins />
                                {isPending ? "Processing..." : "Buy 1/4 oz Gold Coin"}
                            </Button>
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