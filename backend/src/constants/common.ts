import { toNumber } from 'lodash'

export const PORT = toNumber(process.env.PORT) || 5000

export const SYNC_RATE = toNumber(process.env.SYNC_RATE) || 100
