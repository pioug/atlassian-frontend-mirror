/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type FC, forwardRef, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import SearchIcon from '@atlaskit/icon/core/migration/search--editor-search';
import { components } from '@atlaskit/react-select';
import { N40A } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
	type ClearIndicatorProps,
	type ControlProps,
	type MenuProps,
	type MultiValueRemoveProps,
	type OptionType,
} from '../types';

// ==============================
// Styled Components
// ==============================
interface MenuDialogProps {
	style: CSSProperties;
	children: ReactNode;
	id: string;
	testId?: string;
}

const menuDialogStyles = css({
	zIndex: layers.modal(),
	backgroundColor: token('elevation.surface.overlay', 'white'),
	borderRadius: token('radius.small', '4px'),
	boxShadow: token('elevation.shadow.overlay', `0 0 0 1px ${N40A}, 0 4px 11px ${N40A}`),
});

/**
 * __Menu dialog__
 * Wrapper for PopupSelect component.
 */
export const MenuDialog: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<MenuDialogProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, MenuDialogProps>(({ children, id, style, testId }, ref) => {
	return (
		<div
			ref={ref}
			css={menuDialogStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			id={id}
			data-testid={testId && `${testId}--menu`}
		>
			{children}
		</div>
	);
});

// ==============================
// Custom Components
// ==============================

const dropdownStyles = css({
	width: 32,
	marginInlineEnd: token('space.025', '2px'),
	textAlign: 'center',
});

const DropdownIndicator = (): JSX.Element => (
	<div css={dropdownStyles}>
		<SearchIcon color="currentColor" label="" />
	</div>
);

const controlStyles = css({
	paddingBlockEnd: token('space.050', '4px'),
	paddingBlockStart: token('space.100', '8px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.100', '8px'),
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
		{/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props */}
		<components.Control {...props} />
	</VisuallyHidden>
);

// NOTE `props` intentionally omitted from `Fragment`
const Menu = ({ children, innerProps }: MenuProps<OptionType, boolean>): JSX.Element => (
	<div {...innerProps}>{children}</div>
);

// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
const ClearIndicator = (props: ClearIndicatorProps): JSX.Element => (
	<components.ClearIndicator {...props} />
);

const MultiValueRemove = (props: MultiValueRemoveProps): JSX.Element => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<components.MultiValueRemove {...props} />
);

export const defaultComponents: {
	Control: FC<ControlProps<OptionType, boolean>>;
	DropdownIndicator: () => JSX.Element;
	Menu: ({ children, innerProps }: MenuProps<OptionType, boolean>) => JSX.Element;
	ClearIndicator: (props: ClearIndicatorProps) => JSX.Element;
	MultiValueRemove: (props: MultiValueRemoveProps) => JSX.Element;
} = {
	Control,
	DropdownIndicator,
	Menu,
	ClearIndicator,
	MultiValueRemove,
};
