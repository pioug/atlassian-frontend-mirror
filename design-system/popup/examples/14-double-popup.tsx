/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, Fragment, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

const spacerStyles = css({
	margin: '250px',
});

const sizedContentStyles = css({
	alignItems: 'center',
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
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
				shouldRenderToParent
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
				shouldRenderToParent
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
