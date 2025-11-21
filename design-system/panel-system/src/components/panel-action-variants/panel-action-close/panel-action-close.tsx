import React from 'react';

import CrossIcon from '@atlaskit/icon/core/cross';

import { PanelAction } from '../../panel-action/panel-action';
import type { PanelActionProps } from '../../panel-action/types';

export interface PanelActionCloseProps extends Pick<PanelActionProps, 'onClick' | 'testId'> {}

/**
 * The PanelActionClose component provides a close action button
 * for closing panels and returning to the main content.
 */
export function PanelActionClose({ onClick, testId }: PanelActionCloseProps): React.JSX.Element {
	return <PanelAction onClick={onClick} testId={testId} icon={CrossIcon} label="Close panel" />;
}
