/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import AddIcon from '@atlaskit/icon/core/add';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

import { triggerWrapper } from './styles';

export interface DropDownButtonProps {
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	'aria-haspopup': React.AriaAttributes['aria-haspopup'];
	'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
	disabled?: boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	handleRef(el: ToolbarButtonRef): void;
	label: string;
	onClick: React.MouseEventHandler;
	onKeyDown?: React.KeyboardEventHandler;
	selected: boolean;
	spacing: 'none' | 'default';
}

const DropDownButtonIcon = React.memo((props: { label: string }) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<span css={triggerWrapper}>
		{<AddIcon label={props.label} color="currentColor" spacing="spacious" />}
		{
			<span>
				<ChevronDownIcon label="" color="currentColor" LEGACY_margin="0 0 0 -8px" size="small" />
			</span>
		}
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
