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
		height: '80vh',
		width: '100vw',
		display: 'flex',
		justifyContent: 'center',
		paddingBlockStart: token('space.500'),
		paddingInlineEnd: token('space.500'),
		paddingBlockEnd: token('space.500'),
		paddingInlineStart: token('space.500'),
	},
	content: {
		display: 'grid',
		maxWidth: 'fit-content',
		gap: token('space.200'),
		gridTemplateColumns: '1fr 1fr',
	},
	target: {
		borderRadius: token('radius.medium'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		borderStyle: 'solid',
		height: '100%',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
	},
});

export default () => {
	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<Spotlight placement="bottom-end">
					<Box xcss={styles.target}>
						<Text>Target element</Text>
					</Box>
				</Spotlight>

				<Box xcss={styles.target}>
					<Text>These elements should not shift in the layout when the spotlight is shown</Text>
				</Box>

				<Box xcss={styles.target}>
					<Text>These elements should not shift in the layout when the spotlight is shown</Text>
				</Box>

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
