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
	type Placement,
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

const cardPlacements: Placement[] = [
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

const Example = () => {
	const [placement, setPlacement] = useState<(typeof cardPlacements)[number]>('top-end');
	const [isVisible, setIsVisible] = useState<boolean>(false);

	return (
		<div css={styles.root}>
			<PopoverProvider>
				<PopoverTarget>
					<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
				</PopoverTarget>
				<PopoverContent isVisible={isVisible} placement={placement}>
					<SpotlightCard testId="spotlight">
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
					</SpotlightCard>
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
