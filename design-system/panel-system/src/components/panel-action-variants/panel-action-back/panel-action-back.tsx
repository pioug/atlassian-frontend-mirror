import React from 'react';

import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';

import { PanelAction } from '../../panel-action/panel-action';
import type { PanelActionProps } from '../../panel-action/types';

export interface PanelActionBackProps extends Pick<PanelActionProps, 'onClick' | 'testId'> {}

/**
 * The PanelActionBack component provides a back action button
 * for navigating back to the previous view in panels.
 */
export function PanelActionBack({ onClick, testId }: PanelActionBackProps): React.JSX.Element {
	return <PanelAction onClick={onClick} testId={testId} icon={ChevronLeftIcon} label="Go back" />;
}
