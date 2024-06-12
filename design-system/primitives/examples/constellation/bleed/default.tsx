import React from 'react';

import PersonIcon from '@atlaskit/icon/glyph/person';
import { Bleed, Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
	padding: 'space.0',
	color: 'color.text.inverse',
	borderRadius: 'border.radius.circle',
	borderWidth: 'border.width.outline',
	borderColor: 'color.border.bold',
	borderStyle: 'solid',
	fontSize: '1.5rem',
	lineHeight: '1.5rem',
	':hover': {
		position: 'relative',
		backgroundColor: 'color.background.neutral.bold.hovered',
	},
});

const nudgeStyles = xcss({
	paddingInlineStart: 'space.050',
});

export default function Basic() {
	return (
		<Stack space="space.100">
			<Inline>
				{['first', 'second', 'third', 'fourth'].map((key) => (
					<Box
						key={key}
						as="button"
						xcss={boxStyles}
						backgroundColor="color.background.neutral.bold"
					>
						<PersonIcon label="An avatar" size="medium" />
					</Box>
				))}
			</Inline>
			<Inline xcss={nudgeStyles}>
				{['first', 'second', 'third', 'fourth'].map((key) => (
					<Bleed inline="space.050" key={key}>
						<Box as="button" xcss={boxStyles} backgroundColor="color.background.neutral.bold">
							<PersonIcon label="An avatar" size="medium" />
						</Box>
					</Bleed>
				))}
			</Inline>
		</Stack>
	);
}
