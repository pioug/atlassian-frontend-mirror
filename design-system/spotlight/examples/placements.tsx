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
	SpotlightBody,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		height: '100vh',
		maxHeight: '100vh',
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
	},
	content: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	target: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
	},
	controls: {
		paddingBlockEnd: token('space.200'),
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
							<SpotlightBody>
								<Text>Brief and direct textual content to elaborate on the intent.</Text>
							</SpotlightBody>
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
