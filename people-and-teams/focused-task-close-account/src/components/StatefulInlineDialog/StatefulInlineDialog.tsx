import React from 'react';

import InlineDialog from '@atlaskit/inline-dialog/inline-dialog';
import type { Placement } from '@atlaskit/inline-dialog/types';

import { TriggerButton } from './styled';

interface Props {
	children: React.ReactNode;
	content: React.ReactNode;
	placement?: Placement;
	label: string;
}

interface State {
	isOpen: boolean;
}

export class StatefulInlineDialog extends React.Component<Props, State> {
	state = {
		isOpen: false,
	};

	openDialog = (): void => {
		this.setState({ isOpen: true });
	};

	closeDialog = (): void => {
		this.setState({ isOpen: false });
	};

	handleMouseOver = (): void => {
		this.openDialog();
	};

	handleMouseOut = (): void => {
		this.closeDialog();
	};

	render(): React.JSX.Element {
		const { children, content, placement, label } = this.props;
		return (
			<InlineDialog content={content} placement={placement} isOpen={this.state.isOpen}>
				<TriggerButton
					aria-label={label}
					onMouseOver={this.handleMouseOver}
					onMouseOut={this.handleMouseOut}
					onFocus={this.openDialog}
					onBlur={this.closeDialog}
				>
					{children}
				</TriggerButton>
			</InlineDialog>
		);
	}
}

export default StatefulInlineDialog;
