/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Image from '@atlaskit/image';
import { Text } from '@atlaskit/primitives/compiled';
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
	SpotlightMedia,
	SpotlightPrimaryAction,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

import ExampleImage from '../assets/295x135.png';

const styles = cssMap({
	root: {
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
		height: '100%',
	},
});

const Example = () => (
	<div css={styles.root}>
		<PopoverProvider>
			<PopoverTarget>
				<Button>Target</Button>
			</PopoverTarget>
			<PopoverContent placement="right-end">
				<Spotlight testId="spotlight">
					<SpotlightHeader>
						<SpotlightHeadline>Headline</SpotlightHeadline>
						<SpotlightControls>
							<SpotlightDismissControl />
						</SpotlightControls>
					</SpotlightHeader>
					<SpotlightMedia>
						<Image src={ExampleImage} alt="placeholder" />
					</SpotlightMedia>
					<SpotlightBody>
						<Text>Brief and direct textual content to elaborate on the intent.</Text>
					</SpotlightBody>
					<SpotlightFooter>
						<SpotlightActions>
							<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</Spotlight>
			</PopoverContent>
		</PopoverProvider>
	</div>
);

export default Example;
