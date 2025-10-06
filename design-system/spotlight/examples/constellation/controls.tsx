/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
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
} from '@atlaskit/spotlight';

const Example = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const dismiss = () => setIsVisible(false);

	return (
		<div>
			<PopoverProvider>
				<PopoverTarget>
					<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
				</PopoverTarget>
				<PopoverContent dismiss={dismiss} placement="bottom-end" isVisible={isVisible}>
					<SpotlightCard testId="spotlight">
						<SpotlightHeader>
							<SpotlightHeadline>Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl onClick={dismiss} />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightBody>
							<Text>Brief and direct textual content to elaborate on the intent.</Text>
						</SpotlightBody>
						<SpotlightFooter>
							<SpotlightActions>
								<SpotlightPrimaryAction onClick={dismiss}>Done</SpotlightPrimaryAction>
							</SpotlightActions>
						</SpotlightFooter>
					</SpotlightCard>
				</PopoverContent>
			</PopoverProvider>
		</div>
	);
};

export default Example;
