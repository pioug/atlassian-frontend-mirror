export const POPUP_Z_INDEX = 'akEditorMenuZIndex';

export const POPUP_DIMENSIONS = {
  EMOJI_PICKER: {
    fitHeight: 350,
    fitWidth: 350,
    offset: [0, 3] as [number, number],
  },
} as const;

export const FOCUS_DELAY = {
  ANIMATION_FRAME: 'requestAnimationFrame',
  MICROTASK: 'queueMicrotask',
} as const;