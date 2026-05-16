import React, { type ComponentType, useCallback, useEffect } from 'react';

import { withErrorBoundary as withReactErrorBoundary } from 'react-error-boundary';
import { injectIntl } from 'react-intl';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { getFirstPartyIdentifier, getThirdPartyARI } from '../../../state/helpers';
import useResolveHyperlink from '../../../state/hooks/use-resolve-hyperlink';
import useResolveHyperlinkValidator from '../../../state/hooks/use-resolve-hyperlink/useResolveHyperlinkValidator';
import { SmartLinkAnalyticsContext } from '../../../utils/analytics/SmartLinkAnalyticsContext';
import { isAuxClick } from '../../../utils/click-helpers';
import withIntlProvider from '../../common/intl-provider';
import { useFire3PWorkflowsClickEvent } from '../../SmartLinkEvents/useSmartLinkEvents';
import Hyperlink from '../Hyperlink';
import type { LinkUrlProps } from '../types';

const TRACK_NON_PRIMARY_3P_CLICKS_EXPERIMENT = 'linking_platform_track_non_primary_3p_clicks';

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

	// Shared scope guard for all 3P-click handlers.
	const shouldFire3PClickEvent =
		state?.status === 'resolved' && fire3PClickEvent && fg('platform_smartlink_3pclick_analytics');

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			// button === 0 is left-click, see
			// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
			if (shouldFire3PClickEvent && e?.button === 0) {
				fire3PClickEvent?.();
			}
			onClickCallback?.(e);
		},
		[onClickCallback, fire3PClickEvent, shouldFire3PClickEvent],
	);

	// Fire experiment exposure once per surface mount, not on every re-render.
	useEffect(() => {
		if (shouldFire3PClickEvent) {
			expValEquals(TRACK_NON_PRIMARY_3P_CLICKS_EXPERIMENT, 'isEnabled', true);
		}
	}, [shouldFire3PClickEvent]);

	const onAuxClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			// isAuxClick guards against Windows right-clicks firing onAuxClick with button === 2.
			if (
				isAuxClick(e) &&
				shouldFire3PClickEvent &&
				expValEqualsNoExposure(TRACK_NON_PRIMARY_3P_CLICKS_EXPERIMENT, 'isEnabled', true)
			) {
				fire3PClickEvent?.({ isAuxClick: true });
			}
		},
		[fire3PClickEvent, shouldFire3PClickEvent],
	);

	const onContextMenu = useCallback(
		(_e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			if (
				shouldFire3PClickEvent &&
				expValEqualsNoExposure(TRACK_NON_PRIMARY_3P_CLICKS_EXPERIMENT, 'isEnabled', true)
			) {
				fire3PClickEvent?.({ isContextMenu: true });
			}
		},
		[fire3PClickEvent, shouldFire3PClickEvent],
	);

	return (
		<Hyperlink {...props} onClick={onClick} onAuxClick={onAuxClick} onContextMenu={onContextMenu} />
	);
};

export const HyperlinkWithSmartLinkResolver: React.ComponentType<LinkUrlProps> =
	withReactErrorBoundary(
		withValidator(
			injectIntl(withIntlProvider(HyperlinkWithSmartLinkResolverInner), { enforceContext: false }),
			Hyperlink,
		),
		{ FallbackComponent: HyperlinkFallbackComponent },
	);
