"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DatacenterItemProps {
  type: string
  name: string
  cost: number
  specs: string
  disabled: boolean
  selected?: boolean
  onClick?: () => void
}

export function DatacenterItem({ type, name, cost, specs, disabled, selected, onClick }: DatacenterItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card
      className={`cursor-pointer transition-all ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : selected
            ? "ring-2 ring-primary shadow-lg scale-105 bg-primary/5"
            : "hover:shadow-lg hover:scale-105"
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-4 text-center">
        <div
          className={`w-8 h-8 mx-auto mb-2 rounded-lg ${
            type === "small" ? "bg-green-500" : type === "medium" ? "bg-yellow-500" : "bg-red-500"
          }`}
        />
        <h3 className="font-semibold text-sm mb-1">{name}</h3>
        <Badge variant="secondary" className="mb-2">
          {formatCurrency(cost)}
        </Badge>
        <p className="text-xs text-muted-foreground">{specs}</p>
        {disabled && <p className="text-xs text-destructive mt-1">Insufficient funds</p>}
        {selected && !disabled && (
          <p className="text-xs text-primary mt-1 font-medium">Selected - Click map to place</p>
        )}
      </CardContent>
    </Card>
  )
}
