<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
    <button 
    @click="goHome" :key="home-button"
    >
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold text-green-700">Zero Homes</h1>
        <p class="text-sm text-gray-500">Colorado Rebate Eligibility Checker</p>
      </div>
      </button>
    </header>

    <main class="max-w-2xl mx-auto px-6 py-10">
      <!-- Progress bar -->
      <div class="mb-8">
        <div class="flex justify-between text-xs text-gray-400 mb-1">
          <span>Step {{ currentStep + 1 }} of {{ steps.length }}</span>
          <span>{{ Math.round(((currentStep + 1) / steps.length) * 100) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-green-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
          />
        </div>
      </div>

      <!-- Question card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ steps[currentStep].question }}</h2>
        <p class="text-gray-500 text-sm mb-6">{{ steps[currentStep].hint }}</p>

        <!-- Single select options -->
        <div v-if="steps[currentStep].type === 'single'" class="space-y-3">
          <button
            v-for="option in steps[currentStep].options"
            :key="option.value"
            @click="selectSingle(steps[currentStep].field, option.value)"
            class="w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 font-medium"
            :class="answers[steps[currentStep].field] === option.value
              ? 'border-green-600 bg-green-50 text-green-800'
              : 'border-gray-200 text-gray-700 hover:border-green-300'"
          >
            {{ option.label }}
          </button>
        </div>

        <!-- Multi select options -->
        <div v-if="steps[currentStep].type === 'multi'" class="space-y-3">
          <button
            v-for="option in steps[currentStep].options"
            :key="option.value"
            @click="toggleMulti(option.value)"
            class="w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 font-medium"
            :class="answers.upgrades.includes(option.value)
              ? 'border-green-600 bg-green-50 text-green-800'
              : 'border-gray-200 text-gray-700 hover:border-green-300'"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-6">
        <button
          v-if="currentStep > 0"
          @click="currentStep--"
          class="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition"
        >
          ← Back
        </button>
        <div v-else />
        <button
          @click="handleNext"
          :disabled="!canProceed"
          class="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 transition"
        >
          {{ currentStep === steps.length - 1 ? 'See my rebates →' : 'Next →' }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { HomeownerAnswers } from '~/types'
import { useRouter } from 'vue-router'

const router = useRouter()

const answers = reactive<HomeownerAnswers>({
  homeType: '',
  incomeLevel: '',
  utilityProvider: '',
  upgrades: [],
  state: 'colorado'
})

const currentStep = ref(0)

const steps = [
  {
    field: 'homeType',
    question: 'What type of home do you have?',
    hint: 'This affects which rebate programs you qualify for.',
    type: 'single',
    options: [
      { label: 'Single-family home', value: 'single-family' },
      { label: 'Small multifamily (2–4 units)', value: 'small-multifamily' },
      { label: 'Large multifamily (5+ units)', value: 'large-multifamily' },
    ]
  },
  {
    field: 'incomeLevel',
    question: 'What is your household income level?',
    hint: 'Low income = below 80% AMI. Moderate = 80–150% AMI. This unlocks larger state rebates.',
    type: 'single',
    options: [
      { label: 'Low income (below 80% AMI)', value: 'low' },
      { label: 'Moderate income (80–150% AMI)', value: 'moderate' },
      { label: 'Market rate (above 150% AMI)', value: 'market-rate' },
    ]
  },
  {
    field: 'utilityProvider',
    question: 'Who is your electric utility provider?',
    hint: 'Xcel Energy customers have access to additional rebates.',
    type: 'single',
    options: [
      { label: 'Xcel Energy', value: 'xcel' },
      { label: 'Other / not sure', value: 'other' },
    ]
  },
  {
    field: 'upgrades',
    question: 'Which upgrades are you considering?',
    hint: 'Select all that apply.',
    type: 'multi',
    options: [
      { label: '🌡️ Heat pump (heating & cooling)', value: 'heat-pump' },
      { label: '🚿 Heat pump water heater', value: 'water-heater' },
      { label: '🏠 Insulation & air sealing', value: 'insulation' },
      { label: '⚡ Electrical panel upgrade', value: 'panel' },
      { label: '🚗 EV charger', value: 'ev-charger' },
    ]
  },
]

const canProceed = computed(() => {
  const step = steps[currentStep.value]
  if (step.type === 'single') return !!answers[step.field as keyof HomeownerAnswers]
  if (step.type === 'multi') return answers.upgrades.length > 0
  return true
})

function selectSingle(field: string, value: string) {
  (answers as any)[field] = value
}

function toggleMulti(value: string) {
  const idx = answers.upgrades.indexOf(value)
  if (idx > -1) answers.upgrades.splice(idx, 1)
  else answers.upgrades.push(value)
}

function handleNext() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    sessionStorage.setItem('answers', JSON.stringify(answers))
    router.push('/results')
  }
}

function goHome() {
  currentStep.value = 0
  router.push('/') 
}
</script>