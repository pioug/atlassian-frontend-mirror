import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import { FlagGroup } from '@atlaskit/flag';

import FeedbackCollector, { FeedbackFlag } from '../src';

interface State {
	isOpen: boolean;
	displayFlag: boolean;
}

const ENTRYPOINT_ID: string = 'e0d501eb-7386-4ba7-aedc-68dc1dde485a';
const name: string = 'Feedback Sender';
const aaid: string = 'test-aaid';

class DisplayFeedback extends Component<{}, State> {
	state = { isOpen: false, displayFlag: false };

	open = () => this.setState({ isOpen: true });

	close = () => this.setState({ isOpen: false });

	displayFlag = () => this.setState({ displayFlag: true });

	hideFlag = () => this.setState({ displayFlag: false });

	render() {
		const { isOpen, displayFlag } = this.state;
		return (
			<div>
				<Button appearance="primary" onClick={this.open}>
					Display Feedback
				</Button>

				{isOpen && (
					<FeedbackCollector
						url={'https://api-private.atlassian.com'}
						onClose={this.close}
						onSubmit={this.displayFlag}
						atlassianAccountId={aaid}
						name={name}
						entrypointId={ENTRYPOINT_ID}
					/>
				)}

				<FlagGroup onDismissed={this.hideFlag}>{displayFlag && <FeedbackFlag />}</FlagGroup>
			</div>
		);
	}
}

export default () => <DisplayFeedback />;
