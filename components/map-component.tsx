"use client"

import type React from "react"
import { forwardRef, useCallback, useEffect, useState } from "react"
import type { Datacenter, PopulationCenter, PowerGenerator } from "@/app/page"
import Image from "next/image"
import { Server, Building2, School, Home } from "lucide-react"
import { FloatingDatacenterSelector } from "./floating-datacenter-selector"

interface MapComponentProps {
    datacenters: Datacenter[]
    populationCenters: PopulationCenter[]
    powerGenerators: PowerGenerator[]
    onPlaceDatacenter: (x: number, y: number, datacenterType?: string) => void
    onUpdateDatacenter: (id: string, x: number, y: number) => void
    selectedDatacenter: string | null
    onSelectDatacenter: (id: string | null) => void
    selectedDatacenterType: string | null
    selectedPowerGenerator: string | null
    onSelectPowerGenerator: (id: string | null) => void
    onUpgradePowerGenerator: (id: string) => void
    onDowngradePowerGenerator: (id: string) => void
    calculateUpgradeCost: (generator: PowerGenerator) => number
    gameStarted: boolean
    onStartGame: () => void
    onResetGame: () => void
    budget: number
    onSelectDatacenterType: (type: string) => void
    onAverageLatencyChange: (averageLatency: number) => void
}

// Victoria geographic bounds (must match the bounds used in app/page.tsx for latency calculations)
const vicBounds = {
    north: -30.98,
    south: -39.13,
    west: 140.96,
    east: 151,
}

const convertToMapCoords = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng - vicBounds.west) / (vicBounds.east - vicBounds.west)) * width
    const y = ((vicBounds.north - lat) / (vicBounds.north - vicBounds.south)) * height
    return { x, y }
}

const convertFromMapCoords = (x: number, y: number, width: number, height: number) => {
    const lng = vicBounds.west + (x / width) * (vicBounds.east - vicBounds.west)
    const lat = vicBounds.north - (y / height) * (vicBounds.north - vicBounds.south)
    return { lat, lng }
}

const realPopulationCenters = [
    { id: "melbourne", name: "Melbourne", lat: -37.8136, lng: 144.9631, population: 5078000 },
    { id: "portland", name: "Portland", lat: -38.3444, lng: 141.6047, population: 10600 },
    { id: "ballarat", name: "Ballarat", lat: -37.5622, lng: 143.8503, population: 113000 },
    { id: "horsham", name: "Horsham", lat: -36.7110, lng: 142.1996, population: 17000 },
    { id: "bendigo", name: "Bendigo", lat: -36.7570, lng: 144.2794, population: 124000 },
    { id: "shepparton", name: "Shepparton", lat: -36.3773, lng: 145.3996, population: 68000 },
    { id: "swan_hill", name: "Swan Hill", lat: -35.3377, lng: 143.5544, population: 11000 },
    { id: "geelong", name: "Geelong", lat: -38.1499, lng: 144.3617, population: 289000 },
    { id: "mildura", name: "Mildura", lat: -34.2082, lng: 142.1245, population: 56500 },
    { id: "sale", name: "Sale", lat: -38.1097, lng: 147.0686, population: 15000 },
    { id: "orbost", name: "Orbost", lat: -37.7000, lng: 148.4500, population: 2000 }
]

const realPowerGenerators = [
    {
        id: "loy_yang",
        name: "Loy Yang Power Station",
        lat: -38.2333,
        lng: 146.5833,
        capacity: 2200,
        type: "coal" as const,
        powerLevel: 100,
    },
    {
        id: "hazelwood",
        name: "Hazelwood Power Station",
        lat: -38.2667,
        lng: 146.3833,
        capacity: 1600,
        type: "coal" as const,
        powerLevel: 100,
    },
    {
        id: "yallourn",
        name: "Yallourn Power Station",
        lat: -38.1667,
        lng: 146.3500,
        capacity: 1480,
        type: "coal" as const,
        powerLevel: 100,
    },
    {
        id: "kiewa",
        name: "Kiewa Hydroelectric Scheme",
        lat: -36.7167,
        lng: 147.0833,
        capacity: 400,
        type: "hydro" as const,
        powerLevel: 100,
    },
    {
        id: "eildon",
        name: "Eildon Hydroelectric Station",
        lat: -37.2333,
        lng: 145.9167,
        capacity: 120,
        type: "hydro" as const,
        powerLevel: 100,
    }
]

