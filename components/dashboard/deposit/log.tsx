import { TableCell, TableRow } from "@/components/ui/table";
import { shortenTxt } from "@/utils/shorten";
import { formatUnits } from "viem";

interface LogProps{
    log: any
}

// Helper function to format BigInt values
const formatBalance = (value: bigint | undefined, decimals: number = 18): string => {
    if (value === undefined || value === null) return "0";
    try {
        return formatUnits(value, decimals);
    } catch {
        return value.toString();
    }
};


export function Log({ log }: LogProps) {

    


    return (
        <>
            <TableRow className="flex w-full items-center h-12">
                <TableCell className="w-1/4">{formatBalance(log.args.amount)}</TableCell>
                <TableCell className="w-1/4">
                    {formatBalance(log.args.mintable)}
                </TableCell>
                <TableCell className="w-1/4">
                    <a 
                        href={`https://celoscan.io/tx/${log.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-600 cursor-pointer underline decoration-yellow-600"
                    >
                        {shortenTxt(log.transactionHash)}
                    </a>
                </TableCell>
                <TableCell className="w-1/4">{new Date(Number(log.args.timestamp) * 1000).toLocaleDateString()}</TableCell>
            </TableRow>
        </>
    )
}
