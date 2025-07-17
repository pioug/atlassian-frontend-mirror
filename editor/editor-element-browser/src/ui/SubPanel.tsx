import React, { memo } from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack, xcss } from '@atlaskit/primitives';

import { BackNavButton } from './NavigationButton';

const itemContainerStyles = xcss({
	paddingTop: 'space.100',
	paddingBottom: 'space.025',
	paddingLeft: 'space.250',
	paddingRight: 'space.250',
});

interface SubPanelWithBackButtonProps {
	label: string;
	buttonLabel: string;
	onClick: () => void;
	children: React.ReactNode;
}
export const SubPanelWithBackButton = memo(
	({ label, buttonLabel, onClick, children }: SubPanelWithBackButtonProps) => {
		return (
			<Stack space="space.0">
				<Inline
					alignBlock="center"
					alignInline="start"
					space={'space.050'}
					xcss={itemContainerStyles}
				>
					<BackNavButton onClick={onClick} label={buttonLabel} />
					<Heading size={'xsmall'} as="span">
						{label}
					</Heading>
				</Inline>
				{children}
			</Stack>
		);
	},
);
