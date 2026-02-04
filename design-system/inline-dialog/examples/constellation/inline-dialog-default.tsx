/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import InlineDialog from '@atlaskit/inline-dialog';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	container: {
		minHeight: '120px',
	},
});

interface State {
	dialogOpen: boolean;
}

const content = (
	<Box>
		<p>Hello!</p>
	</Box>
);

export default class InlineDialogDefaultExample extends Component<{}, State> {
	state = {
		dialogOpen: true,
	};

	toggleDialog = (): void => this.setState({ dialogOpen: !this.state.dialogOpen });

	render(): JSX.Element {
		return (
			<Box xcss={styles.container}>
				<InlineDialog
					onClose={() => {
						this.setState({ dialogOpen: false });
					}}
					content={content}
					isOpen={this.state.dialogOpen}
				>
					<Button
						appearance="primary"
						isSelected={this.state.dialogOpen}
						onClick={this.toggleDialog}
					>
						Click me!
					</Button>
				</InlineDialog>
			</Box>
		);
	}
}
