import type { CompanyOverview } from '@/lib/types'

export const COMPANY_CATALOG: Record<string, CompanyOverview> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description:
      'Apple designs, manufactures, and markets smartphones, computers, wearables, and software.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    website: 'https://www.apple.com',
    ceo: 'Tim Cook',
    founded: 1976,
    employees: 161000,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    description:
      'Microsoft develops and sells software, computing devices, and cloud services.',
    sector: 'Technology',
    industry: 'Software',
    website: 'https://www.microsoft.com',
    ceo: 'Satya Nadella',
    founded: 1975,
    employees: 224116,
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    description:
      'NVIDIA designs GPUs, AI accelerators, and software platforms for gaming, data centers, and edge computing.',
    sector: 'Technology',
    industry: 'Semiconductors',
    website: 'https://www.nvidia.com',
    ceo: 'Jensen Huang',
    founded: 1993,
    employees: 29600,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    description:
      'Tesla designs and manufactures electric vehicles and energy storage solutions.',
    sector: 'Automotive',
    industry: 'Electric Vehicles',
    website: 'https://www.tesla.com',
    ceo: 'Elon Musk',
    founded: 2003,
    employees: 128000,
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    description:
      'Alphabet operates Google search, YouTube, and cloud services across consumer and enterprise products.',
    sector: 'Technology',
    industry: 'Internet Services',
    website: 'https://abc.xyz',
    ceo: 'Sundar Pichai',
    founded: 1998,
    employees: 190234,
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    description:
      'Amazon operates e-commerce marketplaces, logistics networks, and AWS cloud infrastructure.',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    website: 'https://www.amazon.com',
    ceo: 'Andy Jassy',
    founded: 1994,
    employees: 1525000,
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    description:
      'Meta builds social platforms and mixed reality products across communication and content ecosystems.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    website: 'https://about.meta.com',
    ceo: 'Mark Zuckerberg',
    founded: 2004,
    employees: 67317,
  },
}

export const NAME_ALIASES: Record<string, string> = {
  apple: 'AAPL',
  microsoft: 'MSFT',
  tesla: 'TSLA',
  google: 'GOOGL',
  alphabet: 'GOOGL',
  amazon: 'AMZN',
  meta: 'META',
  facebook: 'META',
  nvidia: 'NVDA',
  nvdia: 'NVDA',
}

export function resolveAlias(query: string): string | null {
  const normalized = query.trim().toLowerCase()
  return NAME_ALIASES[normalized] ?? null
}
