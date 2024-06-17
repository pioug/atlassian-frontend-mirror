/** @jsx jsx */
import { type FC, type ReactNode, type CSSProperties } from 'react';
import { components } from 'react-select';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import VisuallyHidden from '@atlaskit/visually-hidden';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';
import { layers } from '@atlaskit/theme/constants';
import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type ControlProps, type MenuProps, type OptionType } from '../types';

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
	backgroundColor: token('elevation.surface.overlay', 'white'),
	borderRadius: token('border.radius.100', '4px'),
	boxShadow: token('elevation.shadow.overlay', `0 0 0 1px ${N40A}, 0 4px 11px ${N40A}`),
	zIndex: layers.modal(),
});

export const MenuDialog: FC<MenuDialogProps> = ({
	maxWidth,
	minWidth,
	children,
	id,
	style,
	testId,
}) => (
	<div
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
);

// ==============================
// Custom Components
// ==============================

const dropdownStyles = css({
	marginInlineEnd: token('space.025', '2px'),
	textAlign: 'center',
	width: 32,
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

export const DummyControl: FC<ControlProps<OptionType, boolean>> = (props) => (
	<VisuallyHidden>
		<components.Control {...props} />
	</VisuallyHidden>
);

// NOTE `props` intentionally omitted from `Fragment`
const Menu = ({ children, innerProps }: MenuProps<OptionType, boolean>) => (
	<div {...innerProps}>{children}</div>
);

export const defaultComponents = {
	Control,
	DropdownIndicator,
	Menu,
};
