import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import InlineDialog from '@atlaskit/inline-dialog';

interface State {
	dialogOpen: boolean;
}

const content = (
	<div>
		<p>Hello!</p>
		<Button testId="inline-dialog-inner-first">First action</Button>
		<Button testId="inline-dialog-inner-second">Second action</Button>
	</div>
);

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class InlineDialogTestingExample extends Component<{}, State> {
	state = {
		dialogOpen: false,
	};

	toggleDialog = (): void => this.setState({ dialogOpen: !this.state.dialogOpen });

	render(): React.JSX.Element {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ minHeight: '120px' }}>
				<InlineDialog
					onClose={() => {
						this.setState({ dialogOpen: false });
					}}
					content={content}
					isOpen={this.state.dialogOpen}
					testId="inline-dialog"
				>
					<Button
						isSelected={this.state.dialogOpen}
						onClick={this.toggleDialog}
						testId="open-inline-dialog-button"
					>
						Click me!
					</Button>
				</InlineDialog>
				<Button testId="after-inline-dialog-button">Focus after dialog</Button>
			</div>
		);
	}
}
