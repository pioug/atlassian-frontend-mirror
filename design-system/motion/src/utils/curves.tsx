export type AnimationCurve =
  | 'cubic-bezier(0.15,1,0.3,1)'
  | 'cubic-bezier(0.2,0,0,1)'
  | 'cubic-bezier(0.8,0,0,0.8)';

export const easeInOut: AnimationCurve = 'cubic-bezier(0.15,1,0.3,1)';

export const easeOut: AnimationCurve = 'cubic-bezier(0.2,0,0,1)';

export const easeIn: AnimationCurve = 'cubic-bezier(0.8,0,0,0.8)';
