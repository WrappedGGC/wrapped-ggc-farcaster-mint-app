import { useEffect, useState } from "react";
import { wrappedGGC } from '@/utils/constants/addresses';
import { useBlockNumber } from 'wagmi';
import { wrappedGGCAbi } from '@/utils/abis/wrappedGGC';
import { publicClient } from "@/utils/client";



export const useGetLogs = (address: `0x${string}` | undefined) => {
    const [logs, setLogs] = useState<any[] | undefined>(undefined);

    const { data: blockNumber } = useBlockNumber({ watch: true }) 
    
    async function fetchDepositLogs() {
        if (address) {
            const eventLogs = await publicClient.getLogs({
                address: wrappedGGC,
                event: wrappedGGCAbi[27],
                args: {
                    to: address,
                },
                fromBlock: BigInt(51986770), 
                toBlock: 'latest'
            })   
            return eventLogs
        }
    }
    async function fetchMintLogs() {
        if (address) {
            const eventLogs = await publicClient.getLogs({
                address: wrappedGGC,
                event: wrappedGGCAbi[29],
                args: {
                    to: address,
                },
                fromBlock: BigInt(51986770), 
                toBlock: 'latest'
            })   
            return eventLogs
        }
    }
    useEffect(() => {
        async function sortLogs() {
            const depositLogs = await fetchDepositLogs()
            const mintLogs = await fetchMintLogs()
            if (depositLogs && mintLogs) {
                const combinedLogs = [...depositLogs, ...mintLogs];
                const sortedLogs = combinedLogs.sort((a, b) => {
                    return Number(b.blockNumber) - Number(a.blockNumber);
                });
                setLogs(sortedLogs);  
            }
        }
        sortLogs()
    }, [address, blockNumber]);

    return { logs };
};
