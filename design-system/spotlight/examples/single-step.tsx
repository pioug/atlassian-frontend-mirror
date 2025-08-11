/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
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

export default () => {
	const [isVisible, setIsVisible] = useState<boolean>(true);

	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<PopoverProvider>
					<PopoverTarget>
						<Box xcss={styles.target}>
							<Text>Target element</Text>
						</Box>
					</PopoverTarget>
					<PopoverContent placement="bottom-end" isVisible={isVisible}>
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
			</div>
			<div css={styles.controls}>
				<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
			</div>
		</div>
	);
};
