/**
 * @jsxRuntime classic
 * @jsx jsx
 */
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
	SpotlightSecondaryLink,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
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

export default (): JSX.Element => (
	<Flex>
		<PopoverProvider>
			<PopoverTarget>
				<div css={styles.target}>
					<Text>Target</Text>
				</div>
			</PopoverTarget>
			<PopoverContent isVisible={true} placement="right-end" dismiss={() => {}}>
				<SpotlightCard>
					<SpotlightHeader>
						<SpotlightHeadline>Try the new experience</SpotlightHeadline>
						<SpotlightControls>
							<SpotlightDismissControl />
						</SpotlightControls>
					</SpotlightHeader>
					<SpotlightBody>
						<Text>
							When your primary or secondary control should navigate to a URL instead of performing
							an action, use SpotlightPrimaryLink and SpotlightSecondaryLink.
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
							<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</SpotlightCard>
			</PopoverContent>
		</PopoverProvider>
	</Flex>
);
