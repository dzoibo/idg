import { StoresList } from '@/models/enums/app/StoresList'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { Thematic } from '@/models/interfaces/Thematic'
import { ThematicService } from '@/services/thematics/ThematicService'

export const useThematicStore = defineStore(StoresList.THEMATICS, () => {
  const thematics: Ref<Thematic[]> = ref([])

  async function getAll(): Promise<void> {
    if (thematics.value.length === 0) {
      thematics.value = await ThematicService.getAll()
    }
  }

  return { thematics, getAll }
})
