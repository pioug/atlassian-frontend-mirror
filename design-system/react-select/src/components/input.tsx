/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type InputHTMLAttributes } from 'react';

import { css, cssMap, cx, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type GroupBase } from '../types';
import { cleanCommonProps, getStyleProps } from '../utils';

interface InputSpecificProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends InputHTMLAttributes<HTMLInputElement>,
		CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Reference to the internal element
	 */
	innerRef?: (instance: HTMLInputElement | null) => void;
	/**
	 * Set whether the input should be visible. Does not affect input size.
	 */
	isHidden: boolean;
	/**
	 * Whether the input is disabled
	 */
	isDisabled?: boolean;
	/**
	 * The ID of the form that the input belongs to
	 */
	form?: string;
	/**
	 * Set className for the input element
	 */
	inputClassName?: string;
	/**
	 * A testId prop is provided for specific elements. This is a unique string that appears as a data attribute data-testid in the rendered code and serves as a hook for automated tests.
	 */
	testId?: string;
}

export type InputProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> = InputSpecificProps<Option, IsMulti, Group>;

export const inputCSS = () => ({});

const inputStylesOld = cssMap({
	root: {
		display: 'inline-grid',
		flex: '1 1 auto',
		gridTemplateColumns: '0 min-content',
		gridArea: '1 / 1 / 2 / 3',
		'&::after': {
			minWidth: '2px',
			margin: 0,
			padding: 0,
			border: 0,
			content: 'attr(data-value) " "',
			font: 'inherit',
			gridArea: '1 / 2',
			outline: 0,
			visibility: 'hidden',
			whiteSpace: 'pre',
		},
		marginBlock: token('space.025'),
		marginInline: token('space.025'),
		paddingBlock: token('space.025'),
		color: token('color.text'),
	},
	disabled: {
		visibility: 'hidden',
	},
});

const inputStyles = cssMap({
	root: {
		position: 'relative',
		display: 'flex',
		flex: '1 1 auto',
		gridTemplateColumns: '0 min-content',
		gridArea: '1 / 1 / 2 / 3',
		'&::after': {
			minWidth: '2px',
			margin: 0,
			padding: 0,
			border: 0,
			content: 'attr(data-value) " "',
			font: 'inherit',
			gridArea: '1 / 2',
			outline: 0,
			visibility: 'hidden',
			whiteSpace: 'pre',
		},
		marginBlock: token('space.025'),
		marginInline: token('space.025'),
		paddingBlock: token('space.025'),
		color: token('color.text'),
	},
	disabled: {
		visibility: 'hidden',
	},
});

const nativeInputStylesOld = css({
	width: '100%',
	minWidth: '2px',
	margin: 0,
	padding: 0,
	background: 0,
	border: 0,
	color: 'inherit',
	font: 'inherit',
	gridArea: '1 / 2',
	opacity: 1,
	outline: 0,
});

const nativeInputStyles = css({
	width: '100%',
	minWidth: '2px',
	margin: 0,
	padding: 0,
	position: 'absolute',
	inset: 0,
	background: 0,
	border: 0,
	color: 'inherit',
	font: 'inherit',
	gridArea: '1 / 2',
	opacity: 1,
	outline: 0,
});

const hidden = css({
	opacity: 0,
});

const Input = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: InputProps<Option, IsMulti, Group>,
) => {
	const { cx: builtinCX, value, xcss } = props;
	const { innerRef, isDisabled, isHidden, inputClassName, testId, ...innerProps } =
		cleanCommonProps(props);
	const dataId = testId ? `${testId}-select--input` : null;
	const { css, className } = getStyleProps(props, 'input', { 'input-container': true });

	if (fg('platform_do_not_clear_input_for_multiselect')) {
		return (
			<div
				css={[inputStyles.root, isDisabled && inputStyles.disabled]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={css as CSSProperties}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
				className={cx(className as any, xcss, '-Input')}
				data-value={value || ''}
				data-testid={dataId && `${dataId}-container`}
			>
				<input
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={builtinCX({ input: true }, inputClassName, '-input')}
					ref={innerRef}
					css={[nativeInputStyles, isHidden && hidden]}
					disabled={isDisabled}
					data-testid={dataId}
					{...innerProps}
				/>
			</div>
		);
	}

	return (
		<div
			css={[inputStylesOld.root, isDisabled && inputStylesOld.disabled]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-Input')}
			data-value={value || ''}
			data-testid={dataId && `${dataId}-container`}
		>
			<input
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={builtinCX({ input: true }, inputClassName, '-input')}
				ref={innerRef}
				css={[nativeInputStylesOld, isHidden && hidden]}
				disabled={isDisabled}
				data-testid={dataId}
				{...innerProps}
			/>
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Input;
