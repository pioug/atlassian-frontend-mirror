/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useEffect, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
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
	UNSAFE_UpdateOnChange,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		height: '150vh',
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
});

export default () => {
	return (
		<div css={styles.root}>
			<div id="reflow-test-1">
				<AsyncLoadedContent timeout={500} />
			</div>
			<div id="reflow-test-2">
				<AsyncLoadedContent timeout={1000} />
			</div>
			<div css={styles.content}>
				<PopoverProvider>
					{/* eslint-disable-next-line react/jsx-pascal-case */}
					<UNSAFE_UpdateOnChange selectors={['#reflow-test-1', '#reflow-test-2']} />
					<PopoverTarget>
						<Box xcss={styles.target}>
							<Text>Target element</Text>
						</Box>
					</PopoverTarget>
					<PopoverContent placement="right-end" isVisible={true}>
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
					</PopoverContent>
				</PopoverProvider>
			</div>
		</div>
	);
};

export const AsyncLoadedContent = forwardRef<HTMLDivElement, { timeout: number }>(
	({ timeout }, ref) => {
		const [isLoading, setIsLoading] = useState(true);

		useEffect(() => {
			setTimeout(() => {
				setIsLoading(false);
			}, timeout);
		});

		if (isLoading) {
			return <div ref={ref}>Loading</div>;
		}

		return (
			<Stack ref={ref}>
				<div>Multi</div>
				<div>line</div>
				<div>content</div>
				<div>that</div>
				<div>shows</div>
				<div>Spotlight</div>
				<div>reflow</div>
				<div>behaviour</div>
			</Stack>
		);
	},
);
