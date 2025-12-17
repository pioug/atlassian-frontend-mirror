import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import { Modal } from '@atlaskit/onboarding';

import welcomeImage from './assets/this-is-new-jira.png';

interface State {
	active: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class ModalWideButtonTextExample extends Component<{}, State> {
	state: State = { active: false };

	start = (): void => this.setState({ active: true });

	finish = (): void => this.setState({ active: false });

	render(): React.JSX.Element {
		const { active } = this.state;

		return (
			<div>
				<Button onClick={this.start}>Launch benefits modal with wide button text</Button>
				{active && (
					<Modal
						actions={[
							{
								onClick: this.finish,
								text: 'Switch to the new Jira, this is a great time to try it!',
							},
							{
								onClick: this.finish,
								text: "Remind me later, I don't have time right now",
							},
						]}
						heading="Experience your new Jira"
						image={welcomeImage}
						key="welcome"
					>
						<p>
							Switch context, jump between project, and get back to work quickly with our new look
							and feel.
						</p>
						<p>Take it for a spin and let us know what you think.</p>
					</Modal>
				)}
			</div>
		);
	}
}
