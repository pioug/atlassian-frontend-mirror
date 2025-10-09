/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Link from '@atlaskit/link';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

import { popupContent, popupLinkContent, popupTextContent, popupTrigger } from './utils/selectors';

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

const PopupContent: FC = () => {
	return (
		<div id={popupContent} css={sizedContentStyles}>
			<p>
				<Link id={popupLinkContent} href="#example">
					Link should not focus.
				</Link>
			</p>
			<p id={popupTextContent}>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum fugit aut reiciendis fuga
				praesentium illo rerum, libero, placeat deleniti inventore odit incidunt laborum qui nam
				voluptatum iusto voluptas sapiente magnam?
			</p>
		</div>
	);
};

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div id="container" css={spacerStyles}>
			<Popup
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent />}
				trigger={(triggerProps) => (
					<Button id={popupTrigger} {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement="bottom"
				// eslint-disable-next-line @atlassian/a11y/no-autofocus
				autoFocus={false}
			/>
		</div>
	);
};
