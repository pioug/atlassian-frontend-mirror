/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { expandIconWrapperStyle } from '@atlaskit/editor-common/styles';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import AddIcon from '@atlaskit/icon/glyph/editor/add';

import { triggerWrapper } from './styles';

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
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
	<span css={triggerWrapper}>
		<AddIcon label={props.label} />
		{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */}
		<span css={expandIconWrapperStyle}>
			<ExpandIcon label="" />
		</span>
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
