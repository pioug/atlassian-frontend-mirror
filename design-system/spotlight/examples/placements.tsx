/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Box, Flex, Text } from '@atlaskit/primitives/compiled';
import {
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
	Spotlight,
	SpotlightActions,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
} from '@atlaskit/spotlight';

const styles = cssMap({
	root: {
		height: '100vh',
		maxHeight: '100vh',
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		gap: 'var(--ds-space-1000)',
	},
	content: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	target: {
		padding: 'var(--ds-space-100)',
		borderStyle: 'solid',
		borderWidth: 'var(--ds-border-width)',
		borderColor: 'var(--ds-border-bold)',
	},
	controls: {
		paddingBlockEnd: 'var(--ds-space-200)',
	},
});

const cardPlacements = [
	'bottom-start',
	'bottom-end',
	'left-start',
	'left-end',
	'top-start',
	'top-end',
	'right-start',
	'right-end',
] as const;

export default () => {
	const [placement, setPlacement] = useState<(typeof cardPlacements)[number]>('bottom-start');

	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<PopoverProvider>
					<PopoverTarget>
						<Box xcss={styles.target}>
							<Text>Target element</Text>
						</Box>
					</PopoverTarget>
					<PopoverContent placement={placement}>
						<Spotlight testId="spotlight">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightFooter>
								<SpotlightActions>
									<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
								</SpotlightActions>
							</SpotlightFooter>
						</Spotlight>
					</PopoverContent>
				</PopoverProvider>
			</div>

			<Flex xcss={styles.controls} gap="space.100">
				<DropdownMenu trigger={`Placement: ${placement}`} shouldRenderToParent>
					<DropdownItemGroup>
						{cardPlacements.map((placement) => (
							<DropdownItem key={placement} onClick={() => setPlacement(placement)}>
								{placement}
							</DropdownItem>
						))}
					</DropdownItemGroup>
				</DropdownMenu>
			</Flex>
		</div>
	);
};
