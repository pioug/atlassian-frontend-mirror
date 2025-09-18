import React, { type ComponentType, useCallback, useContext } from 'react';

import { withErrorBoundary as withReactErrorBoundary } from 'react-error-boundary';
import { injectIntl } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import { SmartCardContext } from '../../../state';
import { getFirstPartyIdentifier, getServices, getThirdPartyARI } from '../../../state/helpers';
import useResolveHyperlink from '../../../state/hooks/use-resolve-hyperlink';
import useResolveHyperlinkValidator, {
	isGoogleDomain,
	isSharePointDomain,
} from '../../../state/hooks/use-resolve-hyperlink/useResolveHyperlinkValidator';
import withIntlProvider from '../../common/intl-provider';
import { useFire3PWorkflowsClickEvent } from '../../SmartLinkEvents/useSmartLinkEvents';
import Hyperlink from '../Hyperlink';
import type { LinkUrlProps } from '../types';

import withErrorBoundary from './error-boundary';
import { ResolveHyperlink } from './resolve-hyperlink';
import HyperlinkUnauthorizedView from './unauthorize-view';

const HyperlinkFallbackComponent = () => null;

const withValidator =
	(Component: ComponentType<LinkUrlProps>, DefaultComponent: ComponentType<LinkUrlProps>) =>
	(props: LinkUrlProps) => {
		const shouldResolveHyperlink = useResolveHyperlinkValidator(props?.href);
		return shouldResolveHyperlink ? <Component {...props} /> : <DefaultComponent {...props} />;
	};

const HyperlinkWithSmartLinkResolverInner = ({
	onClick: onClickCallback,
	...props
}: LinkUrlProps) => {
	const { actions, state } = useResolveHyperlink({ href: props.href || '' });

	const services = getServices(state?.details);
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

	// TODO: AI3W-1113: Show auth button
	const onAuthorize = fg('platform_linking_plain_hyperlink_connect_button')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useCallback(
				() =>
					// TODO: Need to add hyperlink type
					actions.authorize('inline'),
				[actions],
			)
		: undefined;

	if (fg('platform_linking_plain_hyperlink_connect_button')) {
		switch (state?.status) {
			case 'unauthorized':
				const provider = extractSmartLinkProvider(state?.details);
				return (
					<HyperlinkUnauthorizedView
						{...props}
						onAuthorize={services?.length ? onAuthorize : undefined}
						onClick={onClick}
						provider={provider}
					/>
				);
			default:
				return <Hyperlink {...props} onClick={onClick} />;
		}
	}

	return <Hyperlink {...props} onClick={onClick} />;
};

export const HyperlinkWithSmartLinkResolver = withReactErrorBoundary(
	withValidator(
		injectIntl(withIntlProvider(HyperlinkWithSmartLinkResolverInner), { enforceContext: false }),
		Hyperlink,
	),
	{ FallbackComponent: HyperlinkFallbackComponent },
);

// Remove on navx-1834-refactor-resolved-hyperlink cleanup
export interface HyperlinkResolverProps {
	href: string;
}

const HyperlinkResolver = ({ href }: HyperlinkResolverProps) => {
	const hasSmartCardProvider = !!useContext(SmartCardContext);
	const isSharePointResolveEnabled =
		FeatureGates.getExperimentValue(
			'platform_editor_resolve_hyperlinks_confluence',
			'isEnabled',
			false,
		) ||
		FeatureGates.getExperimentValue('platform_editor_resolve_hyperlinks_jira', 'isEnabled', false);

	const isGoogleResolveEnabled = FeatureGates.getExperimentValue(
		'platform_editor_resolve_google_hyperlinks',
		'isEnabled',
		false,
	);

	const shouldResolveSharePoint = isSharePointDomain(href) && isSharePointResolveEnabled;
	const shouldResolveGoogle = isGoogleDomain(href) && isGoogleResolveEnabled;
	const shouldResolveHyperlink =
		hasSmartCardProvider && (shouldResolveSharePoint || shouldResolveGoogle);

	if (!shouldResolveHyperlink) {
		return null;
	}

	return <ResolveHyperlink href={href} />;
};

export default withErrorBoundary(HyperlinkResolver);
