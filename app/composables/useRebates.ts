import type { HomeownerAnswers, Rebate } from '~/types'

export function useRebates(answers: HomeownerAnswers): Rebate[] {
  const rebates: Rebate[] = []

  const isEligibleForIRA = answers.homeType === 'single-family' || answers.homeType === 'small-multifamily'
  const isLowModerateIncome = answers.incomeLevel === 'low' || answers.incomeLevel === 'moderate'

  if (answers.upgrades.includes('heat-pump') && isEligibleForIRA) {
    rebates.push({
      name: 'Federal IRA Heat Pump Tax Credit',
      amount: 2000,
      description: '30% tax credit on heat pump installation, up to $2,000/year.',
      source: 'federal',
      eligible: true
    })
  }

  if (answers.upgrades.includes('heat-pump') && isLowModerateIncome && answers.state === 'colorado') {
    rebates.push({
      name: 'Colorado HEAR Rebate',
      amount: answers.incomeLevel === 'low' ? 8000 : 4000,
      description: `Home Electrification and Appliance Rebate for ${answers.incomeLevel}-income households.`,
      source: 'state',
      eligible: true
    })
  }

  if (answers.upgrades.includes('insulation') && isLowModerateIncome && answers.state === 'colorado') {
    rebates.push({
      name: 'Colorado HER Rebate',
      amount: answers.incomeLevel === 'low' ? 4000 : 2000,
      description: 'Home Efficiency Rebate for whole-home energy improvements.',
      source: 'state',
      eligible: true
    })
  }

  if (answers.utilityProvider === 'xcel' && answers.upgrades.includes('heat-pump')) {
    rebates.push({
      name: 'Xcel Energy Neighborhood Retrofit Rebate',
      amount: 3000,
      description: 'Xcel Energy rebate for heat pump installation in select Denver and Aurora neighborhoods.',
      source: 'utility',
      eligible: true
    })
  }

  if (answers.upgrades.includes('water-heater') && isEligibleForIRA) {
    rebates.push({
      name: 'Federal IRA Water Heater Credit',
      amount: 1750,
      description: '30% tax credit on heat pump water heater, up to $1,750.',
      source: 'federal',
      eligible: true
    })
  }

  if (answers.upgrades.includes('panel') && isEligibleForIRA) {
    rebates.push({
      name: 'Federal IRA Panel Upgrade Credit',
      amount: 600,
      description: '$600 tax credit for electrical panel upgrades needed for electrification.',
      source: 'federal',
      eligible: true
    })
  }

  return rebates
}