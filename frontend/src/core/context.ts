import { writable } from 'svelte/store'
import type PIXI from 'pixi.js'

export const appContext = writable<PIXI.Application>()
