/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { colorPalettes } from '@atlaskit/theme';

import { ColorPill, Heading } from './colors';

const firstHeadingStyles = css({
	marginBlockStart: 0,
});

export default () => {
	return (
		<div id="colors">
			<Heading css={firstHeadingStyles}>8 colors (base)</Heading>
			{colorPalettes.colorPalette('8').map((color, index) => (
				<ColorPill
					primary={color.background}
					secondary={color.text}
					name={`colorPalette('8')[${index}]`}
					key={index}
				/>
			))}

			<Heading>16 colors</Heading>
			{colorPalettes.colorPalette('16').map((color, index) => (
				<ColorPill
					primary={color.background}
					secondary={color.text}
					name={`colorPalette('16')[${index}]`}
					key={index}
				/>
			))}

			<Heading>24 colors</Heading>
			{colorPalettes.colorPalette('24').map((color, index) => (
				<ColorPill
					primary={color.background}
					secondary={color.text}
					name={`colorPalette('24')[${index}]`}
					key={index}
				/>
			))}
		</div>
	);
};
