/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { ButtonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import ImgIcon from '../common/img-icon';
import Yeti from '../icons/yeti.png';

// Mimics overrides in side-navigation
const styles = cssMap({
	root: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.300'),
		borderRadius: token('radius.small'),
		backgroundColor: '#FAFBFC',
		color: '#42526E',
		'&:hover': {
			backgroundColor: '#EBECF0',
			textDecoration: 'none',
			color: '#42526E',
		},
		'&:active': {
			color: '#0052CC',
			backgroundColor: '#DEEBFF',
			boxShadow: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-elem-before]': {
			display: 'flex',
			height: 8 * 1.25,
			width: 8 * 1.25,
			alignItems: 'center',
			justifyContent: 'center',
			marginInlineEnd: token('space.200'),
		},
	},
	disabled: {
		color: token('color.text.disabled'),
		backgroundColor: '#FAFBFC',
		'&:hover, &:active': {
			backgroundColor: '#FAFBFC',
			color: token('color.text.disabled'),
		},
	},
});

const _default: () => JSX.Element = () => (
	<div data-testid="button-items">
		<ButtonItem isSelected>Activate</ButtonItem>
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
export default _default;