// Population center categorization and sizing
const getPopulationCenterInfo = (population: number) => {
    if (population >= 1000000) {
        return {
            category: "Capital City",
            icon: Building2,
            size: 60, // 5x current size (4 * 5 = 20) * 3 = 60
            color: "bg-purple-600"
        }
    } else if (population >= 500000) {
        return {
            category: "Regional City",
            icon: School,
            size: 48, // 4x current size (4 * 4 = 16) * 3 = 48
            color: "bg-blue-600"
        }
    } else if (population >= 10000) {
        return {
            category: "Regional Town",
            icon: School,
            size: 36, // 3x current size (4 * 3 = 12) * 3 = 36
            color: "bg-blue-500"
        }
    } else if (population >= 5000) {
        return {
            category: "Large Town",
            icon: Home,
            size: 24, // 2x current size (4 * 2 = 8) * 3 = 24
            color: "bg-blue-400"
        }
    } else {
        return {
            category: "Small Town",
            icon: Home,
            size: 24,
            color: "bg-blue-300"
        }
    }
}

// Find closest power generator and calculate power coverage
const getClosestPowerGenerator = (datacenterX: number, datacenterY: number, datacenterPowerConsumption: number, powerGenerators: any[]) => {
    let closestGenerator: any = null
    let shortestDistance = Infinity
    let powerCoverage = 0

    powerGenerators.forEach((generator) => {
        const distance = Math.sqrt(
            Math.pow(datacenterX - generator.x, 2) + Math.pow(datacenterY - generator.y, 2)
        )

        if (distance < shortestDistance) {
            shortestDistance = distance
            closestGenerator = generator

            // Calculate if 5% of generator's power output covers datacenter needs
            const generatorPowerOutput = (generator.capacity * generator.powerLevel) / 100
            const requiredPower = datacenterPowerConsumption
            powerCoverage = (generatorPowerOutput * 0.05) / requiredPower
        }
    })

    return {
        generator: closestGenerator,
        distance: shortestDistance,
        powerCoverage,
        hasEnoughPower: powerCoverage >= 1
    }
}

