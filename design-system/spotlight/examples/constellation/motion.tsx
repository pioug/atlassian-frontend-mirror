/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import { FadeIn } from '@atlaskit/motion';
import { Flex, Text } from '@atlaskit/primitives/compiled';
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

export default () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const dismiss = () => setIsVisible(false);
	const done = () => setIsVisible(false);

	return (
		<Flex>
			<PopoverProvider>
				<PopoverTarget>
					<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
				</PopoverTarget>
				<PopoverContent done={done} dismiss={dismiss} placement="right-end" isVisible={isVisible}>
					<FadeIn entranceDirection="left">
						{(props) => (
							<div {...props}>
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
											<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
										</SpotlightActions>
									</SpotlightFooter>
								</SpotlightCard>
							</div>
						)}
					</FadeIn>
				</PopoverContent>
			</PopoverProvider>
		</Flex>
	);
};
