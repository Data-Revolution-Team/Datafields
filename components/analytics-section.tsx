"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { CONTENT } from "@/lib/content"
import analyticsData from "@/data/analytics-data.json"

export function AnalyticsSection() {
  return (
    <section id="analytics" className="py-20 bg-gradient-to-br from-muted/20 via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">{CONTENT.analytics.heading}</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            {CONTENT.analytics.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{CONTENT.analytics.charts.revenue.title}</CardTitle>
              <CardDescription>{CONTENT.analytics.charts.revenue.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: CONTENT.analytics.charts.revenue.labels.revenue,
                    color: "hsl(var(--chart-1))",
                  },
                  growth: {
                    label: CONTENT.analytics.charts.revenue.labels.growth,
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{CONTENT.analytics.charts.engagement.title}</CardTitle>
              <CardDescription>{CONTENT.analytics.charts.engagement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: CONTENT.analytics.charts.engagement.labels.users,
                    color: "hsl(var(--chart-1))",
                  },
                  sessions: {
                    label: CONTENT.analytics.charts.engagement.labels.sessions,
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.userEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="users" fill="var(--color-chart-1)" />
                    <Bar dataKey="sessions" fill="var(--color-chart-2)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{CONTENT.analytics.charts.performance.title}</CardTitle>
            <CardDescription>{CONTENT.analytics.charts.performance.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cpu: {
                  label: CONTENT.analytics.charts.performance.labels.cpu,
                  color: "hsl(var(--chart-1))",
                },
                memory: {
                  label: CONTENT.analytics.charts.performance.labels.memory,
                  color: "hsl(var(--chart-2))",
                },
                network: {
                  label: CONTENT.analytics.charts.performance.labels.network,
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="cpu"
                    stackId="1"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="memory"
                    stackId="1"
                    stroke="var(--color-chart-2)"
                    fill="var(--color-chart-2)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="network"
                    stackId="1"
                    stroke="var(--color-chart-3)"
                    fill="var(--color-chart-3)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
