/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import UnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { ButtonItem } from '@atlaskit/menu';
import { B400, B50, N10, N200, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import ImgIcon from './common/img-icon';
import Yeti from './icons/yeti.png';

const containerStyles = cssMap({
	root: {
		width: 500,
	},
});

// Mimics overrides in side-navigation
const customItemStyles = cssMap({
	root: {
		paddingBlockStart: token('space.100', '8px'),
		paddingInlineEnd: token('space.300', '24px'),
		paddingBlockEnd: token('space.100', '8px'),
		paddingInlineStart: token('space.300', '24px'),
		borderRadius: token('radius.small'),
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

const loremText =
	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates incidunt nisi, esse ullam fugit omnis libero neque facilis magnam quaerat dolor iste consequuntur placeat, rerum numquam, eum tempora! Accusamus, quidem?';

const _default: () => JSX.Element = () => (
	<div data-testid="button-items" css={containerStyles.root}>
		<ButtonItem testId="first-item">Activate</ButtonItem>
		<ButtonItem isDisabled>Activate</ButtonItem>
		<ButtonItem isSelected>Activate</ButtonItem>
		<ButtonItem description="Next-gen software project">Activate</ButtonItem>
		<ButtonItem description="Legacy software project" isDisabled>
			Activate
		</ButtonItem>
		<ButtonItem iconBefore={<ImgIcon src={Yeti} alt="" />} description="Next-gen software project">
			Activate
		</ButtonItem>
		<ButtonItem iconBefore={<UnstarredIcon label="" />}>With iconBefore prop</ButtonItem>
		<ButtonItem iconAfter={<UnstarredIcon label="" />}>With iconAfter prop</ButtonItem>
		<ButtonItem iconBefore={<UnstarredIcon label="" />} iconAfter={<UnstarredIcon label="" />}>
			With both iconAfter and iconBefore prop
		</ButtonItem>
		<ButtonItem
			description={loremText}
			iconBefore={<UnstarredIcon label="" />}
			iconAfter={<UnstarredIcon label="" />}
		>
			{loremText}
		</ButtonItem>
		<ButtonItem
			description={loremText}
			iconBefore={<UnstarredIcon label="" />}
			iconAfter={<UnstarredIcon label="" />}
			shouldTitleWrap
			shouldDescriptionWrap
		>
			{loremText}
		</ButtonItem>
		<ButtonItem css={customItemStyles.root} description="Style overrides">
			Activate
		</ButtonItem>
		<ButtonItem
			isDisabled
			css={[customItemStyles.root, customItemStyles.disabled]}
			description="Style overrides"
		>
			Activate
		</ButtonItem>
		<ButtonItem css={customItemStyles.root} description="Style overrides">
			Activate
		</ButtonItem>
	</div>
);
export default _default;
