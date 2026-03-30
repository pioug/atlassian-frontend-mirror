/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode } from 'react';

import { css, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

export interface IndicatorsContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	isDisabled: boolean;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Props to be passed to the indicators container element.
	 */
	innerProps?: {};
}

const indicatorContainerStyles = css({
	display: 'flex',
	alignItems: 'center',
	flexShrink: 0,
	alignSelf: 'stretch',
	paddingInlineEnd: token('space.050'),
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IndicatorsContainer: <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: IndicatorsContainerProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: IndicatorsContainerProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps, xcss } = props;
	const { css, className } = getStyleProps(props, 'indicatorsContainer', {
		indicators: true,
	});
	return (
		<div
			css={indicatorContainerStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-IndicatorsContainer')}
			{...innerProps}
		>
			{children}
		</div>
	);
};
