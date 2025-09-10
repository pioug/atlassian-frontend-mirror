import React from 'react';

import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

import { PanelAction } from '../../panel-action/panel-action';
import type { PanelActionProps } from '../../panel-action/types';

export interface PanelActionMoreProps extends Pick<PanelActionProps, 'onClick' | 'testId'> {}

/**
 * The PanelActionMore component provides a more actions dropdown button
 * for overflow actions in panel headers.
 */
export function PanelActionMore({ onClick, testId }: PanelActionMoreProps) {
	return (
		<PanelAction
			onClick={onClick}
			testId={testId}
			icon={ShowMoreHorizontalIcon}
			label="More actions"
			aria-haspopup="true"
		/>
	);
}
