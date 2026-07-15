/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightControls } from '@atlaskit/spotlight/controls';
import { SpotlightDismissControl } from '@atlaskit/spotlight/dismiss-control';
import { SpotlightFooter } from '@atlaskit/spotlight/footer';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { SpotlightMedia } from '@atlaskit/spotlight/media';
import { PopoverContent } from '@atlaskit/spotlight/popover-content';
import { PopoverProvider } from '@atlaskit/spotlight/popover-provider';
import { PopoverTarget } from '@atlaskit/spotlight/popover-target';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';
import { usePreloadMedia } from '@atlaskit/spotlight/use-preload-media';
import { token } from '@atlaskit/tokens';

import src from './assets/video.mp4';

const styles = cssMap({
	root: {
		display: 'flex',
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
	},
});

const Example = (): JSX.Element => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const dismiss = () => setIsVisible(false);
	const done = () => setIsVisible(false);

	// Preload the video on component mount
	usePreloadMedia(src, { mimetype: 'video/mp4' });

	return (
		<div css={styles.root}>
			<PopoverProvider>
				<PopoverTarget>
					<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
				</PopoverTarget>
				<PopoverContent dismiss={dismiss} isVisible={isVisible} placement="right-end">
					<SpotlightCard testId="spotlight">
						<SpotlightHeader>
							<SpotlightHeadline>Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightMedia>
							<video width={295} src={src} autoPlay={true} loop={true} />
						</SpotlightMedia>
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
		</div>
	);
};

export default Example;
