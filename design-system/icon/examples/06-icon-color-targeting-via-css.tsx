import React, { useState } from 'react';
import * as colors from '@atlaskit/theme/colors';
import HomeCircleIcon from '../glyph/home-circle';
import { Label } from '@atlaskit/form';
import Toggle from '@atlaskit/toggle';

const purple = '.purple { color: rebeccapurple; fill: yellow; }';
const blue = `.blue { color: ${colors.B500}; fill: ${colors.B75}; }`;
const rainbowBase = `.rainbow-base { color: ${colors.G300}; }`;
const rainbow = `
.rainbow {
  animation: 10s ease-in 1s infinite both rainbow;
}
@keyframes rainbow {
  0%   { color: ${colors.G300}; }
  20%  { color: ${colors.R300}; }
  40%  { color: ${colors.Y300}; }
  60%  { color: ${colors.G300}; }
  80%  { color: ${colors.B500}; }
  100% { color: ${colors.P300}; }
}`;
const styles = (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766
	<style>
		{purple}
		{blue}
		{rainbowBase}
		{rainbow}
	</style>
);

export default () => {
	const [isAnimating, setIsAnimating] = useState(false);

	return (
		<div>
			{styles}
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<span className="purple">
				<HomeCircleIcon secondaryColor="inherit" size="xlarge" label="" />
			</span>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<span className="blue">
				<HomeCircleIcon secondaryColor="inherit" size="xlarge" label="" />
			</span>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<span className={`rainbow-base ${isAnimating ? 'rainbow' : ''}`}>
				<HomeCircleIcon size="xlarge" label="" />
			</span>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'grid' }}>
				<Label htmlFor="animating">Animate last icon</Label>
				<Toggle
					id="animating"
					isChecked={isAnimating}
					onChange={(e) => (e.target.checked ? setIsAnimating(true) : setIsAnimating(false))}
				/>
			</div>
		</div>
	);
};
