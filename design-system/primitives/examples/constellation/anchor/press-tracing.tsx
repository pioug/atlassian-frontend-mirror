import React from 'react';

import { cssMap } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import { FlagsProvider, useFlags } from '@atlaskit/flag';
import Heading from '@atlaskit/heading';
import InformationIcon from '@atlaskit/icon/core/migration/information--info';
import Image from '@atlaskit/image';
import InteractionContext from '@atlaskit/interaction-context';
import { Anchor, Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import ButtonIcon from '../../images/button.png';
import ThemesIcon from '../../images/themes.png';
import WatermelonIcon from '../../images/watermelon.png';

const styles = cssMap({
	anchor: {
		color: token('color.text'),
		textDecoration: 'none',

		'&:hover': {
			color: token('color.text'),
			textDecoration: 'underline',
		},
		'&:active': {
			textDecoration: 'none',
		},
		'&:visited': {
			color: token('color.link.visited'),
		},
	},
	iconContainer: {
		width: '24px',
		display: 'flex',
	},
});

type ProjectLinkProps = {
	children: string;
	icon: string;
	id: string;
};

const ProjectLink = ({ children, icon, id }: ProjectLinkProps) => {
	return (
		<Anchor href="#" xcss={styles.anchor} interactionName={`anchor-${id}`}>
			<Inline space="space.150" alignBlock="center">
				<Box xcss={styles.iconContainer}>
					<Image src={icon} alt="" />
				</Box>
				{children}
			</Inline>
		</Anchor>
	);
};

const Projects = () => {
	const { showFlag } = useFlags();

	return (
		<InteractionContext.Provider
			value={{
				hold: __noop,
				tracePress: (name) => {
					console.log('Traced a press!', name);
					showFlag({
						title: `Traced a press!`,
						description: name,
						icon: (
							<InformationIcon
								label="Info"
								LEGACY_primaryColor={token('color.icon.information')}
								color={token('color.icon.information')}
								spacing="spacious"
							/>
						),
						isAutoDismiss: true,
					});
				},
			}}
		>
			<Stack space="space.200">
				<Heading as="h2" size="small">
					Your projects
				</Heading>
				<Stack space="space.100">
					<ProjectLink icon={ButtonIcon} id="evolving-button">
						Evolving Button: Open beta to GA
					</ProjectLink>
					<ProjectLink icon={ThemesIcon} id="increased-contrast-themes">
						Increased contrast themes
					</ProjectLink>
					<ProjectLink icon={WatermelonIcon} id="typography">
						ADS Typography
					</ProjectLink>
				</Stack>
			</Stack>
		</InteractionContext.Provider>
	);
};

export default function PressTracing() {
	return (
		<FlagsProvider>
			<Projects />
		</FlagsProvider>
	);
}
