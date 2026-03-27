/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useState } from 'react';

import Blanket from '@atlaskit/blanket';
import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Image from '@atlaskit/image';
import { Text } from '@atlaskit/primitives/compiled';
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
} from '@atlaskit/spotlight';

import src from './assets/600x400.png';

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
	media: {},
});

export default (): JSX.Element => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const dismiss = () => {
		setIsVisible(false);
		setIsBlanketVisible(false);
	};
	const done = () => {
		setIsVisible(false);
		setIsBlanketVisible(false);
	};
	const [isBlanketVisible, setIsBlanketVisible] = useState(false);
	const [shouldAllowClickThrough, setShouldAllowClickThrough] = useState(true);

	const showBlanketClick = useCallback(() => {
		setIsBlanketVisible(true);
		setShouldAllowClickThrough(false);
	}, []);

	const onBlanketClicked = useCallback(() => {
		setIsBlanketVisible(false);
		setShouldAllowClickThrough(true);
	}, []);

	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<Blanket
					onBlanketClicked={onBlanketClicked}
					isTinted={isBlanketVisible}
					shouldAllowClickThrough={shouldAllowClickThrough}
					testId="basic-blanket"
				/>
				<PopoverProvider>
					<PopoverTarget>
						<Button
							onClick={() => {
								setIsVisible(true);
								showBlanketClick();
							}}
						>
							Show Spotlight
						</Button>
					</PopoverTarget>
					<PopoverContent done={done} dismiss={dismiss} placement="right-end" isVisible={isVisible}>
						<SpotlightCard>
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<CustomMediaContainer>
								<Image src={src} alt="placeholder" />
							</CustomMediaContainer>
							<SpotlightBody>
								<Text>Brief and direct textual content to elaborate on the intent.</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightActions>
									<Button appearance="primary" spacing="compact" onClick={done}>
										Done
									</Button>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>
			</div>
		</div>
	);
};

const CustomMediaContainer = ({ children }: { children: ReactNode }) => {
	return <div css={styles.media}>{children}</div>;
};
