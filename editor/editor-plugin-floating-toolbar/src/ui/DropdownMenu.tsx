/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { ExtensionAPI, ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { DropdownMenuItem } from '@atlaskit/editor-common/floating-toolbar';
import type {
	DropdownOptionT,
	FloatingToolbarOverflowDropdownOptions,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ButtonItemProps } from '@atlaskit/menu';
import { HeadingItem } from '@atlaskit/menu';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

export const menuItemDimensions = {
	width: 175,
	height: 32,
};

const separatorStyles = css({
	background: token('color.border'),
	height: token('space.025', '1px'),
});

const headingStyles = css({
	padding: `${token('space.200', '16px')} 0 ${token('space.100', '8px')}`,
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
const menuContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minWidth: `${menuItemDimensions.width}px`,

	// temporary solution to retain spacing defined by @atlaskit/Item
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& button': {
		minHeight: token('space.400', '32px'),
		padding: `${token('space.100', '8px')} ${token('space.100', '8px')} 7px`,

		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > [data-item-elem-before]': {
			marginRight: token('space.050', '4px'),
		},
	},
});

// TODO: ED-26959 - Migrate away from gridSize
// Recommendation: Replace with 4 as itemSpacing is used in calculations expecting a number
export const itemSpacing = gridSize() / 2;
export interface Props {
	hide: Function;
	dispatchCommand: Function;
	items: Array<DropdownOptionT<Function>> | FloatingToolbarOverflowDropdownOptions<Function>;
	showSelected?: boolean;
	editorView?: EditorView;
}
export type ExtensionProps = {
	extensionApi?: ExtensionAPI;
	extensionProvider?: Promise<ExtensionProvider>;
};
// Extend the ButtonItem component type to allow mouse events to be accepted from the Typescript check
export interface DropdownButtonItemProps extends ButtonItemProps {
	onMouseEnter?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseOver?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseLeave?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseOut?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onFocus?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onBlur?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const Dropdown = memo((props: Props & WrappedComponentProps) => {
	const { hide, dispatchCommand, items, intl, editorView, showSelected = true } = props;

	if (editorExperiment('platform_editor_controls', 'variant1')) {
		return (
			<div css={menuContainerStyles} role="menu">
				{items
					.filter((item) => !('hidden' in item) || !item.hidden)
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
							return <div key={idx} css={separatorStyles} />;
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

export default injectIntl(Dropdown);
