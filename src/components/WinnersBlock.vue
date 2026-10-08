<script setup lang="ts">
import { computed, ref } from 'vue'
import Winner from './Winner.vue'
import BaseButton from './BaseButton.vue'
import type { Participant } from '../types/participant'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  'remove-winner': [id: string]
}>()

const winners = ref<Participant[]>([])

const canChooseWinner = computed(() => {
  return (
      props.participants.length > 0 &&
      winners.value.length < 3 &&
      winners.value.length < props.participants.length
  )
})

const chooseNewWinner = () => {
  if (!canChooseWinner.value) {
    return
  }

  const availableParticipants = props.participants.filter(
      participant =>
          !winners.value.some(
              winner => winner.id === participant.id
          )
  )

  if (availableParticipants.length === 0) {
    return
  }

  const randomIndex = Math.floor(
      Math.random() * availableParticipants.length
  )

  const winner = availableParticipants[randomIndex]

  if (winner) {
    winners.value.push(winner)
  }
}

const removeWinner = (id: string) => {
  winners.value = winners.value.filter(
      winner => winner.id !== id
  )

  emit('remove-winner', id)
}

const removeParticipantFromWinners = (id: string) => {
  winners.value = winners.value.filter(
      winner => winner.id !== id
  )
}

defineExpose({
  removeParticipantFromWinners
})
</script>

<template>
  <section class="winners-block mb-5">
    <div
        class="d-flex justify-content-between align-items-center mb-4"
    >
      <h2 class="mb-0">
        Переможці
      </h2>

      <BaseButton
          :disabled="!canChooseWinner"
          @click="chooseNewWinner"
      >
        Новий переможець
      </BaseButton>
    </div>

    <p
        v-if="winners.length === 0"
        class="text-muted"
    >
      Переможців поки немає.
    </p>

    <div
        v-else
        class="row g-3"
    >
      <div
          v-for="winner in winners"
          :key="winner.id"
          class="col-12 col-md-4"
      >
        <Winner
            :winner="winner"
            @remove="removeWinner"
        />
      </div>
    </div>
  </section>
</template>