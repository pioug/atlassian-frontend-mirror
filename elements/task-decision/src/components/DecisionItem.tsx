/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';

import Item from './Item';
import { type Appearance, type ContentRef } from '../types';
import { token } from '@atlaskit/tokens';
import { G400, N100 } from '@atlaskit/theme/colors';

const iconStyles = (showPlaceholder: boolean | undefined) => {
	return css({
		flex: '0 0 16px',
		height: '16px',
		width: '16px',
		margin: `${token('space.050', '4px')} ${token('space.150', '12px')} 0 0`,
		color: showPlaceholder ? token('color.icon.subtle', N100) : token('color.icon.success', G400),
		'> span': {
			margin: token('space.negative.100', '-8px'),
		},
	});
};

export interface Props {
	children?: any;
	contentRef?: ContentRef;
	placeholder?: string;
	showPlaceholder?: boolean;
	appearance?: Appearance;
	dataAttributes?: { [key: string]: string | number };
}

const DecisionItem = ({
	appearance,
	children,
	contentRef,
	placeholder,
	showPlaceholder,
	dataAttributes,
}: Props) => {
	const icon = (
		<span contentEditable={false} css={iconStyles(showPlaceholder)}>
			<DecisionIcon label="Decision" size="large" />
		</span>
	);

	return (
		<Item
			appearance={appearance}
			contentRef={contentRef}
			icon={icon}
			placeholder={placeholder}
			showPlaceholder={showPlaceholder}
			itemType="DECISION"
			dataAttributes={dataAttributes}
		>
			{children}
		</Item>
	);
};

export default DecisionItem;
