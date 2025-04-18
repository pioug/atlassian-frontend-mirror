/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	root: {
		marginBlockEnd: token('space.200'),
		marginBlockStart: token('space.200'),
		marginInlineEnd: token('space.200'),
		marginInlineStart: token('space.200'),
	},
});

type PopupExampleProps = {
	name: string;
};

const PopupExample: FC<PopupExampleProps> = ({ name }) => {
	const [isOpen, setIsOpen] = useState(false);

	const onClick = useCallback(() => {
		console.log('onClick', name);
		setIsOpen(!isOpen);
	}, [isOpen, name, setIsOpen]);

	const onClose = useCallback(() => {
		console.log('onClose', name);
		setIsOpen(false);
	}, [name, setIsOpen]);

	return (
		<Popup
			shouldRenderToParent
			isOpen={isOpen}
			onClose={onClose}
			content={() => <Box xcss={contentStyles.root}>content</Box>}
			trigger={(triggerProps) => (
				<Button {...triggerProps} onClick={onClick}>
					{isOpen ? 'Close' : 'Open'} {name} popup
				</Button>
			)}
			placement="bottom-start"
		/>
	);
};

const containerStyles = css({
	display: 'flex',
});

export default () => (
	<div css={containerStyles}>
		<PopupExample name="foo" />
		<PopupExample name="bar" />
		<PopupExample name="baz" />
	</div>
);
