"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// tiny classnames helper so we don't depend on cn()
const cx = (...cls: Array<string | undefined | false>) => cls.filter(Boolean).join(" ")

interface StateData {
    name: string
    count: number
    color: string
}

const stateData: StateData[] = [
    { name: "Western Australia", count: 131, color: "#4E79A7" }, // blue
    { name: "New South Wales", count: 116, color: "#F28E2B" }, // orange
    { name: "Queensland", count: 91, color: "#E15759" }, // red
    { name: "Victoria", count: 89, color: "#76B7B2" }, // teal
    { name: "South Australia", count: 49, color: "#59A14F" }, // green
    { name: "Tasmania", count: 39, color: "#EDC948" }, // yellow
    { name: "Northern Territory", count: 29, color: "#B07AA1" }, // purple
    { name: "ACT", count: 4, color: "#FF9DA7" }, // pink
]

export function InteractiveAustraliaMap({ className }: { className?: string }) {
    const [hoveredState, setHoveredState] = useState<string | null>(null)

    const getStateData = (stateName: string) => stateData.find((s) => s.name === stateName)
    const getFillColor = (stateName: string) => getStateData(stateName)?.color ?? "#e2e8f0"
    const getStroke = (stateName: string) => (hoveredState === stateName ? "#334155" : "#e2e8f0")
    const getStrokeWidth = (stateName: string) => (hoveredState === stateName ? 3 : 2)

    return (
        <Card className={cx("h-full", className)}>
            <CardHeader>
                <CardTitle>Major Power Stations by Australian States</CardTitle>
                <CardDescription>Interactive map showing power station distribution across Australia</CardDescription>
            </CardHeader>

            <CardContent className="min-h-0 flex flex-col">
                <div className="relative flex-1 min-h-0">
                    <svg
                        viewBox="0 0 800 600"
                        className="w-full h-full block"
                        preserveAspectRatio="xMidYMid meet"
                        onMouseLeave={() => setHoveredState(null)}
                    >
                        {/* Western Australia */}
                        <path
                            d="M50 150 L250 150 L250 450 L50 450 Z"
                            fill={getFillColor("Western Australia")}
                            stroke={getStroke("Western Australia")}
                            strokeWidth={getStrokeWidth("Western Australia")}
                            className="cursor-pointer transition-[stroke-width] duration-150"
                            onMouseEnter={() => setHoveredState("Western Australia")}
                        />
                        <text x="150" y="300" textAnchor="middle" className="fill-slate-700 font-semibold text-sm pointer-events-none">WA</text>
                        <text x="150" y="320" textAnchor="middle" className="fill-slate-600 text-xs pointer-events-none">131</text>

                        {/* Northern Territory */}
                        <path
                            d="M250 150 L350 150 L350 350 L250 350 Z"
                            fill={getFillColor("Northern Territory")}
                            stroke={getStroke("Northern Territory")}
                            strokeWidth={getStrokeWidth("Northern Territory")}
                            className="cursor-pointer transition-[stroke-width] duration-150"
                            onMouseEnter={() => setHoveredState("Northern Territory")}
                        />
                        <text x="300" y="245" textAnchor="middle" className="fill-slate-700 font-semibold text-sm pointer-events-none">NT</text>
                        <text x="300" y="265" textAnchor="middle" className="fill-slate-600 text-xs pointer-events-none">29</text>

                        {/* South Australia */}
                        <path
                            d="M250 350 L350 350 L350 450 L250 450 Z"
                            fill={getFillColor("South Australia")}
                            stroke={getStroke("South Australia")}
                            strokeWidth={getStrokeWidth("South Australia")}
                            className="cursor-pointer transition-[stroke-width] duration-150"
                            onMouseEnter={() => setHoveredState("South Australia")}
                        />
                        <text x="300" y="395" textAnchor="middle" className="fill-slate-700 font-semibold text-sm pointer-events-none">SA</text>
                        <text x="300" y="415" textAnchor="middle" className="fill-slate-600 text-xs pointer-events-none">49</text>

                        {/* Queensland */}
                        <path
                            d="M350 150 L500 150 L500 350 L350 350 Z"
                            fill={getFillColor("Queensland")}
                            stroke={getStroke("Queensland")}
                            strokeWidth={getStrokeWidth("Queensland")}
                            className="cursor-pointer transition-[stroke-width] duration-150"
                            onMouseEnter={() => setHoveredState("Queensland")}
                        />
                        <text x="425" y="245" textAnchor="middle" className="fill-slate-700 font-semibold text-sm pointer-events-none">QLD</text>
                        <text x="425" y="265" textAnchor="middle" className="fill-slate-600 text-xs pointer-events-none">91</text>

                        {/* New South Wales */}
                        <path
                            d="M350 350 L450 350 L450 450 L350 450 Z"
                            fill={getFillColor("New South Wales")}
                            stroke={getStroke("New South Wales")}
                            strokeWidth={getStrokeWidth("New South Wales")}
                            className="cursor-pointer transition-[stroke-width] duration-150"
                            onMouseEnter={() => setHoveredState("New South Wales")}
                        />
                        <text x="400" y="395" textAnchor="middle" className="fill-slate-700 font-semibold text-sm pointer-events-none">NSW</text>
                        <text x="400" y="415" textAnchor="middle" className="fill-slate-600 text-xs pointer-events-none">116</text>

                        {/* ACT */}
                        <path
                            d="M450 350 L500 350 L500 500 L450 500 Z"
                            fill={getFillColor("ACT")}
                            stroke={getStroke("ACT")}
                            strokeWidth={getStrokeWidth("ACT")}
                            className="cursor-pointer transition-[stroke-width] duration-150"
                            onMouseEnter={() => setHoveredState("ACT")}
                        />
                        <text x="475" y="420" textAnchor="middle" className="fill-slate-700 font-semibold text-xs pointer-events-none">ACT</text>
                        <text x="475" y="435" textAnchor="middle" className="fill-slate-600 text-xs pointer-events-none">4</text>

                        {/* Victoria */}
                        <path
                            d="M350 450 L500 450 L500 500 L350 500 Z"
                            fill={getFillColor("Victoria")}
                            stroke={getStroke("Victoria")}
                            strokeWidth={getStrokeWidth("Victoria")}
                            className="cursor-pointer transition-[stroke-width] duration-150"
                            onMouseEnter={() => setHoveredState("Victoria")}
                        />
                        <text x="425" y="470" textAnchor="middle" className="fill-slate-700 font-semibold text-sm pointer-events-none">VIC</text>
                        <text x="425" y="490" textAnchor="middle" className="fill-slate-600 text-xs pointer-events-none">89</text>

                        {/* Tasmania */}
                        <ellipse
                            cx="450"
                            cy="530"
                            rx="40"
                            ry="25"
                            fill={getFillColor("Tasmania")}
                            stroke={getStroke("Tasmania")}
                            strokeWidth={getStrokeWidth("Tasmania")}
                            className="cursor-pointer transition-[stroke-width] duration-150"
                            onMouseEnter={() => setHoveredState("Tasmania")}
                        />
                        <text x="450" y="535" textAnchor="middle" className="fill-slate-700 font-semibold text-sm pointer-events-none">TAS</text>
                        <text x="450" y="550" textAnchor="middle" className="fill-slate-600 text-xs pointer-events-none">39</text>
                    </svg>

                    {/* Hover tooltip */}
                    {hoveredState && (
                        <div className="absolute top-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
                            <div className="font-semibold">{hoveredState}</div>
                            <div className="text-sm text-muted-foreground">
                                {getStateData(hoveredState)?.count} Power Stations
                            </div>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm shrink-0">
                    {stateData.map((state) => (
                        <div key={state.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: state.color }} />
                            <span className="text-xs">{state.name}: {state.count}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

