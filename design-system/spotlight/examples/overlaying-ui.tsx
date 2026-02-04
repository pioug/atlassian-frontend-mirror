/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
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
		height: '100vh',
		width: '100vw',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
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
});

export default (): JSX.Element => {
	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<Box xcss={styles.target}>
					<Text>These elements should not shift in the layout when the spotlight is shown</Text>
				</Box>

				<Spotlight placement="top-end">
					<Box xcss={styles.target}>
						<Text>Target element</Text>
					</Box>
				</Spotlight>

				<Spotlight placement="bottom-end">
					<Box xcss={styles.target}>
						<Text>Target element</Text>
					</Box>
				</Spotlight>

				<Box xcss={styles.target}>
					<Text>These elements should not shift in the layout when the spotlight is shown</Text>
				</Box>
			</div>
		</div>
	);
};

const Spotlight = ({ placement, children }: { placement: Placement; children: ReactNode }) => {
	const [isVisible, setIsVisible] = useState(true);
	const dismiss = () => setIsVisible(false);
	const done = () => setIsVisible(false);

	return (
		<PopoverProvider>
			<PopoverTarget>{children}</PopoverTarget>
			<PopoverContent dismiss={dismiss} placement={placement} isVisible={isVisible}>
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
	);
};
