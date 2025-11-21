import React, { Component } from 'react';

import Lorem from 'react-lorem-component';

import { Code } from '@atlaskit/code';
import { Spotlight, SpotlightManager, SpotlightTarget } from '@atlaskit/onboarding';

import { Highlight, HighlightGroup } from './styled';

interface State {
	active: number | null;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightTargetRadiusExample extends Component<{}, State> {
	state: State = { active: null };

	start = () => this.setState({ active: 0 });

	next = () =>
		this.setState((state) => ({
			active: state.active != null ? state.active + 1 : null,
		}));

	prev = () =>
		this.setState((state) => ({
			active: state.active != null ? state.active - 1 : null,
		}));

	finish = () => this.setState({ active: null });

	renderActiveSpotlight(): React.JSX.Element | null {
		const variants = [
			<Spotlight
				actions={[
					{
						onClick: this.next,
						text: 'Tell me more',
					},
				]}
				dialogPlacement="bottom left"
				heading="Small"
				key="small"
				target="small"
				targetRadius={4}
			>
				<Lorem count={1} />
			</Spotlight>,
			<Spotlight
				actions={[
					{ onClick: this.next, text: 'Next' },
					{ onClick: this.prev, text: 'Prev', appearance: 'subtle' },
				]}
				dialogPlacement="bottom center"
				heading="Medium"
				key="medium"
				target="medium"
				targetRadius={12}
			>
				<Lorem count={1} />
			</Spotlight>,
			<Spotlight
				actions={[{ onClick: this.finish, text: 'Got it' }]}
				dialogPlacement="bottom right"
				heading="Large"
				key="large"
				target="large"
				targetRadius={24}
			>
				<Lorem count={1} />
			</Spotlight>,
		];

		return this.state.active == null ? null : variants[this.state.active];
	}

	render(): React.JSX.Element {
		return (
			<SpotlightManager>
				<HighlightGroup>
					<SpotlightTarget name="small">
						<Highlight color="blue" radius={4}>
							Small
						</Highlight>
					</SpotlightTarget>
					<SpotlightTarget name="medium">
						<Highlight color="teal" radius={12}>
							Medium
						</Highlight>
					</SpotlightTarget>
					<SpotlightTarget name="large">
						<Highlight color="green" radius={24}>
							Large
						</Highlight>
					</SpotlightTarget>
				</HighlightGroup>

				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<p style={{ marginBottom: '1em' }}>
					Rather than digging around in the DOM to find the element applying a border-radius,
					let&apos;s be explicit, define <Code>targetRadius</Code> on the Spotlight to round the
					cloned element.
				</p>

				<button type="button" onClick={this.start}>
					Start
				</button>

				{this.renderActiveSpotlight()}
			</SpotlightManager>
		);
	}
}
