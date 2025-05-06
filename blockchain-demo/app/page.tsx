"use client"

import { useState, useEffect } from "react"
import { Blockchain } from "@/components/blockchain"
import { MiningDashboard } from "@/components/mining-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const [blockchain, setBlockchain] = useState<
    { hash: string; nonce: number; data: string; prevHash: string; timestamp: number }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [miningStats, setMiningStats] = useState({
    blocksGenerated: 0,
    totalHashes: 0,
    hashRate: 0,
    startTime: Date.now(),
    lastBlockTime: 0,
  })

  // Initialize blockchain with genesis block
  useEffect(() => {
    if (blockchain.length === 0) {
      const genesisBlock = {
        hash: "000genesis42069",
        nonce: 0,
        data: "Genesis Block - First block in the chain",
        prevHash: "0",
        timestamp: Date.now(),
      }
      setBlockchain([genesisBlock])
    }
  }, [blockchain])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"></div>
              <h1 className="text-xl font-bold">BlockChain Demo</h1>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </div>
        </header>

        <div className="container py-6 flex-1">
          <Tabs defaultValue="mine" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mine">Mine Blocks</TabsTrigger>
              <TabsTrigger value="blockchain">View Blockchain</TabsTrigger>
            </TabsList>
            <TabsContent value="mine" className="mt-6">
              <MiningDashboard
                blockchain={blockchain}
                setBlockchain={setBlockchain}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                miningStats={miningStats}
                setMiningStats={setMiningStats}
              />
            </TabsContent>
            <TabsContent value="blockchain" className="mt-6">
              <Blockchain
                blockchain={blockchain}
                setBlockchain={setBlockchain}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                miningStats={miningStats}
                setMiningStats={setMiningStats}
              />
            </TabsContent>
          </Tabs>
        </div>

        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} BlockChain Demo. Educational purposes only.
            </p>
            <p className="text-sm text-muted-foreground">This is not a real cryptocurrency.</p>
          </div>
        </footer>
      </main>
    </ThemeProvider>
  )
}
