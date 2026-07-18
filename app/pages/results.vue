<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold text-green-700">Zero Homes</h1>
        <p class="text-sm text-gray-500">Colorado Rebate Eligibility Checker</p>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-6 py-10">

      <!-- Total savings banner -->
      <div class="bg-green-700 text-white rounded-2xl p-8 mb-8 text-center">
        <p class="text-green-200 text-sm font-medium mb-1">You may qualify for up to</p>
        <p class="text-5xl font-bold">${{ totalSavings.toLocaleString() }}</p>
        <p class="text-green-200 text-sm mt-2">in rebates and tax credits</p>
      </div>

      <!-- No rebates state -->
      <div v-if="rebates.length === 0" class="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <p class="text-gray-500">Based on your answers, we couldn't find matching rebates right now. Rebate programs change frequently — contact Zero Homes for a personalized assessment.</p>
      </div>

      <!-- Rebate cards -->
      <div v-else class="space-y-4">
        <div
          v-for="rebate in rebates"
          :key="rebate.name"
          class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div class="flex justify-between items-start">
            <div>
              <span
                class="text-xs font-semibold px-2 py-1 rounded-full"
                :class="{
                  'bg-blue-100 text-blue-700': rebate.source === 'federal',
                  'bg-green-100 text-green-700': rebate.source === 'state',
                  'bg-yellow-100 text-yellow-700': rebate.source === 'utility'
                }"
              >
                {{ rebate.source.charAt(0).toUpperCase() + rebate.source.slice(1) }}
              </span>
              <h3 class="text-gray-900 font-semibold mt-2">{{ rebate.name }}</h3>
              <p class="text-gray-500 text-sm mt-1">{{ rebate.description }}</p>
            </div>
            <div class="text-right ml-4 flex-shrink-0">
              <p class="text-2xl font-bold text-green-700">${{ rebate.amount.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
        <div class="mt-8 bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Ready to get started?</h3>
        <p class="text-gray-500 text-sm mb-4">Zero Homes handles every rebate upfront and manages installation with vetted local crews.</p>
        <a href="https://www.zerohomes.com/getting-started" target="_blank" class="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700 transition">Get started with Zero Homes →</a>
        </div>

      <button
        @click="router.push('/')"
        class="mt-6 text-sm text-gray-400 hover:text-gray-600 transition block mx-auto"
      >
        ← Start over
      </button>

    </main>
  </div>
</template>

<script setup lang="ts">
import type { HomeownerAnswers } from '~/types'
import { useRebates } from '~/composables/useRebates'

const router = useRouter()

const rebates = ref<ReturnType<typeof useRebates>>([])
const totalSavings = ref(0)

onMounted(() => {
  const stored = sessionStorage.getItem('answers')
  if (!stored) {
    router.push('/')
    return
  }
  const answers: HomeownerAnswers = JSON.parse(stored)
  rebates.value = useRebates(answers)
  totalSavings.value = rebates.value.reduce((sum, r) => sum + r.amount, 0)
})
</script>