import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface BlockProps {
  index: number
  hash: string
  prevHash: string
  nonce: number
  data: string
  timestamp: number
  isValid: boolean
}

export function Block({ index, hash, prevHash, nonce, data, timestamp, isValid }: BlockProps) {
  return (
    <Card className={`w-full border-l-4 ${isValid ? "border-l-green-500" : "border-l-red-500"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            Block #{index}
            <Badge variant={isValid ? "success" : "destructive"} className="flex items-center gap-1 ml-2">
              {isValid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {isValid ? "Valid" : "Invalid"}
            </Badge>
          </CardTitle>
          <div className="text-xs text-muted-foreground">{formatDate(timestamp)}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-2">
          <div className="font-medium">Hash:</div>
          <div className="col-span-2 font-mono text-xs truncate">{hash}</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="font-medium">Previous Hash:</div>
          <div className="col-span-2 font-mono text-xs truncate">{prevHash}</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="font-medium">Nonce:</div>
          <div className="col-span-2">{nonce.toLocaleString()}</div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Data:</div>
          <div className="bg-muted p-2 rounded text-xs font-mono whitespace-pre-wrap break-words">{data}</div>
        </div>
      </CardContent>
    </Card>
  )
}
