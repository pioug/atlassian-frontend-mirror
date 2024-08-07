/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { expandIconWrapperStyle } from '@atlaskit/editor-common/styles';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import AddIcon from '@atlaskit/icon/core/migration/add--editor-add';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { default as AddIconLegacy } from '@atlaskit/icon/glyph/editor/add';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';

import { expandWrapperStyle, triggerWrapper } from './styles';

export interface DropDownButtonProps {
	label: string;
	selected: boolean;
	disabled?: boolean;
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	'aria-haspopup': React.AriaAttributes['aria-haspopup'];
	'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
	onClick: React.MouseEventHandler;
	onKeyDown?: React.KeyboardEventHandler;
	spacing: 'none' | 'default';
	handleRef(el: ToolbarButtonRef): void;
}

const DropDownButtonIcon = React.memo((props: { label: string }) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<span css={triggerWrapper}>
		{fg('platform_editor_migration_icon_and_typography') ? (
			<AddIcon label={props.label} color="currentColor" />
		) : (
			<AddIconLegacy label={props.label} />
		)}
		{fg('platform_editor_migration_icon_and_typography') ? (
			//eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<span css={expandWrapperStyle}>
				<ChevronDownIcon label="" color="currentColor" />
			</span>
		) : (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<span css={expandIconWrapperStyle}>
				<ExpandIcon label="" />
			</span>
		)}
	</span>
));

export const DropDownButton = React.memo((props: DropDownButtonProps) => (
	<ToolbarButton
		ref={props.handleRef}
		selected={props.selected}
		disabled={props.disabled}
		onClick={props.onClick}
		onKeyDown={props.onKeyDown}
		spacing={props.spacing}
		aria-expanded={props['aria-expanded']}
		aria-haspopup={props['aria-haspopup']}
		aria-keyshortcuts={props['aria-keyshortcuts']}
		aria-label={`${props.label}`}
		iconBefore={<DropDownButtonIcon label="" />}
		title={<ToolTipContent description={props.label} shortcutOverride="/" />}
	/>
));
