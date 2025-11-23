import { TableCell, TableRow } from "@/components/ui/table";
import { shortenTxt } from "@/utils/shorten";

interface LogProps{
    log: any
}


export function Log({ log }: LogProps) {

    


    return (
        <>
            <TableRow className="flex w-full items-center h-12">
                <TableCell className="w-1/4">{log.eventName === "FleetOrdered" ? log.args.ids.join(",") : log.eventName === "FleetFractionOrdered" ? log.args.id : log.args.ids.join(",")}</TableCell>
                <TableCell className="w-1/4">
                    {}
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
                <TableCell className="w-1/4">{}</TableCell>
            </TableRow>
        </>
    )
}
