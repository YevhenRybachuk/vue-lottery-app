<script setup lang="ts">
import { ref } from 'vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import type { Participant } from './types/participant'

const participants = ref<Participant[]>([])

const addParticipant = (
    participantData: Omit<Participant, 'id'>
) => {
  const participant: Participant = {
    id: crypto.randomUUID(),
    ...participantData
  }

  participants.value.push(participant)
}

const deleteParticipant = (id: string) => {
  participants.value = participants.value.filter(
      participant => participant.id !== id
  )
}
</script>

<template>
  <main class="container py-5">
    <h1 class="mb-4">
      Vue Lottery App
    </h1>

    <RegistrationForm
        :participants="participants"
        @add-participant="addParticipant"
    />

    <ParticipantsTable
        :participants="participants"
        @delete-participant="deleteParticipant"
    />
  </main>
</template>