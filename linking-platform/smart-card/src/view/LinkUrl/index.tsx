import React from 'react';

import { di } from 'react-magnetic-di';

import { withAnalyticsContext } from '@atlaskit/analytics-next';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import AKLink from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

import { withLinkClickedEvent } from '../../utils/analytics/click';
import { LinkAnalyticsContext } from '../../utils/analytics/LinkAnalyticsContext';

import Hyperlink from './Hyperlink';
import HyperlinkResolver, { HyperlinkWithSmartLinkResolver } from './HyperlinkResolver';
import LinkWarningModal from './LinkWarningModal';
import { useLinkWarningModal } from './LinkWarningModal/hooks/use-link-warning-modal';
import { type LinkUrlProps, type PackageDataType } from './types';
const PACKAGE_DATA: PackageDataType = {
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
	componentName: 'linkUrl',
};

const Anchor = withLinkClickedEvent('a');
export const LinkComponent = withLinkClickedEvent(AKLink);

const LinkUrl = ({
	href,
	children,
	checkSafety = true,
	onClick,
	testId = 'link-with-safety',
	isLinkComponent = false,
	enableResolve = false,
	...props
}: LinkUrlProps) => {
	di(LinkComponent, useLinkWarningModal);
	const { isLinkSafe, showSafetyWarningModal, ...linkWarningModalProps } = useLinkWarningModal();

	const resolveHyperlinkFG = FeatureGates.checkGate(
		'platform_editor_resolve_hyperlinks_killswitch',
	);

	if (fg('navx-1834-refactor-resolved-hyperlink')) {
		if (resolveHyperlinkFG) {
			const Link = enableResolve ? HyperlinkWithSmartLinkResolver : Hyperlink;
			return (
				<>
					<LinkAnalyticsContext url={href} display="url">
						<Link
							href={href}
							isLinkComponent={isLinkComponent}
							onClick={(e) => {
								if (!checkSafety) {
									onClick && onClick(e);
									return;
								}

								// Only call the onClick if the link is safe
								if (isLinkSafe(e, href)) {
									onClick && onClick(e);
								} else {
									showSafetyWarningModal(e, href);
								}
							}}
							{...props}
						>
							{children}
						</Link>
					</LinkAnalyticsContext>
					{checkSafety && <LinkWarningModal {...linkWarningModalProps} />}
				</>
			);
		}
	}

	const Link = isLinkComponent ? LinkComponent : Anchor;

	return (
		<>
			<LinkAnalyticsContext url={href} display="url">
				<Link
					{...(isLinkComponent ? { testId } : { 'data-testid': testId })}
					href={href || ''}
					onClick={(e) => {
						if (!checkSafety) {
							onClick && onClick(e);
							return;
						}

						// Only call the onClick if the link is safe
						if (isLinkSafe(e, href)) {
							onClick && onClick(e);
						} else {
							showSafetyWarningModal(e, href);
						}
					}}
					{...props}
				>
					{children}
				</Link>
			</LinkAnalyticsContext>
			{checkSafety && <LinkWarningModal {...linkWarningModalProps} />}
			{/* Remove this on the cleanup of navx-1834-refactor-resolved-hyperlink */}
			{enableResolve &&
				href &&
				resolveHyperlinkFG &&
				!fg('navx-1834-refactor-resolved-hyperlink') && <HyperlinkResolver href={href} />}
		</>
	);
};

export default withAnalyticsContext(PACKAGE_DATA)(LinkUrl);
