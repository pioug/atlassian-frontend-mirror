export const alignSelfMap = {
  center: 'center',
  start: 'start',
  stretch: 'stretch',
  end: 'end',
  baseline: 'baseline',
} as const;

export type AlignSelf = keyof typeof alignSelfMap;
