/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type FC, forwardRef, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { components } from 'react-select';

import SearchIcon from '@atlaskit/icon/glyph/editor/search';
import { N40A } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
	type ClearIndicatorProps,
	type ControlProps,
	type IndicatorSeparatorProps,
	type MenuProps,
	type MultiValueRemoveProps,
	type OptionType,
} from '../types';

// ==============================
// Styled Components
// ==============================
interface MenuDialogProps {
	maxWidth?: number | string;
	minWidth?: number | string;
	style: CSSProperties;
	children: ReactNode;
	id: string;
	testId?: string;
}

const menuDialogStyles = css({
	zIndex: layers.modal(),
	backgroundColor: token('elevation.surface.overlay', 'white'),
	borderRadius: token('border.radius.100', '4px'),
	boxShadow: token('elevation.shadow.overlay', `0 0 0 1px ${N40A}, 0 4px 11px ${N40A}`),
});

/**
 * __Menu dialog__
 * Wrapper for PopupSelect component.
 *
 */
export const MenuDialog = forwardRef<HTMLDivElement, MenuDialogProps>(
	({ maxWidth, minWidth, children, id, style, testId }, ref) => (
		<div
			ref={ref}
			css={[
				menuDialogStyles,
				// There is not a limited amount of values for the widths, so they need
				// to remain dynamic.
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				{
					maxWidth,
					minWidth,
				},
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			id={id}
			data-testid={testId && `${testId}--menu`}
		>
			{children}
		</div>
	),
);

// ==============================
// Custom Components
// ==============================

const dropdownStyles = css({
	width: 32,
	marginInlineEnd: token('space.025', '2px'),
	textAlign: 'center',
});

const DropdownIndicator = () => (
	<div css={dropdownStyles}>
		<SearchIcon label="open" />
	</div>
);

const controlStyles = css({
	padding: `${token('space.100', '8px')} ${token('space.100', '8px')} ${token('space.050', '4px')}`,
});

const Control: FC<ControlProps<OptionType, boolean>> = ({ innerRef, innerProps, ...props }) => (
	<div ref={innerRef} css={controlStyles}>
		<components.Control {...(props as ControlProps<OptionType, boolean>)} innerProps={innerProps} />
	</div>
);

/**
 * __Dummy control__
 * Overrides the default DummyControl component in Select.
 */
export const DummyControl: FC<ControlProps<OptionType, boolean>> = (props) => (
	<VisuallyHidden>
		<components.Control {...props} />
	</VisuallyHidden>
);

// NOTE `props` intentionally omitted from `Fragment`
const Menu = ({ children, innerProps }: MenuProps<OptionType, boolean>) => (
	<div {...innerProps}>{children}</div>
);

const IndicatorSeparator = (props: IndicatorSeparatorProps) => (
	<components.IndicatorSeparator {...props} />
);

const ClearIndicator = (props: ClearIndicatorProps) => <components.ClearIndicator {...props} />;

const MultiValueRemove = (props: MultiValueRemoveProps) => (
	<components.MultiValueRemove {...props} />
);

export const defaultComponents = {
	Control,
	DropdownIndicator,
	Menu,
	IndicatorSeparator,
	ClearIndicator,
	MultiValueRemove,
};
