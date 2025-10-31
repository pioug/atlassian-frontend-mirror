/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { FadeIn } from '@atlaskit/motion';
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
});

export default () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const dismiss = () => setIsVisible(false);
	const done = () => setIsVisible(false);

	return (
		<div css={styles.root}>
			<div css={styles.content}>
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
			</div>
		</div>
	);
};
