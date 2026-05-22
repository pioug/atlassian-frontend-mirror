import React from 'react';

import { di } from 'react-magnetic-di';

import { withAnalyticsContext, type WithContextProps } from '@atlaskit/analytics-next';

import { LinkAnalyticsContext } from '../../utils/analytics/LinkAnalyticsContext';

import Hyperlink from './Hyperlink';
import { HyperlinkWithSmartLinkResolver } from './HyperlinkResolver';
import LinkWarningModal from './LinkWarningModal';
import { useLinkWarningModal } from './LinkWarningModal/hooks/use-link-warning-modal';
import { type LinkUrlProps, type PackageDataType } from './types';
const PACKAGE_DATA: PackageDataType = {
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
	componentName: 'linkUrl',
};

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
	di(useLinkWarningModal);
	const { isLinkSafe, showSafetyWarningModal, ...linkWarningModalProps } = useLinkWarningModal();

	const Link = enableResolve ? HyperlinkWithSmartLinkResolver : Hyperlink;
	return (
		<>
			<LinkAnalyticsContext url={href} display="url">
				<Link
					href={href}
					testId={testId}
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
};

const _default_1: React.ForwardRefExoticComponent<
	LinkUrlProps & WithContextProps & React.RefAttributes<any>
> = withAnalyticsContext(PACKAGE_DATA)(LinkUrl);
export default _default_1;
