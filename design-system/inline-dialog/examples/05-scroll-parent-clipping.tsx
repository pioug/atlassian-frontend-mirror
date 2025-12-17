import React, { Component } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import InlineDialog from '@atlaskit/inline-dialog';
import { token } from '@atlaskit/tokens';

interface State {
	dialogOpen: boolean;
}

const content = (
	<div>
		<p>Some content within the inline-dialog so that it gets a little wider</p>
	</div>
);

export default class InlineDialogParentClippingExample extends Component<{}, State> {
	state = {
		dialogOpen: false,
	};

	toggleDialog = (): void => this.setState({ dialogOpen: !this.state.dialogOpen });

	render(): React.JSX.Element {
		return (
			<div>
				<p>
					The inline-dialog should break out of the overflow: hidden; parent and also react to
					window bounds when you resize the viewport.
				</p>
				<div
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						border: `${token('border.width.selected')} dashed grey`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						boxSizing: 'border-box',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						height: '100px',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						margin: '10px auto',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						overflow: 'hidden',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						position: 'relative',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						width: '95%',
					}}
				>
					<Lorem count={1} />
					<p>
						Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
						consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco
						minim nostrud elit officia tempor esse quis.
						<InlineDialog content={content} isOpen={this.state.dialogOpen}>
							<Button
								isSelected={this.state.dialogOpen}
								onClick={this.toggleDialog}
								appearance="primary"
							>
								Click to open
							</Button>
						</InlineDialog>
					</p>
					<Lorem count={6} />
				</div>
			</div>
		);
	}
}
