<script setup lang="ts">
import { ref, watch } from 'vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import type { Participant } from './types/participant'

const STORAGE_KEY = 'vue-lottery-participants'

const loadParticipants = (): Participant[] => {
  const savedParticipants = localStorage.getItem(STORAGE_KEY)

  if (!savedParticipants) {
    return []
  }

  try {
    return JSON.parse(savedParticipants) as Participant[]
  } catch {
    return []
  }
}

const participants = ref<Participant[]>(
    loadParticipants()
)

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

const updateParticipant = (
    updatedParticipant: Participant
) => {
  const index = participants.value.findIndex(
      participant =>
          participant.id === updatedParticipant.id
  )

  if (index !== -1) {
    participants.value[index] = updatedParticipant
  }
}

watch(
    participants,
    newParticipants => {
      localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(newParticipants)
      )
    },
    {
      deep: true
    }
)
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
        @update-participant="updateParticipant"
    />
  </main>
</template>