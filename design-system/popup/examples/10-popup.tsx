/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/new';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Link from '@atlaskit/link';
import { type Placement } from '@atlaskit/popper';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

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

const textWrapperStyles = css({
	marginBlockStart: token('space.150', '12px'),
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
			<Banner appearance="warning" icon={<WarningIcon label="Warning" secondaryColor="inherit" />}>
				This is an example for tests only -
				<Link target="_blank" href="https://atlassian.design/components/popup/usage#accessibility">
					{' '}
					don’t use scrolling popups
				</Link>{' '}
				in products.
			</Banner>
			<div css={spacerStyles}>
				<Popup
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
