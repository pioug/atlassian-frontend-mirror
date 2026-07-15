/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Text } from '@atlaskit/primitives/compiled';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightControls } from '@atlaskit/spotlight/controls';
import { SpotlightDismissControl } from '@atlaskit/spotlight/dismiss-control';
import { SpotlightFooter } from '@atlaskit/spotlight/footer';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { PopoverContent } from '@atlaskit/spotlight/popover-content';
import { PopoverProvider } from '@atlaskit/spotlight/popover-provider';
import { PopoverTarget } from '@atlaskit/spotlight/popover-target';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';
import type { Placement } from '@atlaskit/spotlight/types';
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

const Example = (): JSX.Element => {
	const [placement, setPlacement] = useState<(typeof cardPlacements)[number]>('top-end');
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const dismiss = () => setIsVisible(false);
	const done = () => setIsVisible(false);

	return (
		<div css={styles.root}>
			<PopoverProvider>
				<PopoverTarget>
					<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
				</PopoverTarget>
				<PopoverContent dismiss={dismiss} isVisible={isVisible} placement={placement}>
					<SpotlightCard testId="spotlight">
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
								<SpotlightPrimaryAction onClick={done}>Done</SpotlightPrimaryAction>
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
