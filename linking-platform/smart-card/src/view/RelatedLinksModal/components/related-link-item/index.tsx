/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import {
	Card,
	type ElementItem,
	ElementName,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkTheme,
	TitleBlock,
} from '../../../../index';
import { type FlexibleUiOptions } from '../../../FlexibleCard/types';
import { type RelatedLinkItemProp } from '../types';

const hoverStyleOld = css({
	'&:hover': {
		backgroundColor: token('color.background.input.hovered'),
		borderRadius: token('border.radius.100'),
		marginInline: token('space.negative.100'),
		paddingInline: token('space.100'),
	},
});

const hoverStyle = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
});

const baseStyle = css({
	marginInline: token('space.negative.300'),
	paddingInline: token('space.300'),
});

const selectedStyle = css({
	backgroundColor: token('color.background.selected'),
	boxShadow: `inset 2px 0 0 0 ${token('color.border.selected')}`,
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.selected.pressed'),
	},
});

const relatedLinkItemStyles = css({
	paddingTop: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	gap: token('space.150', '12px'),
	font: token('font.body.small'),
});

const RelatedLinkItem = ({ url, testId, isSelected, onFocus }: RelatedLinkItemProp) => {
	const subtitle: ElementItem[] = [{ name: ElementName.Provider, hideIcon: true }];

	const ui: FlexibleUiOptions = {
		hideElevation: true,
		hidePadding: true,
		hideBackground: true,
		theme: SmartLinkTheme.Black,
		clickableContainer: true,
		size: fg('platform-linking-visual-refresh-v2') ? SmartLinkSize.Medium : SmartLinkSize.Large,
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			data-testId={testId}
			css={[
				fg('platform-linking-visual-refresh-v2') && baseStyle,
				fg('platform-linking-visual-refresh-v2') ? hoverStyle : hoverStyleOld,
				isSelected && fg('platform-linking-visual-refresh-v2') && selectedStyle,
			]}
			onFocus={onFocus}
		>
			<Card appearance="block" ui={ui} url={url}>
				<TitleBlock
					maxLines={1}
					hideTitleTooltip={true}
					position={
						fg('platform-linking-visual-refresh-v2')
							? SmartLinkPosition.Top
							: SmartLinkPosition.Center
					}
					subtitle={subtitle}
					anchorTarget="_blank"
					css={relatedLinkItemStyles}
					size={ui.size}
				/>
			</Card>
		</div>
	);
};

export default RelatedLinkItem;
