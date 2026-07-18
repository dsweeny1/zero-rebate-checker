export interface HomeownerAnswers {
    homeType: 'single-family' | 'small-multifamily' | 'large-multifamily' | ''
    incomeLevel: 'low' | 'moderate' | 'market-rate' | ''
    utilityProvider: 'xcel' | 'other' | ''
    upgrades: string[]
    state: 'colorado' | ''
  }
  
  export interface Rebate {
    name: string
    amount: number
    description: string
    source: 'federal' | 'state' | 'utility'
    eligible: boolean
  }