import { CheckCircledIcon } from "@radix-ui/react-icons"

interface ErrorProp{
    message?: string
}

export const ErrorForm = ({message}: ErrorProp) => {
    return(
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <CheckCircledIcon className="h-4 w-4"/>
            <p>{message}</p>
        </div>
    )
}