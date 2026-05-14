import React, { type ComponentType, useCallback } from 'react';

import { withErrorBoundary as withReactErrorBoundary } from 'react-error-boundary';
import { injectIntl } from 'react-intl';

import { fg } from '@atlaskit/platform-feature-flags';

import { getFirstPartyIdentifier, getThirdPartyARI } from '../../../state/helpers';
import useResolveHyperlink from '../../../state/hooks/use-resolve-hyperlink';
import useResolveHyperlinkValidator from '../../../state/hooks/use-resolve-hyperlink/useResolveHyperlinkValidator';
import { SmartLinkAnalyticsContext } from '../../../utils/analytics/SmartLinkAnalyticsContext';
import withIntlProvider from '../../common/intl-provider';
import { useFire3PWorkflowsClickEvent } from '../../SmartLinkEvents/useSmartLinkEvents';
import Hyperlink from '../Hyperlink';
import type { LinkUrlProps } from '../types';

const HyperlinkFallbackComponent = () => null;

const withValidator =
	(Component: ComponentType<LinkUrlProps>, DefaultComponent: ComponentType<LinkUrlProps>) =>
	(props: LinkUrlProps) => {
		const shouldResolveHyperlink = useResolveHyperlinkValidator(props?.href);
		return shouldResolveHyperlink && props.href ? (
			<SmartLinkAnalyticsContext url={props.href} display="url">
				<Component {...props} />
			</SmartLinkAnalyticsContext>
		) : (
			<DefaultComponent {...props} />
		);
	};

const HyperlinkWithSmartLinkResolverInner = ({
	onClick: onClickCallback,
	...props
}: LinkUrlProps) => {
	const { state } = useResolveHyperlink({ href: props.href || '' });

	const thirdPartyARI = getThirdPartyARI(state?.details);
	const firstPartyIdentifier = getFirstPartyIdentifier();

	const fire3PClickEvent = fg('platform_smartlink_3pclick_analytics')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFire3PWorkflowsClickEvent(firstPartyIdentifier, thirdPartyARI)
		: undefined;

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			// Only fire the event if the feature flag is on and other conditions are met
			if (
				state?.status === 'resolved' &&
				e?.button === 0 &&
				fire3PClickEvent &&
				fg('platform_smartlink_3pclick_analytics')
			) {
				// 0 taken from button state representation -
				// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
				fire3PClickEvent();
			}
			onClickCallback?.(e);
		},
		[onClickCallback, fire3PClickEvent, state?.status],
	);

	return <Hyperlink {...props} onClick={onClick} />;
};

export const HyperlinkWithSmartLinkResolver: React.ComponentType<LinkUrlProps> =
	withReactErrorBoundary(
		withValidator(
			injectIntl(withIntlProvider(HyperlinkWithSmartLinkResolverInner), { enforceContext: false }),
			Hyperlink,
		),
		{ FallbackComponent: HyperlinkFallbackComponent },
	);
