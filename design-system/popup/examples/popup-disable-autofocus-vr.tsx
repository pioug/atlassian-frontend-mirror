/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type FC, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Link from '@atlaskit/link';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

import { popupContent, popupLinkContent, popupTextContent, popupTrigger } from './utils/selectors';

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
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent />}
				trigger={(triggerProps) => (
					<Button id={popupTrigger} {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement="bottom"
				autoFocus={false}
			/>
		</div>
	);
};
