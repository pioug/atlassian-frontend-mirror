/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, Fragment, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/new';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import Link from '@atlaskit/link';
import { type Placement } from '@atlaskit/popper';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

const spacerStyles = css({
	margin: '250px',
});

const sizedContentStyles = css({
	height: '80px',
	alignItems: 'center',
	overflow: 'auto',
	paddingBlockEnd: token('space.400'),
	paddingBlockStart: token('space.400'),
	paddingInlineEnd: token('space.400'),
	paddingInlineStart: token('space.400'),
	textAlign: 'center',
	verticalAlign: 'center',
});

const textWrapperStyles = css({
	marginBlockStart: token('space.150'),
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
			<div aria-live="polite" aria-atomic="true" css={textWrapperStyles}>
				<p>
					Current placement: <strong>{placement}</strong>
				</p>
			</div>
			<hr role="presentation" />
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
		<Fragment>
			<Banner appearance="warning" icon={<WarningIcon spacing="spacious" label="Warning" />}>
				This is an example for tests only -
				<Link target="_blank" href="https://atlassian.design/components/popup/usage#accessibility">
					{' '}
					don’t use scrolling popups
				</Link>{' '}
				in apps.
			</Banner>
			<div css={spacerStyles}>
				<Popup
					shouldRenderToParent
					isOpen={isOpen}
					testId="popup-content-wrapper"
					onClose={() => setIsOpen(false)}
					content={() => <PopupContent setPosition={setPlacement} placement={placement} />}
					trigger={(triggerProps) => (
						<Button
							id="popup-trigger"
							{...triggerProps}
							testId="popup-trigger"
							onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? 'Close' : 'Open'} Popup
						</Button>
					)}
					placement={placement}
				/>
			</div>
		</Fragment>
	);
};

export default PopupPlacementExample;
