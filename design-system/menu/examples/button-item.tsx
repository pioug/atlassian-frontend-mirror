/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { ButtonItem } from '@atlaskit/menu';
import { B400, B50, N10, N200, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import ImgIcon from './common/img-icon';
import Yeti from './icons/yeti.png';

// Mimics overrides in side-navigation
const styles = cssMap({
	root: {
		paddingBlockStart: token('space.100', '8px'),
		paddingInlineEnd: token('space.300', '24px'),
		paddingBlockEnd: token('space.100', '8px'),
		paddingInlineStart: token('space.300', '24px'),
		borderRadius: '3px',
		backgroundColor: N10,
		color: N500,
		'&:hover': {
			backgroundColor: N30,
			textDecoration: 'none',
			color: N500,
		},
		'&:active': {
			color: B400,
			backgroundColor: B50,
			boxShadow: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-elem-before]': {
			display: 'flex',
			height: 8 * 1.25,
			width: 8 * 1.25,
			alignItems: 'center',
			justifyContent: 'center',
			marginRight: token('space.200', '16px'),
		},
	},
	disabled: {
		color: token('color.text.disabled', N200),
		backgroundColor: N10,
		'&:hover, &:active': {
			backgroundColor: N10,
			color: token('color.text.disabled', N200),
		},
	},
});

export default () => (
	<div data-testid="button-items">
		<ButtonItem>Activate</ButtonItem>
		<ButtonItem isDisabled>Activate</ButtonItem>
		<ButtonItem>Activate</ButtonItem>
		<ButtonItem description="Next-gen software project">Activate</ButtonItem>
		<ButtonItem description="Legacy software project" isDisabled>
			Activate
		</ButtonItem>
		<ButtonItem iconBefore={<ImgIcon src={Yeti} alt="" />} description="Next-gen software project">
			Activate
		</ButtonItem>
		<ButtonItem css={styles.root} description="Style overrides">
			Activate
		</ButtonItem>
		<ButtonItem isDisabled css={[styles.root, styles.disabled]} description="Style overrides">
			Activate
		</ButtonItem>
		<ButtonItem css={styles.root} description="Style overrides">
			Activate
		</ButtonItem>
	</div>
);
