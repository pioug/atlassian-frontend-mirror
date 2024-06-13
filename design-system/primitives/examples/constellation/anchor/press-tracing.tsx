import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { FlagsProvider, useFlags } from '@atlaskit/flag';
import Heading from '@atlaskit/heading';
import Info from '@atlaskit/icon/glyph/info';
import Image from '@atlaskit/image';
import InteractionContext from '@atlaskit/interaction-context';
import { Anchor, Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import ButtonIcon from '../../images/button.png';
import ThemesIcon from '../../images/themes.png';
import WatermelonIcon from '../../images/watermelon.png';

const anchorStyles = xcss({
	color: 'color.text',
	textDecoration: 'none',

	':hover': {
		color: 'color.text',
		textDecoration: 'underline',
	},
	':active': {
		textDecoration: 'none',
	},
	':visited': {
		color: 'color.link.visited',
	},
	':visited:active': {
		color: 'color.link.visited.pressed',
	},
});

const iconContainerStyles = xcss({
	width: '24px',
	display: 'flex',
});

type ProjectLinkProps = {
	href: string;
	children: string;
	icon: string;
	id: string;
};

const ProjectLink = ({ href, children, icon, id }: ProjectLinkProps) => {
	return (
		<Anchor href={href} xcss={anchorStyles} target="_blank" interactionName={`anchor-${id}`}>
			<Inline space="space.150" alignBlock="center">
				<Box xcss={iconContainerStyles}>
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
						icon: <Info label="Info" primaryColor={token('color.icon.information')} />,
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
					<ProjectLink href="/components/button/examples" icon={ButtonIcon} id="evolving-button">
						Evolving Button: Open beta to GA
					</ProjectLink>
					<ProjectLink
						href="/components/tokens/examples"
						icon={ThemesIcon}
						id="increased-contrast-themes"
					>
						Increased contrast themes
					</ProjectLink>
					<ProjectLink
						href="/components/primitives/text/examples"
						icon={WatermelonIcon}
						id="typography"
					>
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
