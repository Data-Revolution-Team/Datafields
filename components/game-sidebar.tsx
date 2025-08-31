"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Datacenter, PopulationCenter } from "@/app/page"

interface GameSidebarProps {
  budget: number
  gameStarted: boolean
  onStartGame: () => void
  onResetGame: () => void
  datacenters: Datacenter[]
  populationCenters: PopulationCenter[]
  calculateLatency: (dc: Datacenter, pc: PopulationCenter) => number
}

export function GameSidebar({
  budget,
  gameStarted,
  onStartGame,
  onResetGame,
  datacenters,
  populationCenters,
  calculateLatency,
}: GameSidebarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalSpent = 50000000 - budget
  const spentPercentage = (totalSpent / 50000000) * 100

  const calculateAverageLatency = () => {
    if (datacenters.length === 0) return 0

    let totalLatency = 0
    let connections = 0

    datacenters.forEach((dc) => {
      populationCenters.forEach((pc) => {
        totalLatency += calculateLatency(dc, pc)
        connections++
      })
    })

    return connections > 0 ? Math.round(totalLatency / connections) : 0
  }

  const totalCapacity = datacenters.reduce((sum, dc) => sum + dc.capacity, 0)
  const totalPowerConsumption = datacenters.reduce((sum, dc) => sum + dc.powerConsumption, 0)

  return (
    <div className="space-y-4">
      {/* Game Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Game Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!gameStarted ? (
            <Button onClick={onStartGame} className="w-full" size="lg">
              Start Game
            </Button>
          ) : (
            <Button onClick={onResetGame} variant="outline" className="w-full bg-transparent">
              Reset Game
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Budget */}
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Remaining</span>
              <span className="font-mono">{formatCurrency(budget)}</span>
            </div>
            <Progress value={100 - spentPercentage} className="h-2" />
          </div>
          <div className="text-xs text-muted-foreground">
            Spent: {formatCurrency(totalSpent)} of {formatCurrency(50000000)}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {gameStarted && (
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Datacenters</div>
                <div className="font-bold text-lg">{datacenters.length}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg Latency</div>
                <div className="font-bold text-lg">{calculateAverageLatency()}ms</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Servers</div>
                <div className="font-bold text-lg">{totalCapacity.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Power Usage</div>
                <div className="font-bold text-lg">{totalPowerConsumption}MW</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions & Legend */}
      <Card>
        <CardHeader>
          <CardTitle>How to Play & Legend</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* How to Play Column */}
            <div className="space-y-2">
              <h4 className="font-semibold text-base mb-2">How to Play</h4>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">
                  1
                </Badge>
                <span>Click a datacenter type, then click on the map to place it</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">
                  2
                </Badge>
                <span>Click on placed datacenters to see latency lines</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">
                  3
                </Badge>
                <span>Consider proximity to population centers and power sources</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">
                  4
                </Badge>
                <span>Manage your budget wisely - you have $50M to spend</span>
              </div>
            </div>

            {/* Legend Column */}
            <div className="space-y-2">
              <h4 className="font-semibold text-base mb-2">Map Legend</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Population Centers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span>Coal Power</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Hydro Power</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-lg"></div>
                <span>Small Datacenter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-lg"></div>
                <span>Medium Datacenter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-lg"></div>
                <span>Large Datacenter</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