export const MapComponent = forwardRef<HTMLDivElement, MapComponentProps>(
    (
        {
            datacenters,
            populationCenters,
            powerGenerators,
            onPlaceDatacenter,
            onUpdateDatacenter,
            selectedDatacenter,
            onSelectDatacenter,
            selectedDatacenterType,
            selectedPowerGenerator,
            onSelectPowerGenerator,
            onUpgradePowerGenerator,
            onDowngradePowerGenerator,
            calculateUpgradeCost,
            gameStarted,
            onStartGame,
            onResetGame,
            budget,
            onSelectDatacenterType,
            onAverageLatencyChange,
        },
        ref,
    ) => {
        const [mapDimensions, setMapDimensions] = useState({ width: 600, height: 600 })
        const [isHovering, setIsHovering] = useState<string | null>(null)
        const [hoverPreview, setHoverPreview] = useState<{ x: number; y: number } | null>(null)
        const [dragState, setDragState] = useState<{
            isDragging: boolean
            datacenterId: string | null
            startX: number
            startY: number
            currentX: number
            currentY: number
        }>({
            isDragging: false,
            datacenterId: null,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
        })

        useEffect(() => {
            const updateDimensions = () => {
                if (ref && typeof ref !== "function" && ref.current) {
                    const rect = ref.current.getBoundingClientRect()
                    setMapDimensions({ width: rect.width, height: rect.height })
                }
            }

            updateDimensions()
            window.addEventListener("resize", updateDimensions)
            return () => window.removeEventListener("resize", updateDimensions)
        }, [ref])

        const handleMapClick = useCallback(
            (e: React.MouseEvent) => {
                if (selectedPowerGenerator) {
                    onSelectPowerGenerator(null)
                }

                if (!gameStarted || !selectedDatacenterType || !ref || typeof ref === "function") return

                const rect = ref.current?.getBoundingClientRect()
                if (!rect) return

                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const clampedX = Math.max(0, Math.min(x, mapDimensions.width))
                const clampedY = Math.max(0, Math.min(y, mapDimensions.height))

                onPlaceDatacenter(clampedX, clampedY, selectedDatacenterType)
                setHoverPreview(null)
            },
            [
                gameStarted,
                selectedDatacenterType,
                onPlaceDatacenter,
                ref,
                mapDimensions,
                selectedPowerGenerator,
                onSelectPowerGenerator,
            ],
        )

        const handleMapHover = useCallback(
            (e: React.MouseEvent) => {
                if (!gameStarted || !selectedDatacenterType || !ref || typeof ref === "function") return

                const rect = ref.current?.getBoundingClientRect()
                if (!rect) return

                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const clampedX = Math.max(0, Math.min(x, mapDimensions.width))
                const clampedY = Math.max(0, Math.min(y, mapDimensions.height))

                setHoverPreview({ x: clampedX, y: clampedY })
            },
            [gameStarted, selectedDatacenterType, ref, mapDimensions],
        )

        const handleMapLeave = useCallback(() => {
            setHoverPreview(null)
        }, [])

        const calculateRealDistance = (x1: number, y1: number, x2: number, y2: number) => {
            // Convert pixel coordinates back to lat/lng coordinates
            const coord1 = convertFromMapCoords(x1, y1, mapDimensions.width, mapDimensions.height)
            const coord2 = convertFromMapCoords(x2, y2, mapDimensions.width, mapDimensions.height)

            const R = 6371 // Earth's radius in km
            const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180
            const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((coord1.lat * Math.PI) / 180) * Math.cos((coord2.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            return R * c
        }



        const mappedPopulationCenters = realPopulationCenters.map((center) => ({
            ...center,
            ...convertToMapCoords(center.lat, center.lng, mapDimensions.width, mapDimensions.height),
        }))

        const mappedPowerGenerators = realPowerGenerators.map((realGenerator) => {
            const gameGenerator = powerGenerators.find((g) => g.id === realGenerator.id)
            return {
                ...realGenerator,
                // Use power level from game state, fallback to 100 if not found
                powerLevel: gameGenerator?.powerLevel || 100,
                ...convertToMapCoords(realGenerator.lat, realGenerator.lng, mapDimensions.width, mapDimensions.height),
            }
        })

        const handleDatacenterMouseDown = useCallback(
            (e: React.MouseEvent, datacenterId: string) => {
                if (!gameStarted || selectedDatacenter !== datacenterId) return

                e.stopPropagation()
                const rect = ref && typeof ref !== "function" && ref.current?.getBoundingClientRect()
                if (!rect) return

                const startX = e.clientX - rect.left
                const startY = e.clientY - rect.top

                setDragState({
                    isDragging: true,
                    datacenterId,
                    startX,
                    startY,
                    currentX: startX,
                    currentY: startY,
                })
            },
            [gameStarted, selectedDatacenter, ref],
        )

        const handleMouseMove = useCallback(
            (e: MouseEvent) => {
                if (!dragState.isDragging || !ref || typeof ref === "function") return

                const rect = ref.current?.getBoundingClientRect()
                if (!rect) return

                const currentX = e.clientX - rect.left
                const currentY = e.clientY - rect.top

                const clampedX = Math.max(0, Math.min(currentX, mapDimensions.width))
                const clampedY = Math.max(0, Math.min(currentY, mapDimensions.height))

                setDragState((prev) => ({
                    ...prev,
                    currentX: clampedX,
                    currentY: clampedY,
                }))
            },
            [dragState.isDragging, ref, mapDimensions],
        )

        const handleMouseUp = useCallback(() => {
            if (!dragState.isDragging || !dragState.datacenterId) return

            onUpdateDatacenter(dragState.datacenterId, dragState.currentX, dragState.currentY)

            setDragState({
                isDragging: false,
                datacenterId: null,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
            })
        }, [dragState, onUpdateDatacenter])

        useEffect(() => {
            if (dragState.isDragging) {
                document.addEventListener("mousemove", handleMouseMove)
                document.addEventListener("mouseup", handleMouseUp)
                return () => {
                    document.removeEventListener("mousemove", handleMouseMove)
                    document.removeEventListener("mouseup", handleMouseUp)
                }
            }
        }, [dragState.isDragging, handleMouseMove, handleMouseUp])

        // Calculate overall average latency when no datacenter is selected but datacenters exist
        useEffect(() => {
            if (!selectedDatacenter && datacenters.length > 0) {
                // Calculate overall average of all datacenters
                const allDatacenterAverages: number[] = []

                datacenters.forEach(datacenter => {
                    const datacenterLatencyValues: number[] = []

                    mappedPopulationCenters.forEach(populationCenter => {
                        const distance = calculateRealDistance(datacenter.x, datacenter.y, populationCenter.x, populationCenter.y)
                        const latency = Math.round(distance * 0.05)
                        datacenterLatencyValues.push(latency)
                    })

                    if (datacenterLatencyValues.length > 0) {
                        const datacenterAvg = Math.round(datacenterLatencyValues.reduce((sum, val) => sum + val, 0) / datacenterLatencyValues.length)
                        allDatacenterAverages.push(datacenterAvg)
                    }
                })

                const overallAverage = allDatacenterAverages.length > 0 ? Math.round(allDatacenterAverages.reduce((sum, val) => sum + val, 0) / allDatacenterAverages.length) : 0
            } else if (!selectedDatacenter && datacenters.length === 0) {
                onAverageLatencyChange(0)
            }
        }, [selectedDatacenter, datacenters, onAverageLatencyChange])



        const getPopupPosition = (markerX: number, markerY: number, popupWidth: number, popupHeight: number) => {
            const margin = 8 // Margin from map edges
            const offsetX = 20 // Default horizontal offset from marker
            const offsetY = popupHeight / 2 // Default vertical offset from marker

            // Calculate if popup would extend beyond edges
            const wouldExtendRight = markerX + offsetX + popupWidth > mapDimensions.width - margin
            const wouldExtendLeft = markerX + offsetX - popupWidth < margin
            const wouldExtendBottom = true
            const wouldExtendTop = markerY + offsetY - popupHeight < margin

            let left = offsetX
            let top = offsetY

            // Horizontal positioning - flip to opposite side if needed
            if (wouldExtendRight) {
                // Flip to left side of marker
                left = -popupWidth - offsetX
            } else if (wouldExtendLeft) {
                // Flip to right side of marker
                left = offsetX
            }

            // Vertical positioning - flip to opposite side if needed
            if (wouldExtendBottom) {
                // Flip above the marker
                top = -(popupHeight + offsetY)
            } else if (wouldExtendTop) {
                // Flip below the marker
                top = offsetY
            }

            return { left, top }
        }

        return (
            <div
                ref={ref}
                className={`relative w-full h-full overflow-hidden rounded-lg ${selectedDatacenterType ? "cursor-crosshair" : "cursor-default"
                    }`}
                onClick={handleMapClick}
                onMouseMove={handleMapHover}
                onMouseLeave={handleMapLeave}
            >
                {gameStarted && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onResetGame()
                        }}
                        className="absolute top-2 left-2 z-30 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-colors"
                        title="Reset Game"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                )}

                <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}>
                    <defs>
                        <pattern id="water" patternUnits="userSpaceOnUse" width="4" height="4">
                            <rect width="4" height="4" fill="#bfdbfe" />
                            <path d="M 0,4 l 4,-4 M -1,1 l 2,-2 M 3,5 l 2,-2" stroke="#93c5fd" strokeWidth="0.5" />
                        </pattern>
                        <style>
                            {`
                @keyframes powerWarning {
                  0%, 100% { 
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                    border-color: rgb(239, 68, 68);
                  }
                  50% { 
                    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3);
                    border-color: rgb(220, 38, 38);
                  }
                }
                .power-warning {
                  animation: powerWarning 1.5s ease-in-out infinite;
                }
              `}
                        </style>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#water)" opacity="0.1" />

                    <foreignObject x="0" y="0" width="100%" height="100%">
                        <div className="w-full h-full relative overflow-hidden">
                            <Image
                                src={"/images/vic.png"}
                                alt="Victoria state outline"
                                fill
                                className="object-cover opacity-80"
                                priority
                            />
                        </div>
                    </foreignObject>

                    <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="80%" fill="url(#grid)" />
                </svg>

                {/* Power Connection Lines - rendered below all interactive elements */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {datacenters.map((datacenter) => {
                        const isBeingDragged = dragState.isDragging && dragState.datacenterId === datacenter.id
                        const displayX = isBeingDragged ? dragState.currentX : datacenter.x
                        const displayY = isBeingDragged ? dragState.currentY : datacenter.y

                        const powerInfo = getClosestPowerGenerator(displayX, displayY, datacenter.powerConsumption, mappedPowerGenerators)

                        if (!powerInfo.generator) return null

                        return (
                            <g key={`power-${datacenter.id}`}>
                                <line
                                    x1={displayX}
                                    y1={displayY}
                                    x2={powerInfo.generator.x}
                                    y2={powerInfo.generator.y}
                                    stroke={powerInfo.hasEnoughPower ? "rgba(234, 179, 8, 0.8)" : "rgba(239, 68, 68, 0.8)"}
                                    strokeWidth="2"
                                    strokeDasharray="4,4"
                                    style={{
                                        animation: powerInfo.hasEnoughPower
                                            ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                            : 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                    }}
                                />
                            </g>
                        )
                    })}
                </svg>

                {mappedPopulationCenters.map((center) => {
                    const tooltipPosition = getPopupPosition(center.x, center.y, 180, 80)
                    const centerInfo = getPopulationCenterInfo(center.population)
                    const IconComponent = centerInfo.icon

                    return (
                        <div key={center.id} className="absolute group z-10" style={{ left: center.x, top: center.y }}>
                            <div
                                className={`${centerInfo.color} rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform flex items-center justify-center`}
                                style={{ width: `${centerInfo.size}px`, height: `${centerInfo.size}px` }}
                                onMouseEnter={() => setIsHovering(center.id)}
                                onMouseLeave={() => setIsHovering(null)}
                            >
                                <IconComponent className="text-white" style={{ width: `${Math.max(centerInfo.size - 12, 36)}px`, height: `${Math.max(centerInfo.size - 12, 36)}px` }} />
                            </div>
                            {isHovering === center.id && (
                                <div
                                    className="absolute bg-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium z-50 border max-w-48"
                                    style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
                                >
                                    <div className="font-semibold text-blue-600">{center.name}</div>
                                    <div className="text-muted-foreground">{centerInfo.category}</div>
                                    <div className="text-muted-foreground">
                                        {center.population >= 1000000
                                            ? `${(center.population / 1000000).toFixed(1)}M people`
                                            : `${(center.population / 1000).toFixed(0)}K people`
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}

                {selectedDatacenter && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                        {(() => {
                            const dc = datacenters.find((d) => d.id === selectedDatacenter)
                            if (!dc) return null

                            const isBeingDragged = dragState.isDragging && dragState.datacenterId === selectedDatacenter
                            const dcX = isBeingDragged ? dragState.currentX : dc.x
                            const dcY = isBeingDragged ? dragState.currentY : dc.y

                            // Collect all latency values for this datacenter to calculate average
                            const latencyValues: number[] = []

                            const connectionLines = mappedPopulationCenters.map((center) => {
                                const distance = calculateRealDistance(dcX, dcY, center.x, center.y)
                                const latency = Math.round(distance * 0.05)

                                // Store the latency value for averaging
                                latencyValues.push(latency)

                                return (
                                    <g key={center.id}>
                                        <line
                                            x1={dcX}
                                            y1={dcY}
                                            x2={center.x}
                                            y2={center.y}
                                            stroke="rgba(234, 88, 12, 0.8)"
                                            strokeWidth="3"
                                            strokeDasharray="8,4"
                                            className="animate-pulse"
                                        />
                                        <circle
                                            cx={(dcX + center.x) / 2}
                                            cy={(dcY + center.y) / 2}
                                            r="15"
                                            fill="white"
                                            stroke="rgb(234, 88, 12)"
                                            strokeWidth="2"
                                        />
                                        <text
                                            x={(dcX + center.x) / 2}
                                            y={(dcY + center.y) / 2 + 4}
                                            fill="rgb(234, 88, 12)"
                                            fontSize="11"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                        >
                                            {latency}ms
                                        </text>
                                    </g>
                                )
                            })

                            // Calculate and update the average latency using the exact values from visual lines
                            if (latencyValues.length > 0) {
                                const totalLatency = latencyValues.reduce((sum, val) => sum + val, 0)
                                const averageLatency = Math.round(totalLatency / latencyValues.length)

                                // Calculate overall average of all datacenters
                                const allDatacenterAverages: number[] = []

                                datacenters.forEach(datacenter => {
                                    const datacenterLatencyValues: number[] = []

                                    mappedPopulationCenters.forEach(populationCenter => {
                                        const distance = calculateRealDistance(datacenter.x, datacenter.y, populationCenter.x, populationCenter.y)
                                        const latency = Math.round(distance * 0.05)
                                        datacenterLatencyValues.push(latency)
                                    })

                                    if (datacenterLatencyValues.length > 0) {
                                        const datacenterAvg = Math.round(datacenterLatencyValues.reduce((sum, val) => sum + val, 0) / datacenterLatencyValues.length)
                                        allDatacenterAverages.push(datacenterAvg)
                                    }
                                })

                                const overallAverage = allDatacenterAverages.length > 0 ? Math.round(allDatacenterAverages.reduce((sum, val) => sum + val, 0) / allDatacenterAverages.length) : 0
                                onAverageLatencyChange(overallAverage)
                            }

                            return connectionLines
                        })()}
                    </svg>
                )}



                {datacenters.map((datacenter) => {
                    const isBeingDragged = dragState.isDragging && dragState.datacenterId === datacenter.id
                    const displayX = isBeingDragged ? dragState.currentX : datacenter.x
                    const displayY = isBeingDragged ? dragState.currentY : datacenter.y

                    // Get power info for this datacenter
                    const powerInfo = getClosestPowerGenerator(displayX, displayY, datacenter.powerConsumption, mappedPowerGenerators)
                    const hasPowerIssue = powerInfo.generator && !powerInfo.hasEnoughPower

                    const getDatacenterColor = (datacenter: Datacenter) => {
                        if (datacenter.cost <= 10000000) return "bg-green-500" // Tier 1 datacenter
                        if (datacenter.cost <= 100000000) return "bg-yellow-500" // Tier 2 datacenter
                        if (datacenter.cost <= 500000000) return "bg-orange-500" // Tier 3 datacenter
                        return "bg-red-500" // Tier 4 datacenter
                    }

                    return (
                        <div key={datacenter.id} className="group z-10" style={{ position: "absolute", left: displayX, top: displayY }}>
                            <div
                                className={`w-7 h-7 ${getDatacenterColor(datacenter)} rounded-lg border-2 shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-105 flex items-center justify-center ${hasPowerIssue ? "border-red-500 ring-2 ring-red-500 power-warning" : "border-white"
                                    } ${selectedDatacenter === datacenter.id ? "ring-4 ring-primary/50 scale-110" : ""
                                    } ${selectedDatacenter === datacenter.id && gameStarted ? "cursor-move" : ""} ${isBeingDragged ? "scale-125 shadow-2xl z-50" : ""
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onSelectDatacenter(datacenter.id === selectedDatacenter ? null : datacenter.id)
                                }}
                                onMouseDown={(e) => handleDatacenterMouseDown(e, datacenter.id)}
                            >
                                <Server className="w-4 h-4 text-white" />
                            </div>
                            {(() => {
                                // Calculate tooltip position using the improved positioning function
                                const tooltipPosition = getPopupPosition(displayX, displayY, 200, 120) // Approximate tooltip size

                                return (
                                    <div
                                        className={`bg-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity z-50 border max-w-48 ${isBeingDragged ? "opacity-100" : ""
                                            }`}
                                        style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
                                    >
                                        <div
                                            className={`font-semibold ${datacenter.cost <= 10000000
                                                ? "text-green-600"
                                                : datacenter.cost <= 100000000
                                                    ? "text-yellow-600"
                                                    : datacenter.cost <= 500000000
                                                        ? "text-orange-600"
                                                        : "text-red-600"
                                                }`}
                                        >
                                            {datacenter.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {datacenter.capacity.toLocaleString()} servers • {datacenter.powerConsumption}MW
                                        </div>

                                        {/* Individual Datacenter Average Latency */}
                                        {(() => {
                                            // Use the exact same calculation as the visual connection lines
                                            const latencyValues: number[] = []

                                            mappedPopulationCenters.forEach(populationCenter => {
                                                const distance = calculateRealDistance(displayX, displayY, populationCenter.x, populationCenter.y)
                                                const latency = Math.round(distance * 0.05)
                                                latencyValues.push(latency)
                                            })

                                            const avgLatency = latencyValues.length > 0 ? Math.round(latencyValues.reduce((sum, val) => sum + val, 0) / latencyValues.length) : 0

                                            return (
                                                <div className="text-xs mt-1">
                                                    <div className="text-muted-foreground">
                                                        Avg Latency: <span className="font-semibold text-blue-600">{avgLatency}ms</span>
                                                    </div>
                                                </div>
                                            )
                                        })()}

                                        {powerInfo.generator && (
                                            <div className="text-xs mt-1">
                                                <div className="text-muted-foreground">
                                                    Powered by: {powerInfo.generator.name}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    Available: {Math.round((powerInfo.generator.capacity * powerInfo.generator.powerLevel * 0.05) / 100)}MW
                                                </div>
                                                {hasPowerIssue && (
                                                    <div className="text-red-600 font-semibold mt-1">
                                                        ⚠️ Insufficient power! Need {datacenter.powerConsumption}MW, only {Math.round((powerInfo.generator.capacity * powerInfo.generator.powerLevel * 0.05) / 100)}MW available
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {selectedDatacenter === datacenter.id && gameStarted && !isBeingDragged && (
                                            <div className="text-xs text-primary mt-1">Click and drag to move</div>
                                        )}
                                    </div>
                                )
                            })()}
                        </div>
                    )
                })}

                {mappedPowerGenerators.map((generator) => {
                    const isSelected = selectedPowerGenerator === generator.id
                    const upgradeCost = calculateUpgradeCost(generator)
                    const canUpgrade = generator.powerLevel < 125
                    const canDowngrade = generator.powerLevel > 100

                    const validX = typeof generator.x === "number" && !isNaN(generator.x) ? generator.x : 0
                    const validY = typeof generator.y === "number" && !isNaN(generator.y) ? generator.y : 0

                    const tooltipPosition = getPopupPosition(validX, validY, 200, 60)
                    const upgradePosition = getPopupPosition(validX, validY, 192, 140)

                    return (
                        <div key={generator.id} className="absolute group z-10" style={{ left: validX, top: validY }}>
                            <div
                                className={`w-5 h-5 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform ${generator.type === "coal"
                                    ? "bg-gray-600"
                                    : generator.type === "gas"
                                        ? "bg-orange-500"
                                        : generator.type === "hydro"
                                            ? "bg-blue-600"
                                            : generator.type === "solar"
                                                ? "bg-yellow-500"
                                                : "bg-green-500"
                                    } ${isSelected ? "ring-4 ring-primary/50 scale-125" : ""} ${generator.powerLevel > 100 ? "ring-2 ring-yellow-400" : ""
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (gameStarted) {
                                        onSelectPowerGenerator(generator.id === selectedPowerGenerator ? null : generator.id)
                                    }
                                }}
                                onMouseEnter={() => setIsHovering(generator.id)}
                                onMouseLeave={() => setIsHovering(null)}
                            />

                            {generator.powerLevel > 100 && (
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full border border-white text-xs font-bold text-white flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-20">
                                    {(generator.powerLevel - 100) / 5}
                                </div>
                            )}

                            {isHovering === generator.id && (
                                <div
                                    className="absolute bg-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium z-50 border max-w-48"
                                    style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
                                >
                                    <div className="font-semibold">{generator.name}</div>
                                    <div className="text-muted-foreground">
                                        {Math.round((generator.capacity * generator.powerLevel) / 100)}MW • {generator.type} •{" "}
                                        {generator.powerLevel}%
                                    </div>
                                </div>
                            )}

                            {isSelected && gameStarted && (
                                <div
                                    className="absolute bg-white p-3 rounded-lg shadow-xl border z-50 min-w-48"
                                    style={{ left: upgradePosition.left, top: upgradePosition.top }}
                                >
                                    <div className="font-semibold text-sm mb-2">{generator.name}</div>
                                    <div className="text-xs text-muted-foreground mb-3">
                                        Current: {generator.powerLevel}% ({Math.round((generator.capacity * generator.powerLevel) / 100)}MW)
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onDowngradePowerGenerator(generator.id)
                                            }}
                                            disabled={!canDowngrade}
                                            className="w-8 h-8 rounded bg-red-500 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                                        >
                                            -
                                        </button>

                                        <div className="flex-1 text-center">
                                            <div className="text-sm font-medium">{generator.powerLevel}%</div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${((generator.powerLevel - 100) / 25) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onUpgradePowerGenerator(generator.id)
                                            }}
                                            disabled={!canUpgrade}
                                            className="w-8 h-8 rounded bg-green-500 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {canUpgrade && (
                                        <div className="text-xs text-center">
                                            Next upgrade: <span className="font-semibold">${(upgradeCost / 1000000).toFixed(1)}M</span>
                                        </div>
                                    )}

                                    {!canUpgrade && <div className="text-xs text-center text-red-600">Maximum capacity reached</div>}
                                </div>
                            )}
                        </div>
                    )
                })}

                {hoverPreview && selectedDatacenterType && (
                    <div className="absolute pointer-events-none z-10" style={{ left: hoverPreview.x, top: hoverPreview.y }}>
                        {(() => {
                            // Calculate power consumption for the preview datacenter
                            const previewPowerConsumption = selectedDatacenterType === "tier1" ? 5 :
                                selectedDatacenterType === "tier2" ? 35 :
                                    selectedDatacenterType === "tier3" ? 75 : 100
                            const powerInfo = getClosestPowerGenerator(hoverPreview.x, hoverPreview.y, previewPowerConsumption, mappedPowerGenerators)
                            const hasPowerIssue = powerInfo.generator && !powerInfo.hasEnoughPower

                            return (
                                <>
                                    <div
                                        className={`w-7 h-7 rounded-lg border-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2 opacity-70 animate-pulse flex items-center justify-center ${selectedDatacenterType === "tier1"
                                            ? "bg-green-500"
                                            : selectedDatacenterType === "tier2"
                                                ? "bg-yellow-500"
                                                : selectedDatacenterType === "tier3"
                                                    ? "bg-orange-500"
                                                    : "bg-red-500"
                                            } ${hasPowerIssue ? "border-red-500 ring-2 ring-red-500 power-warning" : "border-white"
                                            }`}
                                    >
                                        <Server className="w-4 h-4 text-white" />
                                    </div>
                                    {(() => {
                                        const tooltipHeight = hasPowerIssue ? 120 : 30
                                        const previewTooltipPosition = getPopupPosition(hoverPreview.x, hoverPreview.y, 200, tooltipHeight)
                                        return (
                                            <div
                                                className="absolute bg-white px-2 py-1 rounded shadow-lg text-xs font-medium border max-w-48 z-50"
                                                style={{ left: previewTooltipPosition.left, top: previewTooltipPosition.top }}
                                            >
                                                <div>Click to place {selectedDatacenterType.replace('tier', 'Tier ')} datacenter</div>

                                                {/* Preview Individual Datacenter Average Latency */}
                                                {(() => {
                                                    // Use the exact same calculation as the visual connection lines
                                                    const latencyValues: number[] = []

                                                    mappedPopulationCenters.forEach(populationCenter => {
                                                        const distance = calculateRealDistance(hoverPreview.x, hoverPreview.y, populationCenter.x, populationCenter.y)
                                                        const latency = Math.round(distance * 0.05)
                                                        latencyValues.push(latency)
                                                    })

                                                    const avgLatency = latencyValues.length > 0 ? Math.round(latencyValues.reduce((sum, val) => sum + val, 0) / latencyValues.length) : 0

                                                    return (
                                                        <div className="text-xs mt-1">
                                                            <div className="text-muted-foreground">
                                                                Avg Latency: <span className="font-semibold text-blue-600">{avgLatency}ms</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })()}

                                                {powerInfo.generator && (
                                                    <div className="text-xs mt-1">
                                                        <div className="text-muted-foreground">
                                                            Powered by: {powerInfo.generator.name}
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            Available: {Math.round((powerInfo.generator.capacity * powerInfo.generator.powerLevel * 0.05) / 100)}MW
                                                        </div>
                                                        {hasPowerIssue && (
                                                            <div className="text-red-600 font-semibold mt-1">
                                                                ⚠️ Insufficient power! Need {previewPowerConsumption}MW, only {Math.round((powerInfo.generator.capacity * powerInfo.generator.powerLevel * 0.05) / 100)}MW available
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })()}
                                </>
                            )
                        })()}
                    </div>
                )}

                {!gameStarted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-60">
                        <div className="text-center text-white bg-black/40 p-8 rounded-xl">
                            <h3 className="text-2xl font-bold mb-4">Victorian Datacenter Simulation</h3>
                            <p className="text-lg opacity-80 mb-4">A tool to simulate the placement of datacenters in Victoria</p>
                            <p className="text-sm opacity-60 mb-6">Click Start to begin</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onStartGame()
                                }}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                            >
                                Start
                            </button>
                        </div>
                    </div>
                )}

                {/* Floating Datacenter Selector */}
                <FloatingDatacenterSelector
                    selectedDatacenterType={selectedDatacenterType}
                    budget={budget}
                    onSelectDatacenterType={onSelectDatacenterType}
                    gameStarted={gameStarted}
                />
            </div>
        )
    },
)

MapComponent.displayName = "MapComponent"
