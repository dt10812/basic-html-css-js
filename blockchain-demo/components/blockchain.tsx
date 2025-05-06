"use client"

import type React from "react"

import { Block } from "@/components/block"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BlockchainProps {
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

export function Blockchain({
  blockchain,
  setBlockchain,
  isLoading,
  setIsLoading,
  miningStats,
  setMiningStats,
}: BlockchainProps) {
  // Check if a hash is valid (has leading zeros)
  const isValidHash = (hash: string): boolean => {
    return hash.startsWith("000")
  }

  // Check if a block is valid
  const isBlockValid = (index: number): boolean => {
    const block = blockchain[index]

    // Genesis block is always valid
    if (index === 0 && block.prevHash === "0") {
      return true
    }

    // Check if hash is valid
    if (!isValidHash(block.hash)) {
      return false
    }

    // Check if prevHash matches the hash of the previous block
    if (index > 0 && block.prevHash !== blockchain[index - 1].hash) {
      return false
    }

    return true
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Explorer</CardTitle>
          <CardDescription>View all blocks in the blockchain and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blockchain.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No blocks in the blockchain yet. Start mining!</p>
            ) : (
              blockchain.map((block, index) => (
                <Block
                  key={index}
                  index={index}
                  hash={block.hash}
                  prevHash={block.prevHash}
                  nonce={block.nonce}
                  data={block.data}
                  timestamp={block.timestamp}
                  isValid={isBlockValid(index)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About This Demo</CardTitle>
          <CardDescription>Educational information about blockchain technology</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          <p>This is a simplified educational demonstration of how blockchain technology works. It shows:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>How blocks are chained together using cryptographic hashes</li>
            <li>The proof-of-work concept through mining (finding a hash with leading zeros)</li>
            <li>How changing data in one block would invalidate all subsequent blocks</li>
            <li>The computational effort required to mine blocks</li>
          </ul>
          <div className="bg-muted p-4 rounded-md mt-4">
            <p className="font-medium">Important Note:</p>
            <p className="mt-2">
              This is for educational purposes only and is not a real cryptocurrency. No actual tokens of value are
              being created or transferred.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
