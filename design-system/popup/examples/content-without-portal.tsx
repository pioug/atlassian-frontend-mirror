/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type FC, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';

import Popup from '../src';

const popupStyles = css({
	width: 175,
	height: 250,
	textAlign: 'center',
});
const PopupContent: FC = () => {
	return (
		<div css={popupStyles}>
			<p>Popup content</p>
		</div>
	);
};
const ContentWithoutPortal = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popup
			placement="bottom-start"
			shouldRenderToParent
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <PopupContent />}
			trigger={(triggerProps) => (
				<Button id="popup-trigger" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? 'Close' : 'Open'} Popup
				</Button>
			)}
		/>
	);
};
export default ContentWithoutPortal;
