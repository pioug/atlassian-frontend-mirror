import React from 'react';

import { ActionsBarWrapper } from './actionsBarWrapper';
import { CardActionsView } from './cardActions/cardActionsView';
import { CardActionIconButtonVariant } from './cardActions/styles';
import { type ActionsBarProps } from './types';

export class ActionsBar extends React.Component<ActionsBarProps> {
	render(): React.JSX.Element | null {
		const { isFixed, filename, actions } = this.props;

		if (actions.length === 0) {
			return null;
		}

		return (
			<ActionsBarWrapper isFixed={isFixed}>
				<CardActionsView
					filename={filename}
					actions={actions}
					variant={CardActionIconButtonVariant.filled}
				/>
			</ActionsBarWrapper>
		);
	}
}
