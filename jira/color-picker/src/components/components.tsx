/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MenuListComponentProps, type OptionProps } from '@atlaskit/select';
import { type Color } from '../types';
import ColorCard from './ColorCard';
import { getWidth } from '../utils';
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@atlaskit/css';
import { COLOR_PICKER } from '../constants';
import { useIntl } from 'react-intl';
import messages from '../messages';

export const MenuList = (props: MenuListComponentProps<Color>): JSX.Element => {
	const {
		//@ts-ignore react-select unsupported props
		selectProps: { cols },
		innerRef,
		children,
	} = props;

	const { formatMessage } = useIntl();

	return (
		<div
			css={colorPaletteContainerStyles}
			role="group"
			aria-label={formatMessage(messages.menuListAriaLabel)}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				maxWidth: cols ? getWidth(cols) : undefined,
			}}
			//@ts-ignore react-select unsupported props
			ref={innerRef!}
		>
			{children}
		</div>
	);
};

export const Option = (props: OptionProps<Color>): JSX.Element => {
	const {
		data: { value, label },
		//@ts-ignore react-select unsupported props
		selectProps: { checkMarkColor, onOptionKeyDown, isTabbing, variant },
		isFocused,
		isSelected,
		innerProps,
	} = props;

	return (
		<div
			css={colorCardWrapperStyles}
			{...innerProps}
			role="radio"
			aria-checked={isSelected}
			aria-selected={undefined}
			aria-label={label}
		>
			<ColorCard
				type={COLOR_PICKER}
				label={label}
				value={value}
				checkMarkColor={checkMarkColor}
				isOption
				focused={isFocused}
				selected={isSelected}
				onKeyDown={(value) => onOptionKeyDown(value)}
				isTabbing={isTabbing}
				variant={variant}
			/>
		</div>
	);
};

export const DropdownIndicator = () => null;

export const Placeholder = () => null;

const colorCardWrapperStyles = css({
	display: 'flex',
	marginTop: token('space.025'),
	marginRight: token('space.025'),
	marginBottom: token('space.025'),
	marginLeft: token('space.025'),
	height: '32px',
});

const colorPaletteContainerStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	paddingTop: token('space.050'),
	paddingRight: token('space.050'),
	paddingBottom: token('space.050'),
	paddingLeft: token('space.050'),
});
