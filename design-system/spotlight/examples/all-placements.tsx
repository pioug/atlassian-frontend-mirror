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
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		display: 'grid',
		width: '500px',
		gridTemplateColumns: '1fr 1fr 1fr',
		gap: token('space.1000'),
	},
	target: {
		width: '100%',
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
	},
});

export default () => {
	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<Spotlight placement="top-start">
					<Box xcss={styles.target} />
				</Spotlight>

				<Spotlight placement="top-center">
					<Box xcss={styles.target} />
				</Spotlight>

				<Spotlight placement="top-end">
					<Box xcss={styles.target} />
				</Spotlight>

				<Spotlight placement="left-start">
					<Box xcss={styles.target} />
				</Spotlight>

				<div />

				<Spotlight placement="right-start">
					<Box xcss={styles.target} />
				</Spotlight>

				<Spotlight placement="left-end">
					<Box xcss={styles.target} />
				</Spotlight>

				<div />

				<Spotlight placement="right-end">
					<Box xcss={styles.target} />
				</Spotlight>

				<Spotlight placement="bottom-start">
					<Box xcss={styles.target} />
				</Spotlight>

				<Spotlight placement="bottom-center">
					<Box xcss={styles.target} />
				</Spotlight>

				<Spotlight placement="bottom-end">
					<Box xcss={styles.target} />
				</Spotlight>
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
	);
};
