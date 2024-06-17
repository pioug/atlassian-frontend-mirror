/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import color from 'color';

import { token } from '@atlaskit/tokens';

import { colors, type ThemedValue } from '../src';

const emptyColor = (): {
	name: string;
	value: string | ThemedValue<string>;
}[] => [];

const colorGroups = Object.entries(colors).reduce(
	(acc, [name, value]) => {
		const data = { name, value };
		let group = acc.named;

		if (name.startsWith('R')) {
			group = acc.reds;
		} else if (name.startsWith('Y')) {
			group = acc.yellows;
		} else if (name.startsWith('G')) {
			group = acc.greens;
		} else if (name.startsWith('B')) {
			group = acc.blues;
		} else if (name.startsWith('P')) {
			group = acc.purples;
		} else if (name.startsWith('T')) {
			group = acc.teals;
		} else if (name.startsWith('N')) {
			group = acc.neutrals;
		} else if (name.startsWith('DN')) {
			group = acc.darkModeNeutrals;
		}

		group.push(data);

		return acc;
	},
	{
		reds: emptyColor(),
		yellows: emptyColor(),
		greens: emptyColor(),
		blues: emptyColor(),
		purples: emptyColor(),
		teals: emptyColor(),
		neutrals: emptyColor(),
		darkModeNeutrals: emptyColor(),
		named: emptyColor(),
	},
);

const colorPillStyles = css({
	display: 'inline-block',
	width: 'calc(33% - 20px)',
	padding: token('space.100', '8px'),
	borderRadius: token('border.radius', '3px'),
	fontSize: '12px',
	fontWeight: 600,
	marginBlockEnd: token('space.050', '4px'),
	marginInlineEnd: token('space.050', '4px'),
});

export const ColorPill = ({
	primary,
	secondary,
	name,
}: {
	primary: string;
	secondary: string;
	name: string;
}) => (
	<span
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: secondary,
			backgroundColor: primary,
		}}
		data-testid="color-pill"
		css={colorPillStyles}
	>
		{name}
	</span>
);

const separateWords = (str: string) => {
	return str.replace(/([A-z][A-Z])/g, (e) => {
		return e.split('').join(' ');
	});
};

const headingStyles = css({
	marginBlockEnd: token('space.050', '4px'),
	marginBlockStart: token('space.200', '16px'),
});

const firstHeadingStyles = css({
	marginBlockStart: 0,
});

type HeadingProps = {
	className?: string;
	children: ReactNode;
};

export const Heading: FC<HeadingProps> = ({ children, className }) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<h6 className={className} css={headingStyles}>
		{children}
	</h6>
);

export default () => (
	<div id="colors">
		{Object.entries(colorGroups).map(([groupName, groupColors], index) => (
			<div key={groupName}>
				<Heading css={index === 0 && firstHeadingStyles}>{separateWords(groupName)}</Heading>
				<div data-testid="color-palette">
					{groupColors.map((colorData) => {
						const actualColor =
							typeof colorData.value === 'string' ? colorData.value : colorData.value();

						// format "var(--ds-background-default, #FFFFFF)" to "#FFFFFF" as color() function only accept a color value
						const formattedColor = actualColor.startsWith('var')
							? actualColor.split(/, (.+)/)[1].slice(0, -1)
							: actualColor;

						const secondaryColor = color(formattedColor).isLight() ? colors.N800 : colors.N10;

						return (
							<ColorPill
								key={colorData.name}
								name={colorData.name}
								primary={actualColor}
								secondary={secondaryColor}
							/>
						);
					})}
				</div>
			</div>
		))}
	</div>
);
