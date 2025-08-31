"use client"

import { Badge } from "@/components/ui/badge"
import { Server } from "lucide-react"

interface FloatingDatacenterSelectorProps {
  selectedDatacenterType: string | null
  budget: number
  onSelectDatacenterType: (type: string) => void
  gameStarted: boolean
}

const datacenterTypes = [
  {
    type: "tier1",
    name: "Tier 1 Datacenter",
    cost: 10000000,
    specs: "1,000 servers • 5MW power",
    color: "bg-green-500",
    textColor: "text-green-600"
  },
  {
    type: "tier2",
    name: "Tier 2 Datacenter",
    cost: 100000000,
    specs: "5,000 servers • 35MW power",
    color: "bg-yellow-500",
    textColor: "text-yellow-600"
  },
  {
    type: "tier3",
    name: "Tier 3 Datacenter",
    cost: 500000000,
    specs: "15,000 servers • 75MW power",
    color: "bg-orange-500",
    textColor: "text-orange-600"
  },
  {
    type: "tier4",
    name: "Tier 4 Datacenter",
    cost: 1000000000,
    specs: "30,000 servers • 100MW power",
    color: "bg-red-500",
    textColor: "text-red-600"
  }
]

export function FloatingDatacenterSelector({
  selectedDatacenterType,
  budget,
  onSelectDatacenterType,
  gameStarted
}: FloatingDatacenterSelectorProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!gameStarted) return null

  return (
    <div className="absolute bottom-4 left-4 z-40 space-y-2">
      {datacenterTypes.map((dc) => {
        const disabled = budget < dc.cost
        const selected = selectedDatacenterType === dc.type
        
        return (
          <div key={dc.type} className="group relative">
            {/* Main button - always visible */}
            <button
              onClick={() => !disabled && onSelectDatacenterType(dc.type)}
              disabled={disabled}
              className={`
                w-12 h-12 rounded-lg border-2 border-white shadow-lg transition-all duration-300
                ${dc.color} 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                ${selected ? 'ring-4 ring-primary/50 scale-110' : ''}
                ${disabled ? '' : 'hover:shadow-xl'}
                flex items-center justify-center
              `}
              title={dc.name}
            >
              <Server className="w-6 h-6 text-white" />
            </button>
            
            {/* Hover expansion panel */}
            <div className="
              absolute left-16 top-0 bg-white rounded-lg shadow-xl border p-3 min-w-48 z-50
              opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto
              transform translate-x-2 group-hover:translate-x-0
            ">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-8 h-8 ${dc.color} rounded-lg flex-shrink-0 flex items-center justify-center`}>
                  <Server className="w-5 h-5 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm ${dc.textColor} mb-1`}>
                    {dc.name}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className={`mb-2 ${disabled ? 'bg-red-100 text-red-700' : ''}`}
                  >
                    {formatCurrency(dc.cost)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mb-2">{dc.specs}</p>
                  
                  {disabled && (
                    <p className="text-xs text-destructive font-medium">Insufficient funds</p>
                  )}
                  
                  {selected && !disabled && (
                    <p className="text-xs text-primary font-medium">Selected - Click map to place</p>
                  )}
                  
                  {!disabled && !selected && (
                    <p className="text-xs text-muted-foreground">Click to select</p>
                  )}
                </div>
              </div>
              
              {/* Arrow pointing to button */}
              <div className="absolute left-0 top-4 w-2 h-2 bg-white border-l border-t transform -translate-x-1 -translate-y-1 rotate-45" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
