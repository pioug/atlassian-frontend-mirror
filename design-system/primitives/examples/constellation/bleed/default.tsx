import React from 'react';

import PersonIcon from '@atlaskit/icon/core/migration/person';
import { Bleed, Inline, Pressable, Stack, xcss } from '@atlaskit/primitives';

const buttonStyles = xcss({
	padding: 'space.0',
	color: 'color.text.inverse',
	borderRadius: '9999px',
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
					<Pressable key={key} xcss={buttonStyles} backgroundColor="color.background.neutral.bold">
						<PersonIcon label="An avatar" LEGACY_size="medium" spacing="spacious" />
					</Pressable>
				))}
			</Inline>
			<Inline xcss={nudgeStyles}>
				{['first', 'second', 'third', 'fourth'].map((key) => (
					<Bleed inline="space.050" key={key}>
						<Pressable xcss={buttonStyles} backgroundColor="color.background.neutral.bold">
							<PersonIcon label="An avatar" LEGACY_size="medium" spacing="spacious" />
						</Pressable>
					</Bleed>
				))}
			</Inline>
		</Stack>
	);
}
