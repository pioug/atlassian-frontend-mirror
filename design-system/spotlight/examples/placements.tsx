/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Image from '@atlaskit/image';
import { Box, Flex, Text } from '@atlaskit/primitives/compiled';
import {
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightMedia,
	SpotlightPrimaryAction,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

import ExampleImage from './assets/295x135.png';

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
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
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
	'bottom-center',
	'bottom-end',
	'left-start',
	'left-end',
	'top-start',
	'top-center',
	'top-end',
	'right-start',
	'right-end',
] as const;

export default () => {
	const [placement, setPlacement] = useState<(typeof cardPlacements)[number]>('bottom-start');
	const [isVisible, setIsVisible] = useState(true);
	const dismiss = () => setIsVisible(false);

	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<PopoverProvider>
					<PopoverTarget>
						<Box xcss={styles.target}>
							<Text>Target element</Text>
						</Box>
					</PopoverTarget>
					<PopoverContent dismiss={dismiss} placement={placement} isVisible={isVisible}>
						<SpotlightCard testId="spotlight">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightMedia>
								<Image src={ExampleImage} alt="placeholder" />
							</SpotlightMedia>
							<SpotlightBody>
								<Text>Brief and direct textual content to elaborate on the intent.</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightActions>
									<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
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
