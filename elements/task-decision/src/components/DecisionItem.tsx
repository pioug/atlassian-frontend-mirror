/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import DecisionIcon from '@atlaskit/icon/core/decision';

import Item from './Item';
import { type Appearance, type ContentRef } from '../types';
import { token } from '@atlaskit/tokens';

const iconStyles = css({
	flex: '0 0 16px',
	height: '16px',
	width: '16px',
	marginTop: token('space.050', '4px'),
	marginRight: token('space.150', '12px'),
	marginBottom: 0,
	marginLeft: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: token('color.icon.success'),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const iconStylesWithPlaceholder = css({
	color: token('color.icon.subtle'),
});

export interface Props {
	appearance?: Appearance;
	children?: any;
	contentRef?: ContentRef;
	dataAttributes?: { [key: string]: string | number };
	placeholder?: string;
	showPlaceholder?: boolean;
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
		<span contentEditable={false} css={[iconStyles, showPlaceholder && iconStylesWithPlaceholder]}>
			<DecisionIcon label="Decision" spacing="spacious" color="currentColor" />
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
