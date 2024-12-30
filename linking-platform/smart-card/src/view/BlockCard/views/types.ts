import { type FlexibleCardProps } from '../../FlexibleCard/types';

export type FlexibleBlockCardProps = Pick<
	FlexibleCardProps,
	| 'cardState'
	| 'id'
	| 'onAuthorize'
	| 'onClick'
	| 'onError'
	| 'onResolve'
	| 'renderers'
	| 'actionOptions'
	| 'testId'
	| 'url'
>;
