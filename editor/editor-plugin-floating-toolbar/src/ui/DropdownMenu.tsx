/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';
import type { ComponentType, FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import type { WithIntlProps, WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { ExtensionAPI, ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { DropdownMenuItem, DropdownSeparator } from '@atlaskit/editor-common/floating-toolbar';
import type {
	DropdownOptionT,
	FloatingToolbarOverflowDropdownOptions,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ButtonItemProps } from '@atlaskit/menu';
import { HeadingItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

export const menuItemDimensions = {
	width: 175,
	height: 32,
};

const headingStyles = css({
	padding: `${token('space.200')} 0 ${token('space.100')}`,
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
const menuContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minWidth: `${menuItemDimensions.width}px`,

	// temporary solution to retain spacing defined by @atlaskit/Item
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& button': {
		minHeight: token('space.400'),
		padding: `${token('space.100')} ${token('space.100')} 7px`,

		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > [data-item-elem-before]': {
			marginRight: token('space.050'),
		},
	},
});

// itemSpacing is used in calculations expecting a number, hence not using a space token
export const itemSpacing = 4;
export interface Props {
	areAnyNewToolbarFlagsEnabled?: boolean;
	dispatchCommand: Function;
	editorView?: EditorView;
	hide: Function;
	items: Array<DropdownOptionT<Function>> | FloatingToolbarOverflowDropdownOptions<Function>;
	showSelected?: boolean;
}
export type ExtensionProps = {
	extensionApi?: ExtensionAPI;
	extensionProvider?: Promise<ExtensionProvider>;
};
// Extend the ButtonItem component type to allow mouse events to be accepted from the Typescript check
export interface DropdownButtonItemProps extends ButtonItemProps {
	onBlur?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onFocus?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseEnter?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseLeave?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseOut?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseOver?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const Dropdown = memo((props: Props & WrappedComponentProps) => {
	const {
		hide,
		dispatchCommand,
		items,
		intl,
		editorView,
		showSelected = true,
		areAnyNewToolbarFlagsEnabled,
	} = props;

	if (areAnyNewToolbarFlagsEnabled) {
		return (
			<div css={menuContainerStyles} role="menu">
				{/* eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed) */}
				{items
					// @ts-ignore
					.filter((item) => item && (!('hidden' in item) || !item.hidden))
					.map((item, idx) => {
						if (!('type' in item)) {
							return (
								<DropdownMenuItem
									// Ignored via go/ees005
									// eslint-disable-next-line react/no-array-index-key
									key={idx}
									item={item}
									hide={hide}
									dispatchCommand={dispatchCommand}
									editorView={editorView}
									showSelected={showSelected}
									intl={intl}
								/>
							);
						}
						if (item.type === 'separator') {
							// eslint-disable-next-line react/no-array-index-key
							return <DropdownSeparator key={idx} />;
						}
						if (item.type === 'overflow-dropdown-heading') {
							return (
								<div key={item.title} css={headingStyles}>
									<HeadingItem>{item.title}</HeadingItem>
								</div>
							);
						}
						if (item.type === 'custom') {
							const dropdownMenuOptions = { hide, dispatchCommand, editorView, showSelected, intl };
							return item.render(editorView, dropdownMenuOptions);
						}
					})}
			</div>
		);
	}

	return (
		<div css={menuContainerStyles} role="menu">
			{/* eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed) */}
			{(items as Array<DropdownOptionT<Function>>)
				.filter((item) => !item.hidden)
				.map((item, idx) => (
					<DropdownMenuItem
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						key={idx}
						item={item}
						hide={hide}
						dispatchCommand={dispatchCommand}
						editorView={editorView}
						showSelected={showSelected}
						intl={intl}
					/>
				))}
		</div>
	);
});

const _default_1: FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: ComponentType<Props & WrappedComponentProps>;
} = injectIntl(Dropdown);
export default _default_1;
