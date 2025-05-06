"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Cpu, Database, Clock, Pickaxe } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"

interface MiningDashboardProps {
  blockchain: Array<{
    hash: string
    nonce: number
    data: string
    prevHash: string
    timestamp: number
  }>
  setBlockchain: React.Dispatch<
    React.SetStateAction<
      Array<{
        hash: string
        nonce: number
        data: string
        prevHash: string
        timestamp: number
      }>
    >
  >
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  miningStats: {
    blocksGenerated: number
    totalHashes: number
    hashRate: number
    startTime: number
    lastBlockTime: number
  }
  setMiningStats: React.Dispatch<
    React.SetStateAction<{
      blocksGenerated: number
      totalHashes: number
      hashRate: number
      startTime: number
      lastBlockTime: number
    }>
  >
}

export function MiningDashboard({
  blockchain,
  setBlockchain,
  isLoading,
  setIsLoading,
  miningStats,
  setMiningStats,
}: MiningDashboardProps) {
  const [blockData, setBlockData] = useState("My block data")
  const [miningProgress, setMiningProgress] = useState(0)
  const [estimatedHashes, setEstimatedHashes] = useState(10000)

  // Simple hash function for demonstration
  const calculateHash = (index: number, prevHash: string, timestamp: number, data: string, nonce: number): string => {
    const hashInput = `${index}${prevHash}${timestamp}${data}${nonce}`
    let hash = 0
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    // Convert to hex string and ensure it's positive
    return Math.abs(hash).toString(16).padStart(8, "0")
  }

  // Mine a new block
  const mineBlock = () => {
    if (isLoading) return

    setIsLoading(true)
    setMiningProgress(0)

    const newBlockIndex = blockchain.length
    const prevBlock = blockchain[newBlockIndex - 1]
    const timestamp = Date.now()

    // We'll use a Web Worker to avoid blocking the UI
    const worker = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `
            // Simple hash function for demonstration
            function calculateHash(index, prevHash, timestamp, data, nonce) {
              const hashInput = \`\${index}\${prevHash}\${timestamp}\${data}\${nonce}\`;
              let hash = 0;
              for (let i = 0; i < hashInput.length; i++) {
                const char = hashInput.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
              }
              // Convert to hex string and ensure it's positive
              return Math.abs(hash).toString(16).padStart(8, '0');
            }
            
            // Check if a hash is valid (has leading zeros)
            function isValidHash(hash) {
              return hash.startsWith('000');
            }
            
            onmessage = function(e) {
              const { index, prevHash, timestamp, data, estimatedHashes } = e.data;
              let nonce = 0;
              let hash = '';
              let hashesComputed = 0;
              const startTime = Date.now();
              
              while (true) {
                hash = calculateHash(index, prevHash, timestamp, data, nonce);
                hashesComputed++;
                
                // Report progress every 100 hashes
                if (hashesComputed % 100 === 0) {
                  const progress = Math.min(100, Math.floor((hashesComputed / estimatedHashes) * 100));
                  const currentTime = Date.now();
                  const elapsedSeconds = (currentTime - startTime) / 1000;
                  const hashRate = Math.floor(hashesComputed / elapsedSeconds);
                  postMessage({ 
                    type: 'progress', 
                    hashRate,
                    progress,
                    hashesComputed
                  });
                }
                
                if (isValidHash(hash)) {
                  const endTime = Date.now();
                  const elapsedSeconds = (endTime - startTime) / 1000;
                  const hashRate = Math.floor(hashesComputed / elapsedSeconds);
                  postMessage({ 
                    type: 'success', 
                    hash, 
                    nonce, 
                    hashesComputed,
                    hashRate,
                    elapsedTime: elapsedSeconds
                  });
                  break;
                }
                
                nonce++;
              }
            };
            `,
          ],
          { type: "application/javascript" },
        ),
      ),
    )

    worker.onmessage = (e) => {
      const { type, hash, nonce, hashRate, progress, hashesComputed, elapsedTime } = e.data

      if (type === "progress") {
        setMiningProgress(progress)
        setMiningStats((prev) => ({
          ...prev,
          hashRate,
          totalHashes: prev.totalHashes + hashesComputed,
        }))
      } else if (type === "success") {
        worker.terminate()

        // Create the new block
        const newBlock = {
          hash,
          nonce,
          data: blockData,
          prevHash: prevBlock.hash,
          timestamp,
        }

        setBlockchain((prevChain) => [...prevChain, newBlock])

        setMiningStats((prev) => ({
          ...prev,
          blocksGenerated: prev.blocksGenerated + 1,
          hashRate,
          totalHashes: prev.totalHashes + hashesComputed,
          lastBlockTime: Date.now(),
        }))

        // Update estimated hashes for next mining operation
        setEstimatedHashes(hashesComputed)
        setMiningProgress(100)
        setIsLoading(false)
      }
    }

    worker.postMessage({
      index: newBlockIndex,
      prevHash: prevBlock.hash,
      timestamp,
      data: blockData,
      estimatedHashes,
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mine a New Block</CardTitle>
            <CardDescription>Add data to your block and start mining to add it to the blockchain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="block-data">Block Data</Label>
              <Textarea
                id="block-data"
                placeholder="Enter data for your block..."
                value={blockData}
                onChange={(e) => setBlockData(e.target.value)}
                disabled={isLoading}
                className="min-h-[100px]"
              />
            </div>
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mining Progress</span>
                  <span>{miningProgress}%</span>
                </div>
                <Progress value={miningProgress} className="h-2" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={mineBlock} disabled={isLoading || !blockData.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Cpu className="mr-2 h-4 w-4 animate-spin" />
                  Mining...
                </>
              ) : (
                <>
                  <Pickaxe className="mr-2 h-4 w-4" />
                  Start Mining
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mining Rewards</CardTitle>
            <CardDescription>Educational demonstration of mining rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blocks Mined:</span>
                <span className="font-mono">{miningStats.blocksGenerated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Demo Tokens Earned:</span>
                <span className="font-mono">{(miningStats.blocksGenerated * 0.0000001).toFixed(7)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Block Mined:</span>
                <span className="font-mono">
                  {miningStats.lastBlockTime ? formatDistanceToNow(miningStats.lastBlockTime) : "Never"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Note: This is for educational purposes only. No real cryptocurrency is being mined.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Blocks Mined</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{miningStats.blocksGenerated}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total blocks added to the chain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hash Rate</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{miningStats.hashRate.toLocaleString()}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Hashes per second</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Hashes</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{miningStats.totalHashes.toLocaleString()}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total hashes computed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How Mining Works</CardTitle>
            <CardDescription>Educational explanation of blockchain mining</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <p>Mining is the process of adding new blocks to a blockchain by solving a computational puzzle.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>The Challenge:</strong> Find a hash that starts with "000" by trying different nonce values.
              </li>
              <li>
                <strong>Proof of Work:</strong> The computer must perform many calculations to find a valid hash.
              </li>
              <li>
                <strong>Validation:</strong> Once found, the block is added to the chain and linked to the previous
                block.
              </li>
              <li>
                <strong>Reward:</strong> In real blockchains, miners receive cryptocurrency as a reward.
              </li>
            </ol>
            <p>
              This demo simulates the mining process in your browser to demonstrate how blockchain technology works.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
