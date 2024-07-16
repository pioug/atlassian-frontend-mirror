import React from 'react';

import Image from '@atlaskit/image';
import Lozenge from '@atlaskit/lozenge';
import { Anchor, Box, xcss } from '@atlaskit/primitives';

import ButtonIcon from '../../images/button.png';

const anchorStyles = xcss({
	color: 'color.link',
	backgroundColor: 'elevation.surface',
	textDecoration: 'none',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderColor: 'color.border',
	borderRadius: '3px',
	display: 'inline-flex',
	alignItems: 'center',
	gap: 'space.100',
	paddingInline: 'space.050',
	paddingBlock: 'space.025',

	':hover': {
		backgroundColor: 'elevation.surface.hovered',
		textDecoration: 'none',
	},
	':active': {
		color: 'color.link.pressed',
		backgroundColor: 'elevation.surface.pressed',
	},
	':visited': {
		color: 'color.link.visited',
	},
	':visited:active': {
		color: 'color.link.visited.pressed',
	},
});

const iconContainerStyles = xcss({
	width: '16px',
	display: 'flex',
});

export default function Basic() {
	return (
		<Anchor
			href="https://www.atlassian.com/software/atlas"
			interactionName="atlas-link"
			xcss={anchorStyles}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Box xcss={iconContainerStyles}>
				<Image src={ButtonIcon} alt="" />
			</Box>
			Evolving Button: Open beta to GA
			<Lozenge appearance="success">On track</Lozenge>
		</Anchor>
	);
}
