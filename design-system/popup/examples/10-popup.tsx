/** @jsx jsx */
import { type FC, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { type Placement } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

const spacerStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	margin: '250px',
});

const sizedContentStyles = css({
	height: '80px',
	padding: token('space.400', '32px'),
	alignItems: 'center',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'center',
});

type PopupProps = {
	setPosition(): void;
	placement: string;
};

const PopupContent: FC<PopupProps> = ({ setPosition, placement }) => {
	return (
		<div id="popup-content" css={sizedContentStyles}>
			<Button testId="popup-position" onClick={() => setPosition()}>
				Toggle Position
			</Button>
			<p>
				Current placement: <strong>{placement}</strong>
			</p>
			<hr />
			<p>Scroll down.</p>
			<Button>Button 5</Button>
			<Button>Button 6</Button>
		</div>
	);
};

const placements: Placement[] = [
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

const PopupPlacementExample = () => {
	const [idx, setIdx] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	const placement = placements[idx];

	const setPlacement = () => {
		if (idx !== placements.length - 1) {
			setIdx(idx + 1);
		} else {
			setIdx(0);
		}
	};

	return (
		<div css={spacerStyles}>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent setPosition={setPlacement} placement={placement} />}
				trigger={(triggerProps) => (
					<Button id="popup-trigger" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement={placement}
			/>
		</div>
	);
};

export default PopupPlacementExample;
