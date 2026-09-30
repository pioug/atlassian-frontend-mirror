export type EaseInOutCurve = 'cubic-bezier(0.15,1,0.3,1)';
export type EaseOutCurve = 'cubic-bezier(0.2,0,0,1)';
export type EaseInCurve = 'cubic-bezier(0.8,0,0,0.8)';
export type EaseIn40OutCurve = 'cubic-bezier(0.4,0,0,1)';
export type EaseIn60OutCurve = 'cubic-bezier(0.6,0,0,1)';
export type EaseIn80OutCurve = 'cubic-bezier(0.8,0,0,1)';
export type LinearCurve = 'cubic-bezier(0,0,1,1)';

export type AnimationCurve =
	| EaseInOutCurve
	| EaseOutCurve
	| EaseInCurve
	| EaseIn40OutCurve
	| EaseIn60OutCurve
	| EaseIn80OutCurve
	| LinearCurve;

export const easeInOut: AnimationCurve = 'cubic-bezier(0.15,1,0.3,1)' satisfies EaseInOutCurve;

export const easeOut: AnimationCurve = 'cubic-bezier(0.2,0,0,1)' satisfies EaseOutCurve;

export const easeIn: AnimationCurve = 'cubic-bezier(0.8,0,0,0.8)' satisfies EaseInCurve;

export const easeIn40Out: AnimationCurve = 'cubic-bezier(0.4,0,0,1)' satisfies EaseIn40OutCurve;

export const easeIn60Out: AnimationCurve = 'cubic-bezier(0.6,0,0,1)' satisfies EaseIn60OutCurve;

export const easeIn80Out: AnimationCurve = 'cubic-bezier(0.8,0,0,1)' satisfies EaseIn80OutCurve;

export const linear: AnimationCurve = 'cubic-bezier(0,0,1,1)' satisfies LinearCurve;
