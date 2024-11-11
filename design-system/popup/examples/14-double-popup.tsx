/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

const spacerStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	margin: '250px',
});

const sizedContentStyles = css({
	padding: token('space.100', '8px'),
	alignItems: 'center',
	textAlign: 'center',
	verticalAlign: 'center',
});

const OtherItems: FC = () => {
	return (
		<Fragment>
			<div>Item</div>
			<div>Item</div>
			<div>Item</div>
			<div>Item</div>
			<div>Item</div>
		</Fragment>
	);
};

const PopupContent: FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div id="popup-content" css={sizedContentStyles}>
			<Popup
				isOpen={isOpen}
				placement="right-start"
				onClose={() => setIsOpen(false)}
				content={() => (
					<div id="popup-content-2" css={sizedContentStyles}>
						<div>A second pop-up</div>
						<OtherItems />
					</div>
				)}
				offset={[0, 12]}
				trigger={(triggerProps) => (
					<Button
						id="popup-trigger"
						{...triggerProps}
						// @ts-ignore
						ref={triggerProps.ref}
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
			/>
			<OtherItems />
		</div>
	);
};

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div css={spacerStyles}>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent />}
				trigger={(triggerProps) => (
					<Button id="popup-trigger" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement={'bottom-start'}
			/>
		</div>
	);
};
