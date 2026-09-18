import React, { type ComponentType, useCallback } from 'react';

import { withErrorBoundary as withReactErrorBoundary } from 'react-error-boundary';
import { injectIntl } from 'react-intl';

import { getFirstPartyIdentifier } from '../../../state/getFirstPartyIdentifier';
import { getThirdPartyARI } from '../../../state/getThirdPartyARI';
import useResolveHyperlink from '../../../state/hooks/use-resolve-hyperlink';
import { default as useResolveHyperlinkValidator } from '../../../state/hooks/use-resolve-hyperlink/useResolveHyperlinkValidator';
import { SmartLinkAnalyticsContext } from '../../../utils/analytics/SmartLinkAnalyticsContext';
import { isAuxClick } from '../../../utils/is-aux-click';
import withIntlProvider from '../../common/intl-provider';
import { useFire3PWorkflowsClickEvent } from '../../SmartLinkEvents/useFire3PWorkflowsClickEvent';
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

	const fire3PClickEvent = useFire3PWorkflowsClickEvent(firstPartyIdentifier, thirdPartyARI);

	// Shared scope guard for all 3P-click handlers.
	const shouldFire3PClickEvent = state?.status === 'resolved' && fire3PClickEvent;

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

	const onAuxClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			// isAuxClick guards against Windows right-clicks firing onAuxClick with button === 2.
			if (isAuxClick(e) && shouldFire3PClickEvent) {
				fire3PClickEvent?.({ isAuxClick: true });
			}
		},
		[fire3PClickEvent, shouldFire3PClickEvent],
	);

	const onContextMenu = useCallback(
		(_e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			if (shouldFire3PClickEvent) {
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
