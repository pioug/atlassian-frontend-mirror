/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component, type ImgHTMLAttributes } from 'react';

import { css, jsx } from '@compiled/react';
import Lorem from 'react-lorem-component';

import { Code } from '@atlaskit/code';
import {
	Spotlight,
	SpotlightManager,
	SpotlightPulse,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { token } from '@atlaskit/tokens';

import logoInverted from './assets/logo-inverted.png';
import logo from './assets/logo.png';

const Replacement = (rect: any) => {
	const style = {
		borderRadius: token('radius.small', '3px'),
		overflow: 'hidden',
		...rect,
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<SpotlightPulse style={style}>
			<Image alt="I replace the target element." src={logoInverted} />
		</SpotlightPulse>
	);
};

const imageStyles = css({
	width: '128px',
	height: '128px',
	borderRadius: token('radius.small', '3px'),
});

const Image = ({ alt, src }: ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={src} alt={alt} css={imageStyles} />
);

interface State {
	active: boolean;
}
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightTargetReplacementExample extends Component<{}, State> {
	state: State = {
		active: false,
	};

	show = (): void => this.setState({ active: true });

	hide = (): void => this.setState({ active: false });

	render() {
		const { active } = this.state;

		return (
			<SpotlightManager>
				{/* so we don't get a gross flash on reveal */}
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<img alt="hidden" src={logoInverted} style={{ display: 'none' }} />

				<SpotlightTarget name="target-replacement-example">
					<Image alt="I will be replaced..." src={logo} />
				</SpotlightTarget>

				<p>
					For whatever reason, you may need to show the user something slightly different to the
					original target element. You can achieve this by providing a{' '}
					<Code>targetReplacement</Code>, which we pass the necessary properties for positioning:
				</p>
				<p>
					<Code>width</Code>, <Code>height</Code>, <Code>top</Code>, and <Code>left</Code>.
				</p>
				<p>
					Import <Code>SpotlightPulse</Code> from this package, and wrap your replacement component
					to achieve the same purple &ldquo;pulse&rdquo; animation.
				</p>

				<p>
					<button type="button" onClick={this.show}>
						Show
					</button>
				</p>

				<SpotlightTransition>
					{active && (
						<Spotlight
							actions={[{ onClick: this.hide, text: 'Done' }]}
							dialogPlacement="bottom left"
							key="target-replacement-example"
							heading="Hey, neat!"
							target="target-replacement-example"
							targetReplacement={Replacement}
						>
							<Lorem count={1} />
						</Spotlight>
					)}
				</SpotlightTransition>
			</SpotlightManager>
		);
	}
}
