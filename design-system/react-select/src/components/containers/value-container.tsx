/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type JSX, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

export interface ValueContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Props to be passed to the value container element.
	 */
	innerProps?: {};
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	isDisabled: boolean;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}

const valueContainerStyles = cssMap({
	default: {
		alignItems: 'center',
		display: 'grid',
		flex: 1,
		flexWrap: 'wrap',
		WebkitOverflowScrolling: 'touch',
		position: 'relative',
		overflow: 'hidden',
		paddingInlineEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
	verticalPaddingStandard: {
		paddingBlockStart: token('space.025'),
		paddingBlockEnd: token('space.025'),
	},
	verticalPaddingTagUpliftMulti: {
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
	},
	verticalPaddingTagUpliftCompactMulti: {
		paddingBlockStart: token('space.025'),
		paddingBlockEnd: token('space.025'),
	},
	verticalPaddingCompactNonUplift: {
		paddingBlockStart: token('space.0'),
		paddingBlockEnd: token('space.0'),
	},
	flex: {
		display: 'flex',
	},
	flexWithGap: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: token('space.050'),
	},
});

const semanticValueContainerStyles = cssMap({
	default: {
		paddingInlineEnd: token('space.inset.small'),
		paddingInlineStart: token('space.inset.small'),
	},
	verticalPaddingStandard: {
		paddingBlockStart: token('space.inset.xxsmall'),
		paddingBlockEnd: token('space.inset.xxsmall'),
	},
	verticalPaddingTagUpliftMulti: {
		paddingBlockStart: token('space.inset.xsmall'),
		paddingBlockEnd: token('space.inset.xsmall'),
	},
	verticalPaddingTagUpliftCompactMulti: {
		paddingBlockStart: token('space.inset.xxsmall'),
		paddingBlockEnd: token('space.inset.xxsmall'),
	},
	verticalPaddingCompactNonUplift: {
		paddingBlockStart: token('space.0'),
		paddingBlockEnd: token('space.0'),
	},
	flexWithGap: {
		gap: token('space.gap.xsmall'),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ValueContainer: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ValueContainerProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ValueContainerProps<Option, IsMulti, Group>,
) => {
	const {
		children,
		innerProps,
		isMulti,
		hasValue,
		isCompact,
		xcss,
		selectProps: { controlShouldRenderValue },
	} = props;

	const { css, className } = getStyleProps(props, 'valueContainer', {
		'value-container': true,
		'value-container--is-multi': isMulti,
		'value-container--has-value': hasValue,
	});

	const tagUpliftMultiVertical = isMulti;
	const tagUpliftChipRow = isMulti && hasValue && controlShouldRenderValue;

	return (
		<div
			css={[
				valueContainerStyles.default,
				tagUpliftMultiVertical &&
					isCompact &&
					valueContainerStyles.verticalPaddingTagUpliftCompactMulti,
				tagUpliftMultiVertical && !isCompact && valueContainerStyles.verticalPaddingTagUpliftMulti,
				!tagUpliftMultiVertical && !isCompact && valueContainerStyles.verticalPaddingStandard,
				!tagUpliftMultiVertical &&
					isCompact &&
					valueContainerStyles.verticalPaddingCompactNonUplift,
				isMulti && hasValue && controlShouldRenderValue && valueContainerStyles.flex,
				tagUpliftChipRow && valueContainerStyles.flexWithGap,
				fg('platform-semantic-spacing') && semanticValueContainerStyles.default,
				fg('platform-semantic-spacing') &&
					tagUpliftMultiVertical &&
					isCompact &&
					semanticValueContainerStyles.verticalPaddingTagUpliftCompactMulti,
				fg('platform-semantic-spacing') &&
					tagUpliftMultiVertical &&
					!isCompact &&
					semanticValueContainerStyles.verticalPaddingTagUpliftMulti,
				fg('platform-semantic-spacing') &&
					!tagUpliftMultiVertical &&
					!isCompact &&
					semanticValueContainerStyles.verticalPaddingStandard,
				fg('platform-semantic-spacing') &&
					!tagUpliftMultiVertical &&
					isCompact &&
					semanticValueContainerStyles.verticalPaddingCompactNonUplift,
				fg('platform-semantic-spacing') &&
					tagUpliftChipRow &&
					semanticValueContainerStyles.flexWithGap,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-ValueContainer')}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			{...innerProps}
		>
			{children}
		</div>
	);
};
