/** @jsx jsx */
import { type MenuListComponentProps, type OptionProps } from '@atlaskit/select';
import { type Color } from '../types';
import ColorCard from './ColorCard';
import { getWidth } from '../utils';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

export const MenuList = (props: MenuListComponentProps<Color>) => {
	const {
		selectProps: { cols },
		innerRef,
		children,
	} = props;

	return (
		<div
			css={colorPaletteContainerStyles}
			role="radiogroup"
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				maxWidth: cols ? getWidth(cols) : undefined,
			}}
			ref={innerRef!}
		>
			{children}
		</div>
	);
};

export const Option = (props: OptionProps<Color>) => {
	const {
		data: { value, label },
		selectProps: { checkMarkColor, onOptionKeyDown, isTabbing },
		isFocused,
		isSelected,
		innerProps,
	} = props;

	return (
		<div css={colorCardWrapperStyles} {...innerProps}>
			<ColorCard
				label={label}
				value={value}
				checkMarkColor={checkMarkColor}
				isOption
				focused={isFocused}
				selected={isSelected}
				onKeyDown={(value) => onOptionKeyDown(value)}
				isTabbing={isTabbing}
			/>
		</div>
	);
};

export const DropdownIndicator = () => null;

export const Placeholder = () => null;

const colorCardWrapperStyles = css({
	display: 'flex',
	margin: token('space.025', '2px'),
	height: token('space.400', '32px'),
});

const colorPaletteContainerStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	padding: token('space.050', '4px'),
});
