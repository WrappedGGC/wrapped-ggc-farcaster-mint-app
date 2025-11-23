"use client"

import type { PostMethodArgs, MethodCallResponse, TransactionToSignResponse, Event } from "@curvegrid/multibaas-sdk";
import type { SendTransactionParameters } from "@wagmi/core";
import { Configuration, ContractsApi, EventsApi, ChainsApi }from "@curvegrid/multibaas-sdk";
import { useConnection, useReadContract } from "wagmi";
import { useCallback, useEffect, useMemo } from "react";
import { useBlockNumber } from "wagmi"
import { useQueryClient } from "@tanstack/react-query";
import { wrappedGGC } from "@/utils/constants/addresses";
import { wrappedGGCAbi } from "@/utils/abis/wrappedGGC";

export function Wrapper() {

    const { address, isConnected } = useConnection();


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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">        
        </div>
    )
}