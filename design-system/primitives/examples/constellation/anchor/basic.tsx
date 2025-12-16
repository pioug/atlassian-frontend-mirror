import React from 'react';

import { cssMap } from '@atlaskit/css';
import Image from '@atlaskit/image';
import Lozenge from '@atlaskit/lozenge';
import { Anchor, Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import ButtonIcon from '../../images/button.png';

const styles = cssMap({
	anchor: {
		color: token('color.link'),
		backgroundColor: token('elevation.surface'),
		textDecoration: 'none',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		display: 'inline-flex',
		alignItems: 'center',
		gap: token('space.100'),
		paddingInline: token('space.050'),
		paddingBlock: token('space.025'),

		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
			textDecoration: 'none',
		},
		'&:active': {
			color: token('color.link.pressed'),
			backgroundColor: token('elevation.surface.pressed'),
		},
		'&:visited': {
			color: token('color.link.visited'),
		},
	},
	iconContainer: {
		width: '16px',
		display: 'flex',
	},
});

export default function Basic(): React.JSX.Element {
	return (
		<Anchor
			href="https://www.atlassian.com/software/atlas"
			interactionName="atlas-link"
			xcss={styles.anchor}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Box xcss={styles.iconContainer}>
				<Image src={ButtonIcon} alt="" />
			</Box>
			Evolving Button: Open beta to GA
			<Lozenge appearance="success">On track</Lozenge>
		</Anchor>
	);
}
