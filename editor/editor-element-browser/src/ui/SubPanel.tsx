import React from 'react';

import Heading from '@atlaskit/heading';
import { Inline, Stack, xcss } from '@atlaskit/primitives';

import { BackNavButton } from './NavigationButton';

const itemContainerStyles = xcss({
	paddingTop: 'space.100',
	paddingBottom: 'space.025',
	paddingLeft: 'space.100',
	paddingRight: 'space.100',
});

interface SubPanelWithBackButtonProps {
	label: string;
	buttonLabel: string;
	onClick: () => void;
	children: React.ReactNode;
}
export const SubPanelWithBackButton = ({
	label,
	buttonLabel,
	onClick,
	children,
}: SubPanelWithBackButtonProps) => {
	return (
		<Stack space="space.100">
			<Inline
				alignBlock="center"
				alignInline="start"
				space={'space.050'}
				xcss={itemContainerStyles}
			>
				<BackNavButton onClick={onClick} label={buttonLabel} />
				<Heading size={'xsmall'}>{label}</Heading>
			</Inline>
			{children}
		</Stack>
	);
};
