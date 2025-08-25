/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Text } from '@atlaskit/primitives/compiled';
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
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'column',
		gap: token('space.200'),
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

const Example = () => {
	const [placement, setPlacement] = useState<(typeof cardPlacements)[number]>('top-end');
	const [isVisible, setIsVisible] = useState<boolean>(true);

	return (
		<div css={styles.root}>
			<PopoverProvider>
				<PopoverTarget>
					<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
				</PopoverTarget>
				<PopoverContent isVisible={isVisible} placement={placement}>
					<Spotlight testId="spotlight">
						<SpotlightHeader>
							<SpotlightHeadline>Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl onClick={() => setIsVisible(false)} />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightBody>
							<Text>Brief and direct textual content to elaborate on the intent.</Text>
						</SpotlightBody>
						<SpotlightFooter>
							<SpotlightActions>
								<SpotlightPrimaryAction onClick={() => setIsVisible(false)}>
									Done
								</SpotlightPrimaryAction>
							</SpotlightActions>
						</SpotlightFooter>
					</Spotlight>
				</PopoverContent>
			</PopoverProvider>

			<DropdownMenu trigger={`Placement: ${placement}`} shouldRenderToParent>
				<DropdownItemGroup>
					{cardPlacements.map((placement) => (
						<DropdownItem key={placement} onClick={() => setPlacement(placement)}>
							{placement}
						</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>
		</div>
	);
};

export default Example;
