/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Text } from '@atlaskit/primitives/compiled';
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
	SpotlightPrimaryAction,
	SpotlightShowMoreControl,
} from '@atlaskit/spotlight';

const Example = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	return (
		<div>
			<PopoverProvider>
				<PopoverTarget>
					<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
				</PopoverTarget>
				<PopoverContent placement="bottom-end" isVisible={isVisible}>
					<SpotlightCard testId="spotlight">
						<SpotlightHeader>
							<SpotlightHeadline>Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl onClick={() => setIsVisible(false)} />
								<DropdownMenu<HTMLButtonElement>
									trigger={({ triggerRef, onClick }) => (
										<SpotlightShowMoreControl ref={triggerRef} onClick={onClick} />
									)}
									shouldRenderToParent={false}
								>
									<DropdownItemGroup>
										<DropdownItem>Not interested</DropdownItem>
										<DropdownItem>Why am I seeing this?</DropdownItem>
									</DropdownItemGroup>
								</DropdownMenu>
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
		</div>
	);
};

export default Example;
