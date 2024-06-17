/** @jsx jsx */
import { type ImgHTMLAttributes, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import {
	Spotlight,
	SpotlightManager,
	SpotlightPulse,
	SpotlightTarget,
	SpotlightTransition,
} from '../../src';
import logoInverted from '../assets/logo-inverted.png';
import logo from '../assets/logo.png';

const Replacement = (rect: any) => {
	const style = { overflow: 'hidden', ...rect };

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
});

const Image = ({ alt, src }: ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={src} alt={alt} css={imageStyles} />
);

const SpotlightTargetReplacementExample = () => {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const start = () => setIsSpotlightActive(true);
	const end = () => setIsSpotlightActive(false);
	return (
		<SpotlightManager>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<img alt="hidden" src={logoInverted} style={{ display: 'none' }} />

			<SpotlightTarget name="target-replacement-example">
				<Image alt="I will be replaced..." src={logo} />
			</SpotlightTarget>

			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.200', '16px') }}>
				<Button appearance="primary" onClick={() => start()}>
					Show example spotlight
				</Button>
			</div>

			<SpotlightTransition>
				{isSpotlightActive && (
					<Spotlight
						targetReplacement={Replacement}
						actions={[{ onClick: () => end(), text: 'OK' }]}
						dialogPlacement="bottom left"
						key="target-replacement-example"
						heading="Target replacement"
						target="target-replacement-example"
						targetRadius={3}
					>
						You can replace the original target with another component using the `targetReplacement`
						prop.
					</Spotlight>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
};

export default SpotlightTargetReplacementExample;
