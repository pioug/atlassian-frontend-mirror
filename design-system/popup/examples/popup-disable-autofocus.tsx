/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useEffect, useState } from 'react';

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
	height: '80px',
	padding: token('space.400', '32px'),
	alignItems: 'center',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'center',
});

const PopupContent: FC = () => {
	return (
		<div id="popup-content" css={sizedContentStyles}>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum fugit aut reiciendis fuga
			praesentium illo rerum, libero, placeat deleniti inventore odit incidunt laborum qui nam
			voluptatum iusto voluptas sapiente magnam?
		</div>
	);
};

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const input = document.querySelector('input');
		input && input.focus();
	});

	return (
		<div id="container" css={spacerStyles}>
			<Popup
				testId="popup"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent />}
				trigger={(triggerProps) => (
					<Button
						id="popup-trigger"
						{...triggerProps}
						onClick={() => setIsOpen(!isOpen)}
						testId="popup-trigger"
					>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement="bottom"
				autoFocus={false}
			/>
			<input data-testid="focused-input" placeholder="This should keep focus" />
		</div>
	);
};
