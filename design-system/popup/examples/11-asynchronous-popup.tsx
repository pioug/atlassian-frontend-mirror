/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { type Placement } from '@atlaskit/popper';
import Popup from '@atlaskit/popup';
import { Box, Text } from '@atlaskit/primitives';
import VisuallyHidden from '@atlaskit/visually-hidden';

type PopupProps = {
	isLoading: boolean;
	setPosition(): void;
	position: string;
	update?(): void;
	updateButtonWidth(newWidth: number): void;
	buttonWidth: number;
	updateA11YMessage(message: string): void;
};

type AnnouncerMessageCase = 'positionUpdate' | 'buttonResize' | 'buttonReset';
type AnnouncerMessageInfo = {
	type: AnnouncerMessageCase;
	value?: string | number;
};

const containerStyles = css({
	margin: '250px',
});

const loadingStyles = css({
	padding: '30px',
	textAlign: 'center',
});

const contentStyles = css({
	maxWidth: '300px',
	padding: '30px',
	alignItems: 'center',
	textAlign: 'center',
	verticalAlign: 'center',
});

const expanderStyles = css({
	display: 'inline-block',
});

const getA11YMessage = ({ type, value }: AnnouncerMessageInfo) => {
	const messages = {
		positionUpdate: `Current popup position: ${value}`,
		buttonResize: `The trigger button width was expanded. Additional width: ${value}`,
		buttonReset: `The trigger button width was reset. Additional width: ${value}`,
	};
	const message = type in messages ? messages[type] : '';
	return message;
};

const PopupContent: FC<PopupProps> = ({
	isLoading,
	setPosition,
	position,
	updateButtonWidth,
	updateA11YMessage,
	buttonWidth,
	update,
}) => {
	const [content, setContent] = useState(
		'Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. ',
	);
	const addContent = () => {
		setContent(`${content}Lorem Ipsum dolor sit amet. `);
		// Reposition the popup
		typeof update === 'function' && update();
	};

	const clearContent = () => {
		setContent('');
		// Reposition the popup
		typeof update === 'function' && update();
	};

	return isLoading ? (
		<div id="spinner" css={loadingStyles}>
			Loading...
		</div>
	) : (
		<div id="popup-content" css={contentStyles}>
			<Button
				onClick={() => {
					setPosition();
				}}
			>
				Toggle Position
			</Button>
			<Text as="p">
				Current position: <Text as="strong">{position}</Text>
			</Text>
			<hr role="presentation" />
			<Button
				onClick={() => {
					updateButtonWidth(buttonWidth + 15);
				}}
			>
				Expand Button
			</Button>
			<Button
				onClick={() => {
					updateButtonWidth(0);
				}}
			>
				Reset Button
			</Button>
			<hr role="presentation" />
			<Button onClick={addContent}>Add Content</Button>
			<Button onClick={clearContent}>Clear Content</Button>
			<br />
			{content}
		</div>
	);
};

const positions: Placement[] = [
	'bottom-start',
	'bottom',
	'bottom-end',
	'top-start',
	'top',
	'top-end',
	'right-start',
	'right',
	'right-end',
	'left-start',
	'left',
	'left-end',
	'auto-start',
	'auto',
	'auto-end',
];

export default () => {
	const [idx, setIdx] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [buttonWidth, setButtonWidth] = useState(0);
	const [isLoaded, setIsLoaded] = useState(false);
	const [a11yMessage, setA11YMessage] = useState('');
	useEffect(() => {
		if (isOpen) {
			window.setTimeout(() => setIsLoaded(true), 600);
		} else {
			setIsLoaded(false);
		}
	}, [isOpen]);
	const position = positions[idx];

	const updateA11YMessage = (message: string) => {
		let updatedMessage = message;
		if (message === a11yMessage) {
			// replacing regular space by NO-BREAK SPACE to trigger screen reader announce
			updatedMessage = a11yMessage.includes('\u00a0')
				? a11yMessage.replace(/\u00a0/, ' ')
				: a11yMessage.replace(/ /, '\u00a0');
		}
		setA11YMessage(updatedMessage);
	};

	const setPosition = () => {
		const nextPositionIdx = idx !== positions.length - 1 ? idx + 1 : 0;
		setIdx(nextPositionIdx);
		updateA11YMessage(
			getA11YMessage({ type: 'positionUpdate', value: positions[nextPositionIdx] }),
		);
	};

	const updateButtonWidth = (newWidth: number) => {
		setButtonWidth(newWidth);
		const type = newWidth === 0 ? 'buttonReset' : 'buttonResize';
		updateA11YMessage(getA11YMessage({ type, value: newWidth }));
	};

	return (
		<div css={containerStyles}>
			<VisuallyHidden>
				<Box aria-live="polite" aria-atomic="true" aria-relevant="all">
					{a11yMessage}
				</Box>
			</VisuallyHidden>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				offset={[0, 20]}
				content={({ update }) => (
					<PopupContent
						isLoading={!isLoaded}
						setPosition={setPosition}
						position={position}
						updateButtonWidth={updateButtonWidth}
						buttonWidth={buttonWidth}
						update={update}
						updateA11YMessage={updateA11YMessage}
					/>
				)}
				trigger={(triggerProps) => (
					<Button id="popup-trigger" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup{' '}
						<div style={{ width: buttonWidth ? `${buttonWidth}px` : 0 }} css={expanderStyles} />
					</Button>
				)}
				placement={position}
			/>
		</div>
	);
};
