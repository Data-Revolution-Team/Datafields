"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { CONTENT } from "@/lib/content"
import analyticsData from "@/data/analytics-data.json"
import { InteractiveAustraliaMap } from "./interactive-australia-map"

const COLORS = {
    renewable: "#00843D",
    nonRenewable: "#FFCD00",
    primary: "#00843D",
}

export function AnalyticsSection() {
    return (
        <section id="analytics" className="py-20 bg-gradient-to-br from-muted/20 via-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
                        {CONTENT.analytics.heading}
                    </h2>
                    <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
                        {CONTENT.analytics.description}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8 items-stretch">
                    {/* Power Line Distribution */}
                    <Card className="h-[420px]">
                        <CardHeader>
                            <CardTitle>{CONTENT.analytics.charts.powerLines.title}</CardTitle>
                            <CardDescription>{CONTENT.analytics.charts.powerLines.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-0 flex flex-col">
                            <ChartContainer
                                config={{ count: { label: "Count", color: COLORS.primary } }}
                                className="flex-1 min-h-0"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={analyticsData.powerLineDistribution}
                                        layout="vertical"
                                        margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
                                        barCategoryGap={8}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
                                        <YAxis
                                            dataKey="type"
                                            type="category"
                                            width={150}
                                            interval={0}
                                            tickLine={false}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const row = payload[0].payload
                                                    return (
                                                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                                                            <p className="font-medium">{row.type}</p>
                                                            <p className="text-sm">Count: {row.count.toLocaleString()}</p>
                                                            {"percentage" in row && (
                                                                <p className="text-sm">Percentage: {row.percentage}%</p>
                                                            )}
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                        <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} maxBarSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Renewable vs Non-Renewable Pie */}
                    <Card className="h-[420px]">
                        <CardHeader>
                            <CardTitle>{CONTENT.analytics.charts.renewable.title}</CardTitle>
                            <CardDescription>{CONTENT.analytics.charts.renewable.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-0 flex flex-col">
                            <ChartContainer
                                config={{
                                    renewable: { label: "Renewable", color: COLORS.renewable },
                                    nonRenewable: { label: "Non-Renewable", color: COLORS.nonRenewable },
                                }}
                                className="flex-1 min-h-0"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                                        <Pie
                                            data={analyticsData.renewableBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120} // solid pie
                                            dataKey="value"
                                            label={({ value, cx, cy, midAngle, outerRadius }) => {
                                                const RADIAN = Math.PI / 180
                                                const r = outerRadius * 0.65
                                                const x = cx + r * Math.cos(midAngle ? -midAngle : 1 * RADIAN)
                                                const y = cy + r * Math.sin(midAngle ? -midAngle : 1 * RADIAN)
                                                return (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        fill="white"
                                                        textAnchor={x > cx ? "start" : "end"}
                                                        dominantBaseline="central"
                                                        fontSize="14"
                                                        fontWeight="bold"
                                                    >
                                                        {`${value}%`}
                                                    </text>
                                                )
                                            }}
                                        >
                                            {analyticsData.renewableBreakdown.map((entry, i) => (
                                                <Cell
                                                    key={`cell-${i}`}
                                                    fill={
                                                        entry.name === "Renewable"
                                                            ? COLORS.renewable
                                                            : COLORS.nonRenewable
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const d = payload[0].payload
                                                    return (
                                                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                                                            <p className="font-medium">{d.name}</p>
                                                            <p className="text-sm">Percentage: {d.value}%</p>
                                                            <p className="text-sm">Count: {d.count}</p>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    {/* Fuel Types */}
                    <Card className="h-[680px]">
                        <CardHeader>
                            <CardTitle>Major Power Stations - Fuel Types</CardTitle>
                            <CardDescription>
                                Count of power stations categorised by primary fuel source
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-0 flex flex-col mt-24">
                            <ChartContainer
                                config={{ count: { label: "Count", color: COLORS.primary } }}
                                className="flex-1 min-h-0"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={analyticsData.fuelTypes}
                                        layout="vertical"
                                        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                        barCategoryGap={15}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false}>
                                            <text />
                                            <text
                                                x="50%"
                                                y="100%"
                                                dy={30}
                                                textAnchor="middle"
                                                className="fill-slate-600 text-sm"
                                            >
                                                Count
                                            </text>
                                        </XAxis>
                                        <YAxis
                                            dataKey="fuel"
                                            type="category"
                                            width={180}
                                            interval={0}
                                            tickLine={false}
                                            tick={{ fontSize: 12 }}
                                        >
                                            <text
                                                angle={-90}
                                                x={-50}
                                                y="50%"
                                                textAnchor="middle"
                                                className="fill-slate-600 text-sm"
                                            >
                                                Fuel Types
                                            </text>
                                        </YAxis>
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const row = payload[0].payload
                                                    return (
                                                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                                                            <p className="font-medium">{row.fuel}</p>
                                                            <p className="text-sm">Count: {row.count.toLocaleString()}</p>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill={COLORS.primary}
                                            radius={[0, 4, 4, 0]}
                                            maxBarSize={20}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Major Power Stations by Australian States */}
                    <InteractiveAustraliaMap className="h-[680px]" />
                </div>
            </div>
        </section>
    )
}

