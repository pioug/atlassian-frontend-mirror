/** @jsx jsx */
import { type FC, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

interface PopupContentProps {
	hasTitle?: boolean;
}

const sizedContentStyles = css({
	height: '80px',
	padding: token('space.400', '32px'),
	alignItems: 'center',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'center',
});

const PopupContent: FC<PopupContentProps> = ({ hasTitle }) => {
	return (
		<div id="popup-content" css={sizedContentStyles}>
			{hasTitle && <h2 id="a11y-props-popup-title">Popup accessible title</h2>}
			<h3>Popup content</h3>
			<Button>Button 1</Button>
			<Button>Button 2</Button>
		</div>
	);
};

const PopupExampleWithLabel = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <PopupContent />}
			trigger={(triggerProps) => (
				<Button id="popup-trigger-1" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? 'Close' : 'Open'} Popup
				</Button>
			)}
			role="dialog"
			label="Accessible popup name"
			placement="bottom-start"
		/>
	);
};

const PopupExampleWithTitleId = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <PopupContent hasTitle />}
			trigger={(triggerProps) => (
				<Button id="popup-trigger-2" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? 'Close' : 'Open'} Popup
				</Button>
			)}
			placement="bottom-start"
			role="dialog"
			titleId="a11y-props-popup-title"
		/>
	);
};

export default () => (
	<div>
		<PopupExampleWithLabel />
		<PopupExampleWithTitleId />
	</div>
);
