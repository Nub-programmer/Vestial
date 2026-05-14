import Groq from 'groq-sdk'
import { CompanyOverview, MarketData, NewsArticle } from '@/lib/types'

async function initializeGroq() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured')
  }
  return new Groq({ apiKey })
}

export async function generateCompanyBrief(
  company: CompanyOverview,
  marketData: MarketData,
  news: NewsArticle[]
): Promise<string> {
  try {
    const groq = await initializeGroq()

    const newsContext = news
      .slice(0, 5)
      .map((n) => `- ${n.title}`)
      .join('\n')

    const prompt = `Provide a concise professional brief about ${company.name} (${company.symbol}) based on this information:

Company: ${company.name}
Sector: ${company.sector}
Industry: ${company.industry}
Current Price: $${marketData.price.toFixed(2)} (${marketData.changePercent.toFixed(2)}%)

Recent Headlines:
${newsContext}

Generate a 2-3 sentence professional summary highlighting key aspects. Focus on investment relevance and current market context.`

    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  } catch (error) {
    console.error('Error generating brief:', error)
    return getMockBrief(company)
  }
}

export async function generateEasyExplanation(
  company: CompanyOverview,
  briefContext: string
): Promise<string> {
  try {
    const groq = await initializeGroq()

    const prompt = `Explain ${company.name} in simple terms a 15-year-old could understand. 
Use this context: ${briefContext}

Keep it to 2-3 sentences. Avoid jargon. Focus on what they do and why it matters.`

    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  } catch (error) {
    console.error('Error generating explanation:', error)
    return getMockExplanation(company)
  }
}

export async function generateRisksAndOpportunities(
  company: CompanyOverview,
  marketData: MarketData,
  news: NewsArticle[]
): Promise<{
  risks: Array<{ title: string; description: string; severity: string }>
  opportunities: Array<{ title: string; description: string; potential: string }>
}> {
  try {
    const groq = await initializeGroq()

    const prompt = `For ${company.name} (${company.symbol}), identify key risks and opportunities.

Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "risks": [
    {"title": "string", "description": "string", "severity": "high|medium|low"}
  ],
  "opportunities": [
    {"title": "string", "description": "string", "potential": "high|medium|low"}
  ]
}

Identify 2-3 realistic risks and 2-3 opportunities based on the sector and current context.`

    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '{}'

    // Pull out the JSON block if the model wraps it in extra text.
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return getMockRisksAndOpportunities(company)
  } catch (error) {
    console.error('Error generating risks and opportunities:', error)
    return getMockRisksAndOpportunities(company)
  }
}

function getMockBrief(company: CompanyOverview): string {
  return `${company.name} is a ${company.sector} company operating in the ${company.industry} space. The company continues to navigate market dynamics while maintaining its position as a significant player in its industry.`
}

function getMockExplanation(company: CompanyOverview): string {
  return `${company.name} is a company that operates in the ${company.industry} industry. Think of it as a business that [description]. Their goal is to provide value to customers and create growth.`
}

function getMockRisksAndOpportunities(): {
  risks: Array<{ title: string; description: string; severity: string }>
  opportunities: Array<{ title: string; description: string; potential: string }>
} {
  return {
    risks: [
      {
        title: 'Market Competition',
        description:
          'Increasing competition from new entrants and established players',
        severity: 'high',
      },
      {
        title: 'Economic Sensitivity',
        description:
          'Performance may be affected by broader economic conditions',
        severity: 'medium',
      },
    ],
    opportunities: [
      {
        title: 'Market Expansion',
        description: 'Potential to expand into emerging markets and new segments',
        potential: 'high',
      },
      {
        title: 'Innovation',
        description: 'Opportunities from technological advancement and innovation',
        potential: 'high',
      },
    ],
  }
}
