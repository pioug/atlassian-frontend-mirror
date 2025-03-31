/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';

import { Highlight } from './styled';

const wrapperStyles = css({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
});

interface State {
	active: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightButtonAppearanceExample extends Component<{}, State> {
	state: State = { active: false };

	start = () => this.setState({ active: true });

	finish = () => this.setState({ active: false });

	render() {
		const { active } = this.state;

		return (
			<div css={wrapperStyles}>
				<SpotlightManager>
					<SpotlightTarget name="custom-button-appearances">
						<Highlight color="neutral">Target</Highlight>
					</SpotlightTarget>

					<p>
						<Button onClick={this.start} testId="open-spotlight">
							Show
						</Button>
					</p>
					<SpotlightTransition>
						{active && (
							<Spotlight
								actions={[
									{ onClick: this.finish, text: 'Default' },
									{
										appearance: 'subtle',
										onClick: this.finish,
										text: 'Subtle',
									},
									{
										appearance: 'subtle-link',
										onClick: this.finish,
										text: 'Subtle link',
									},
								]}
								dialogPlacement="top center"
								heading="Custom button appearances"
								key="custom-button-appearances"
								target="custom-button-appearances"
							>
								<p>
									Spotlight provides theming for <code>default</code>, <code>subtle</code>, and{' '}
									<code>subtle-link</code> button appearances.
								</p>
							</Spotlight>
						)}
					</SpotlightTransition>
				</SpotlightManager>
			</div>
		);
	}
}
