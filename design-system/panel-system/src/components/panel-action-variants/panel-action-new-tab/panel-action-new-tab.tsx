import React from 'react';

import LinkExternalIcon from '@atlaskit/icon/core/link-external';

import { PanelAction } from '../../panel-action/panel-action';
import type { PanelActionProps } from '../../panel-action/types';

export interface PanelActionNewTabProps extends Pick<PanelActionProps, 'onClick' | 'testId'> {
	/**
	 * URL to open in the new tab.
	 */
	href: string;
}

/**
 * The PanelActionNewTab component provides a new tab action button
 * for opening panel content in a new browser tab.
 */
export function PanelActionNewTab({
	href,
	onClick,
	testId,
}: PanelActionNewTabProps): React.JSX.Element {
	return (
		<PanelAction
			onClick={onClick}
			testId={testId}
			icon={LinkExternalIcon}
			label="Open in new tab"
			href={href}
			target="_blank"
			rel="noopener noreferrer"
		/>
	);
}
