import React from 'react';

import SidebarExpandIcon from '@atlaskit/icon/core/sidebar-expand';

import { PanelAction } from '../../panel-action/panel-action';
import type { PanelActionProps } from '../../panel-action/types';

export interface PanelActionExpandProps extends Pick<PanelActionProps, 'onClick' | 'testId'> {}

/**
 * The PanelActionExpand component provides an expand action button
 * for opening panels in full-screen modal experiences.
 */
export function PanelActionExpand({ onClick, testId }: PanelActionExpandProps): React.JSX.Element {
	return (
		<PanelAction onClick={onClick} testId={testId} icon={SidebarExpandIcon} label="Expand panel" />
	);
}
