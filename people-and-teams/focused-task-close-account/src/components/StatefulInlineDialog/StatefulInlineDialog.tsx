import React from 'react';
import InlineDialog, { type Placement } from '@atlaskit/inline-dialog';

interface Props {
	children: React.ReactNode;
	content: React.ReactNode;
	placement?: Placement;
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
		const { children, content, placement } = this.props;
		return (
			<InlineDialog content={content} placement={placement} isOpen={this.state.isOpen}>
				{/* eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events*/}
				<span onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
					{children}
				</span>
			</InlineDialog>
		);
	}
}

export default StatefulInlineDialog;
