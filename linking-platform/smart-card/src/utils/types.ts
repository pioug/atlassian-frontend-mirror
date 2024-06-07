import { type GasPayload } from '@atlaskit/analytics-gas-types';
import { type CardInnerAppearance } from '../view/Card/types';

// Types of analytics have been defined in the minimum event spec here:
// https://hello.atlassian.net/wiki/spaces/PData/pages/367398441/Minimum+Event+Spec+-+Smart+Links
export type AnalyticsAction =
	| 'authStarted'
	| 'clicked'
	| 'closed'
	| 'connected'
	| 'connectFailed'
	| 'connectSucceeded'
	| 'created'
	| 'dismissed'
	| 'inserted'
	| 'renderFailed'
	| 'renderSuccess'
	| 'renderWithStatus'
	| 'resolved'
	| 'viewed'
	| 'unresolved'
	| 'updated'
	| 'chunkLoadFailed'
	| 'dwelled'
	| 'focused'
	| 'started'
	| 'success'
	| 'failed'
	| 'loaded';

export type AnalyticsActionSubject =
	| 'smartLink'
	| 'smartLinkAction'
	| 'applicationAccount'
	| 'button'
	| 'consentModal'
	| 'hoverCard'
	| 'modal'
	| 'embedPreviewModal'
	| 'smartLinkIframe'
	| 'link'
	| 'smartLinkQuickAction'
	| 'relatedLinks';

export type AnalyticsName = 'embedPreviewModal';

export type AnalyticsOrigin =
	| 'smartLinkCard'
	| 'smartLinkEmbed'
	| 'smartLinkInline'
	| 'smartLinkPreviewHoverCard';

export type AnalyticsPayload = GasPayload & {
	action?: AnalyticsAction;
	actionSubject: AnalyticsActionSubject;
	attributes: GasPayload['attributes'] & {
		display?: CardInnerAppearance;
	};
};

export type AnalyticsHandler = (event: AnalyticsPayload) => void;
