import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';

import { Highlight } from './styled';

interface State {
	active: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightTargetFixedPositionExample extends Component<{}, State> {
	state: State = { active: false };

	start = (): void => this.setState({ active: true });

	finish = (): void => this.setState({ active: false });

	render(): React.JSX.Element {
		const { active } = this.state;

		return (
			<SpotlightManager>
				<div>
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							position: 'fixed',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: '100vh',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: 300,

							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							background: 'salmon',
						}}
					>
						<div
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								position: 'relative',
							}}
						>
							<SpotlightTarget name="fixed-position">
								<Highlight color="neutral">
									<h1>Target</h1>
								</Highlight>
							</SpotlightTarget>
						</div>
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginLeft: 300, textAlign: 'center' }}>
						<h1>Scroll down and click on the button</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<h1>...</h1>
						<p>
							<Button onClick={this.start}>Show now</Button>
						</p>
						<h1>...</h1>
						<SpotlightTransition>
							{active && (
								<Spotlight
									actions={[
										{ onClick: this.finish, text: 'Got it' },
										{
											appearance: 'subtle',
											onClick: this.finish,
											text: 'Back',
										},
									]}
									dialogPlacement="top center"
									heading="Target is in a fixed position"
									key="target-fixed-position"
									target="fixed-position"
								>
									<p>
										Spotlight is used to introduce new features and functionality when on-boarding
										or change-boarding users.
									</p>
								</Spotlight>
							)}
						</SpotlightTransition>
					</div>
				</div>
			</SpotlightManager>
		);
	}
}
