import { writable } from 'svelte/store'

import { MonitorStage } from 'core/constant'

function createMonitor() {
  return {
    isActive: true,
    stage: MonitorStage.CREATE_FIGHTER,
  }
}

export const monitorCtx = writable(createMonitor())
