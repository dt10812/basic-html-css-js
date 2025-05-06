import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Database, Clock } from "lucide-react"

interface MiningStatsProps {
  stats: {
    blocksGenerated: number
    totalHashes: number
    hashRate: number
    startTime: number
  }
}

export function MiningStats({ stats }: MiningStatsProps) {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000)

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blocks Mined</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.blocksGenerated}</div>
          <p className="text-xs text-muted-foreground">Total blocks added to the chain</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hash Rate</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hashRate.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Hashes per second</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hashes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHashes.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Computed since start</p>
        </CardContent>
      </Card>
    </div>
  )
}
