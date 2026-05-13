/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
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
	SpotlightPrimaryLink,
	SpotlightSecondaryAction,
	SpotlightSecondaryLink,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		height: '100vh',
		width: '100vw',
	},
	controls: {
		marginBlockEnd: token('space.200'),
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

type SpotlightPrimaryAppearance = 'outline' | 'primary';

export default (): JSX.Element => {
	const [appearance, setAppearance] = useState<SpotlightPrimaryAppearance>('primary');

	return (
		<Flex xcss={styles.root} justifyContent="center" alignItems="center" direction="column">
			<Flex xcss={styles.controls} gap="space.100">
				<Button
					appearance={appearance === 'outline' ? 'primary' : 'subtle'}
					onClick={() => setAppearance('outline')}
				>
					Use outline
				</Button>
				<Button
					appearance={appearance === 'primary' ? 'primary' : 'subtle'}
					onClick={() => setAppearance('primary')}
				>
					Use primary
				</Button>
			</Flex>
			<Flex gap='space.200'>
				<PopoverProvider>
					<PopoverTarget>
						<div css={styles.target}>
							<Text>Target</Text>
						</div>
					</PopoverTarget>
					<PopoverContent isVisible={true} placement="left-end" dismiss={() => { }}>
						<SpotlightCard>
							<SpotlightHeader>
								<SpotlightHeadline>Buttons</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>
									Toggle between `outline` and `primary` to preview how the call to action
									changes emphasis.
								</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightActions>
									<SpotlightSecondaryAction>Back</SpotlightSecondaryAction>
									<SpotlightPrimaryAction appearance={appearance}>
										Done
									</SpotlightPrimaryAction>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>
				<PopoverProvider>
					<PopoverTarget>
						<div css={styles.target}>
							<Text>Target</Text>
						</div>
					</PopoverTarget>
					<PopoverContent isVisible={true} placement="right-end" dismiss={() => { }}>
						<SpotlightCard>
							<SpotlightHeader>
								<SpotlightHeadline>Links</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>
									Toggle between `outline` and `primary` to preview how the call to action
									changes emphasis.
								</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightActions>
									<SpotlightSecondaryLink href='#'>Back</SpotlightSecondaryLink>
									<SpotlightPrimaryLink href='#' appearance={appearance}>
										Done
									</SpotlightPrimaryLink>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>
			</Flex>
		</Flex>
	);
};
