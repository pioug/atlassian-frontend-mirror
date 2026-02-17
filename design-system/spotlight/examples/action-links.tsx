/**
 * @jsxRuntime classic
 * @jsx jsx
 *
 * Example demonstrating SpotlightPrimaryLink and SpotlightSecondaryLink.
 * Use these when the primary or secondary control should navigate to a URL
 * instead of performing an action (e.g. "Get started", "Learn more").
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
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
	SpotlightPrimaryLink,
	SpotlightSecondaryLink,
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

export default (): JSX.Element => {
	const [isVisible, setIsVisible] = useState<boolean>(true);
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
					<PopoverContent dismiss={dismiss} placement="bottom-end" isVisible={isVisible}>
						<SpotlightCard testId="spotlight">
							<SpotlightHeader>
								<SpotlightHeadline>Try the new experience</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>
									When your primary or secondary control should navigate to a URL
									instead of performing an action, use SpotlightPrimaryLink and
									SpotlightSecondaryLink.
								</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightActions>
									<SpotlightSecondaryLink
										href="https://atlassian.design/components/spotlight"
										target="_blank"
										rel="noopener noreferrer"
									>
										Learn more
									</SpotlightSecondaryLink>
									<SpotlightPrimaryLink
										href="https://atlassian.design"
										target="_blank"
										rel="noopener noreferrer"
									>
										Get started
									</SpotlightPrimaryLink>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>
			</div>
			<div css={styles.controls}>
				<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
			</div>
		</div>
	);
};
