import React from 'react';

import { cssMap } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import { FlagsProvider } from '@atlaskit/flag/flags-provider';
import { useFlags } from '@atlaskit/flag/use-flags';
import Heading from '@atlaskit/heading/heading';
import InformationIcon from '@atlaskit/icon/core/status-information';
import Image from '@atlaskit/image';
import InteractionContext from '@atlaskit/interaction-context';
import { Anchor } from '@atlaskit/primitives/compiled/anchor';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

import ButtonIcon from '../../images/button.png';
import ThemesIcon from '../../images/themes.png';
import WatermelonIcon from '../../images/watermelon.png';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

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
							<Flex xcss={iconSpacingStyles.space050}>
								<InformationIcon label="Info" color={token('color.icon.information')} />
							</Flex>
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

export default function PressTracing(): React.JSX.Element {
	return (
		<FlagsProvider>
			<Projects />
		</FlagsProvider>
	);
}
