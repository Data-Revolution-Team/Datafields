export const CONTENT = {
  // Brand and general
  brand: {
    name: "Datafields",
    tagline: "Positioning Australia as the Asia-Pacific's leading AI and cloud computing hub.",
  },

  // Navigation
  nav: {
    // Example navigation items (commented out in navbar)
    features: "Features",
    pricing: "Pricing",
    about: "About",
  },

  // Hero section
  hero: {
    heading: "Optimize Data Centre Placement Across Australia",
    highlightWord: "Australia",
    subheading:
      "Analyze infrastructure, energy, and geographic data to select optimal locations and operational strategies for positioning Australia as the Asia-Pacific's AI and cloud computing leader.",
    primaryButton: "Watch Video",
    secondaryButton: "Play Game",
  },

  // Features section
  features: {
    heading: "Advanced Analytics for Strategic Data Centre Placement",
    description: "Everything you need to analyze Australia's infrastructure and select optimal data centre locations",
    items: [
      {
        title: "Infrastructure Analysis",
        description:
          "Comprehensive analysis of Australia's telecommunications, transport, and utility infrastructure to identify optimal connectivity points.",
        icon: "📊",
      },
      {
        title: "Energy Optimization",
        description:
          "Evaluate renewable energy sources, grid stability, and power costs to minimize environmental impact and operational expenses.",
        icon: "📈",
      },
      {
        title: "Geographic Intelligence",
        description:
          "Assess climate conditions, natural disaster risks, and proximity to major population centers for strategic positioning.",
        icon: "👥",
      },
    ],
  },

  // Analytics section
  analytics: {
    heading: "Australia's Power Infrastructure Analysis",
    description:
      "Comprehensive data visualizations of Australia's power infrastructure to inform optimal data centre placement decisions",
    charts: {
      powerLines: {
        title: "Power Line Distribution by Type",
        description: "Breakdown of Australia's 2,993 power lines by infrastructure type",
        labels: {
          overhead: "Overhead",
          underground: "Underground",
          mixed: "Overhead/Underground",
        },
      },
      renewable: {
        title: "Renewable vs Non-Renewable Power Stations",
        description: "Distribution of major power stations by energy source type",
        labels: {
          renewable: "Renewable",
          nonRenewable: "Non-Renewable",
        },
      },
      fuelTypes: {
        title: "Major Power Stations by Fuel Type",
        description: "Count of power stations categorized by primary fuel source",
        labels: {
          fuel: "Fuel Type",
          count: "Station Count",
        },
      },
      states: {
        title: "Power Stations by Australian States",
        description: "Geographic distribution of major power stations across Australia",
        labels: {
          state: "State/Territory",
          count: "Power Stations",
        },
      },
    },
  },

  // CTA section
  cta: {
    heading: "Ready to Position Australia as the AI Hub?",
    description:
      "Join the mission to establish Australia as the Asia-Pacific's leading destination for AI and cloud computing infrastructure.",
    primaryButton: "Watch Video",
    secondaryButton: "Play Game",
  },

  // Footer
  footer: {
    brandName: "Datafields",
    description: "Positioning Australia as the Asia-Pacific's leading AI and cloud computing hub.",
    githubLink: "View on GitHub",
    copyright: "© 2025 Datafields GovHack. All rights reserved.",
  },
} as const
