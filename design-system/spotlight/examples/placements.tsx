/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Box, Text } from '@atlaskit/primitives/compiled';
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
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		gap: 'var(--ds-space-1000)',
	},
	featureContainer: {
		padding: 'var(--ds-space-1000)',
		borderStyle: 'solid',
		borderWidth: 'var(--ds-border-width)',
		borderColor: 'var(--ds-border)',
	},
});

const placements = [
	'top-start',
	'top-end',
	'bottom-start',
	'bottom-end',
	'right-start',
	'right-end',
	'left-start',
	'left-end',
] as const;

export default () => {
	const [placement, setPlacement] = useState<any>('right-start');

	return (
		<div css={styles.root}>
			<PopoverProvider>
				<PopoverTarget>
					<Box xcss={styles.featureContainer}>
						<Text>{placement}</Text>
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

			<DropdownMenu trigger="Placements" shouldRenderToParent>
				<DropdownItemGroup>
					{placements.map((placement) => (
						<DropdownItem
							key={placement}
							onClick={() => {
								setPlacement(placement);
							}}
						>
							{placement}
						</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>
		</div>
	);
};
