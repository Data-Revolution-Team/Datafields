"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapComponent } from "@/components/map-component"

export interface Datacenter {
    id: string
    name: string
    x: number
    y: number
    cost: number
    powerConsumption: number
    capacity: number
}

export interface PopulationCenter {
    id: string
    name: string
    x: number
    y: number
    population: number
}

export interface PowerGenerator {
    id: string
    name: string
    x: number
    y: number
    capacity: number
    type: "coal" | "gas" | "solar" | "wind" | "hydro"
    powerLevel: number // 100 = 100%, 125 = 125% (max 25% increase)
}

export default function DatacenterSimulation() {
    const [budget, setBudget] = useState(1500000000) // $1.5B starting budget
    const [datacenters, setDatacenters] = useState<Datacenter[]>([])
    const [selectedDatacenter, setSelectedDatacenter] = useState<string | null>(null)
    const [selectedDatacenterType, setSelectedDatacenterType] = useState<string | null>(null)
    const [selectedPowerGenerator, setSelectedPowerGenerator] = useState<string | null>(null)
    const [gameStarted, setGameStarted] = useState(false)
    const [averageLatency, setAverageLatency] = useState(0)
    const mapRef = useRef<HTMLDivElement>(null)

    // NSW Population Centers (approximate coordinates)
    const populationCenters: PopulationCenter[] = [
        { id: "sydney", name: "Sydney", x: 400, y: 350, population: 5312000 },
        { id: "newcastle", name: "Newcastle", x: 420, y: 280, population: 322278 },
        { id: "wollongong", name: "Wollongong", x: 380, y: 380, population: 302739 },
        { id: "centralcoast", name: "Central Coast", x: 410, y: 320, population: 333627 },
        { id: "albury", name: "Albury", x: 320, y: 500, population: 53677 },
        { id: "wagga", name: "Wagga Wagga", x: 280, y: 450, population: 56442 },
        { id: "dubbo", name: "Dubbo", x: 250, y: 350, population: 43516 },
        { id: "tamworth", name: "Tamworth", x: 300, y: 280, population: 42872 },
    ]

    // Power Generators (approximate locations)
    const [powerGenerators, setPowerGenerators] = useState<PowerGenerator[]>([
        { id: "eraring", name: "Eraring Power Station", x: 430, y: 340, capacity: 2880, type: "coal", powerLevel: 100 },
        { id: "bayswater", name: "Bayswater Power Station", x: 380, y: 300, capacity: 2640, type: "coal", powerLevel: 100 },
        { id: "liddell", name: "Liddell Power Station", x: 370, y: 290, capacity: 2000, type: "coal", powerLevel: 100 },
        { id: "tumut", name: "Tumut Hydro", x: 300, y: 420, capacity: 1800, type: "hydro", powerLevel: 100 },
        { id: "shoalhaven", name: "Shoalhaven Hydro", x: 360, y: 400, capacity: 240, type: "hydro", powerLevel: 100 },
    ])

    const handlePlaceDatacenter = useCallback(
        (x: number, y: number, datacenterType?: string) => {
            const typeToPlace = datacenterType || selectedDatacenterType
            if (!typeToPlace || !gameStarted) return

            const costs = {
                tier1: 10000000, // $10M
                tier2: 100000000, // $100M
                tier3: 500000000, // $500M
                tier4: 1000000000, // $1B
            }

            const powerRequirements = {
                tier1: 5, // 5MW
                tier2: 35, // 35MW
                tier3: 75, // 75MW
                tier4: 100, // 100MW
            }

            const capacities = {
                tier1: 1000, // 1,000 servers
                tier2: 5000, // 5,000 servers
                tier3: 15000, // 15,000 servers
                tier4: 30000, // 30,000 servers
            }

            const cost = costs[typeToPlace as keyof typeof costs]

            if (budget >= cost) {
                const newDatacenter: Datacenter = {
                    id: `dc-${Date.now()}`,
                    name: `Tier ${typeToPlace.slice(-1)} DC`,
                    x,
                    y,
                    cost,
                    powerConsumption: powerRequirements[typeToPlace as keyof typeof powerRequirements],
                    capacity: capacities[typeToPlace as keyof typeof capacities],
                }


                setDatacenters((prev) => [...prev, newDatacenter])
                setBudget((prev) => prev - cost)
                setSelectedDatacenterType(null)
            }
        },
        [budget, gameStarted, selectedDatacenterType],
    )

    const handleUpdateDatacenter = useCallback((id: string, x: number, y: number) => {
        setDatacenters((prev) => prev.map((dc) => (dc.id === id ? { ...dc, x, y } : dc)))
    }, [])

    const handleDeleteDatacenter = useCallback(() => {
        if (!selectedDatacenter || !gameStarted) return

        const datacenterToDelete = datacenters.find((dc) => dc.id === selectedDatacenter)
        if (!datacenterToDelete) return

        setDatacenters((prev) => prev.filter((dc) => dc.id !== selectedDatacenter))
        setBudget((prev) => prev + datacenterToDelete.cost)
        setSelectedDatacenter(null)
    }, [selectedDatacenter, gameStarted, datacenters])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Delete" || event.key === "Backspace") {
                event.preventDefault()
                handleDeleteDatacenter()
            }
        }

        if (gameStarted) {
            window.addEventListener("keydown", handleKeyDown)
            return () => window.removeEventListener("keydown", handleKeyDown)
        }
    }, [gameStarted, handleDeleteDatacenter])

    const calculateLatency = (dc: Datacenter, pc: PopulationCenter) => {
        // Victoria bounds for coordinate conversion (must match map-component.tsx)
        const vicBounds = {
            north: -34,
            south: -39,
            west: 141,
            east: 150,
        }

        // Use a standard map size for consistent calculations
        // This should match the default dimensions in map-component.tsx
        const mapWidth = 600
        const mapHeight = 600

        const convertToLatLng = (x: number, y: number) => {
            const lng = vicBounds.west + (x / mapWidth) * (vicBounds.east - vicBounds.west)
            const lat = vicBounds.north - (y / mapHeight) * (vicBounds.north - vicBounds.south)
            return { lat, lng }
        }

        const dcLatLng = convertToLatLng(dc.x, dc.y)
        const pcLatLng = convertToLatLng(pc.x, pc.y)

        const R = 6371 // Earth's radius in km
        const dLat = ((pcLatLng.lat - dcLatLng.lat) * Math.PI) / 180
        const dLng = ((pcLatLng.lng - dcLatLng.lng) * Math.PI) / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((dcLatLng.lat * Math.PI) / 180) *
            Math.cos((pcLatLng.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c

        // Convert distance to latency: 5ms per 100km is a reasonable approximation
        const latency = Math.round(distance * 0.05)

        return latency
    }

    const calculateUpgradeCost = (generator: PowerGenerator) => {
        const baseCapacity = generator.capacity
        const currentLevel = generator.powerLevel
        const nextLevel = Math.min(currentLevel + 5, 125)

        if (nextLevel > 125) return 0

        // Exponential cost calculation: base cost * (level increase factor)^(upgrades done)
        const upgradesDone = (currentLevel - 100) / 5
        const baseCost = baseCapacity * 1000 // $1000 per MW base capacity
        const cost = baseCost * Math.pow(2, upgradesDone) // Exponential increase

        return Math.round(cost)
    }

    const handleUpgradePowerGenerator = useCallback(
        (generatorId: string) => {
            const generator = powerGenerators.find((g) => g.id === generatorId)
            if (!generator || !gameStarted) return

            const upgradeCost = calculateUpgradeCost(generator)
            if (budget < upgradeCost || generator.powerLevel >= 125) return

            setPowerGenerators((prev) =>
                prev.map((g) => (g.id === generatorId ? { ...g, powerLevel: Math.min(g.powerLevel + 5, 125) } : g)),
            )
            setBudget((prev) => prev - upgradeCost)
        },
        [powerGenerators, budget, gameStarted],
    )

    const handleDowngradePowerGenerator = useCallback(
        (generatorId: string) => {
            const generator = powerGenerators.find((g) => g.id === generatorId)
            if (!generator || !gameStarted || generator.powerLevel <= 100) return

            // Refund 50% of the last upgrade cost
            const currentLevel = generator.powerLevel
            const upgradesDone = (currentLevel - 105) / 5 // Previous upgrade level
            const baseCapacity = generator.capacity
            const baseCost = baseCapacity * 1000
            const lastUpgradeCost = baseCost * Math.pow(2, upgradesDone)
            const refund = Math.round(lastUpgradeCost * 0.5)

            setPowerGenerators((prev) =>
                prev.map((g) => (g.id === generatorId ? { ...g, powerLevel: Math.max(g.powerLevel - 5, 100) } : g)),
            )
            setBudget((prev) => prev + refund)
        },
        [powerGenerators, gameStarted],
    )

    const resetGame = () => {
        setBudget(1500000000)
        setDatacenters([])
        setSelectedDatacenter(null)
        setSelectedDatacenterType(null)
        setSelectedPowerGenerator(null)
        setPowerGenerators((prev) => prev.map((g) => ({ ...g, powerLevel: 100 })))
        setGameStarted(false)
    }

    const handleSelectDatacenterType = (type: string) => {
        if (!gameStarted) return

        const costs = {
            tier1: 10000000,
            tier2: 100000000,
            tier3: 500000000,
            tier4: 1000000000,
        }

        const cost = costs[type as keyof typeof costs]
        if (budget < cost) return

        setSelectedDatacenterType(selectedDatacenterType === type ? null : type)
    }



    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-4 h-full">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-foreground mb-2">VIC Datacenter Simulation</h1>
                    <p className="text-muted-foreground text-lg">
                        Build and manage datacenters across Victoria. Consider latency, power, and costs.
                    </p>
                </div>

                {/* Main Map Area */}
                <div className="grid grid-cols-1 gap-6 h-full">
                    <div className="h-full">
                        <Card className="min-h-[800px] h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Victorian Simulation</span>
                                    <div className="flex items-center gap-2">
                                        {selectedDatacenterType && (
                                            <Badge variant="default" className="bg-primary">
                                                {selectedDatacenterType.charAt(0).toUpperCase() + selectedDatacenterType.slice(1)} Selected
                                            </Badge>
                                        )}
                                        <Badge variant="outline">
                                            {datacenters.length} Datacenter{datacenters.length !== 1 ? "s" : ""}
                                        </Badge>
                                        <Badge variant="outline">
                                            {averageLatency}ms Avg Latency
                                        </Badge>
                                    </div>
                                </CardTitle>
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Available Budget:</span>
                                            <span className="ml-2 font-semibold text-green-600">${(budget / 1000000).toFixed(1)}M</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Spent:</span>
                                            <span className="ml-2 font-semibold text-red-600">
                                                ${((50000000 - budget) / 1000000).toFixed(1)}M
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Total Budget: $1.5B</div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                <MapComponent
                                    ref={mapRef}
                                    datacenters={datacenters}
                                    populationCenters={populationCenters}
                                    powerGenerators={powerGenerators}
                                    onPlaceDatacenter={handlePlaceDatacenter}
                                    onUpdateDatacenter={handleUpdateDatacenter}
                                    selectedDatacenter={selectedDatacenter}
                                    onSelectDatacenter={setSelectedDatacenter}
                                    selectedDatacenterType={selectedDatacenterType}
                                    selectedPowerGenerator={selectedPowerGenerator}
                                    onSelectPowerGenerator={setSelectedPowerGenerator}
                                    onUpgradePowerGenerator={handleUpgradePowerGenerator}
                                    onDowngradePowerGenerator={handleDowngradePowerGenerator}
                                    calculateUpgradeCost={calculateUpgradeCost}
                                    gameStarted={gameStarted}
                                    onStartGame={() => setGameStarted(true)}
                                    onResetGame={resetGame}
                                    budget={budget}
                                    onSelectDatacenterType={handleSelectDatacenterType}
                                    onAverageLatencyChange={setAverageLatency}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>


            </div>
        </div>
    )
}
