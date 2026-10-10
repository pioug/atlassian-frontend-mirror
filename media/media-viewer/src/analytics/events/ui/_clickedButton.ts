import type { UIAttributes, UIEventPayload } from '@atlaskit/media-common/analytics/types';

export type ButtonClickEventPayload<Attributes extends UIAttributes> = UIEventPayload<
	Attributes,
	'clicked',
	'button'
>;
