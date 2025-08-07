import { type Placement as ADSPopperPlacement } from '@atlaskit/popper';

export type Placement = Extract<
	ADSPopperPlacement,
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'right-start'
	| 'right-end'
	| 'left-start'
	| 'left-end'
>;
