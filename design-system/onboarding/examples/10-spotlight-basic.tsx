import React, { Component } from 'react';

import Lorem from 'react-lorem-component';

import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';

import { Highlight, HighlightGroup } from './styled';

interface State {
	active: number | null;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightBasicExample extends Component<Object, State> {
	state: State = { active: null };

	start = () => this.setState({ active: 0 });

	next = () => this.setState((state) => ({ active: (state.active || 0) + 1 }));

	prev = () => this.setState((state) => ({ active: (state.active || 0) - 1 }));

	finish = () => this.setState({ active: null });

	renderActiveSpotlight = () => {
		const variants = [
			<Spotlight
				actions={[
					{
						onClick: this.next,
						text: 'Tell me more',
					},
				]}
				dialogPlacement="bottom left"
				heading="Green"
				target="green"
				key="green"
				pulse={false}
			>
				<Lorem count={1} />
			</Spotlight>,
			<Spotlight
				actions={[
					{ onClick: this.next, text: 'Next' },
					{ onClick: this.prev, text: 'Prev', appearance: 'subtle' },
				]}
				dialogPlacement="bottom center"
				heading="Yellow"
				target="yellow"
				key="yellow"
			>
				<Lorem count={1} />
			</Spotlight>,
			<Spotlight
				actions={[{ onClick: this.finish, text: 'Got it' }]}
				dialogPlacement="bottom right"
				heading="Red"
				target="red"
				key="red"
			>
				<Lorem count={1} />
			</Spotlight>,
		];

		if (this.state.active == null) {
			return null;
		}

		return variants[this.state.active];
	};

	render() {
		return (
			<SpotlightManager>
				<HighlightGroup>
					<SpotlightTarget name="green">
						<Highlight color="green">First Element</Highlight>
					</SpotlightTarget>
					<SpotlightTarget name="yellow">
						<Highlight color="yellow">Second Element</Highlight>
					</SpotlightTarget>
					<SpotlightTarget name="red">
						<Highlight color="red">Third Element</Highlight>
					</SpotlightTarget>
				</HighlightGroup>

				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<p style={{ marginBottom: '1em' }}>
					Use spotlight to highlight elements in your app to users.
				</p>

				<button type="button" onClick={this.start}>
					Start
				</button>

				<SpotlightTransition>{this.renderActiveSpotlight()}</SpotlightTransition>
			</SpotlightManager>
		);
	}
}
