/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import type { ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl';

import { toolbarMessages } from '@atlaskit/editor-common/messages/toolbar';
import { expandIconContainerStyle } from '@atlaskit/editor-common/styles/expand';
import { wrapperStyle } from '@atlaskit/editor-common/styles/plugins';
import ToolbarButton from '@atlaskit/editor-common/ui-menu/ToolbarButton';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import TextIcon from '@atlaskit/icon/core/text';

import { wrapperSmallStyle } from './styled';

export interface BlockTypeButtonProps {
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	blockTypeIcon?: ReactElement;
	blockTypeName?: string;
	disabled: boolean;
	formatMessage: WrappedComponentProps['intl']['formatMessage'];
	isReducedSpacing?: boolean;
	isSmall?: boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onClick(e: React.MouseEvent): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onKeyDown(e: React.KeyboardEvent): void;
	selected: boolean;
}

export const BlockTypeButton = (props: BlockTypeButtonProps): jsx.JSX.Element => {
	const blockTypeName = props.blockTypeName || '';
	const labelTextStyles = props.formatMessage(toolbarMessages.textStyles, {
		blockTypeName,
	});

	const toolipTextStyles = props.formatMessage(toolbarMessages.textStylesTooltip);

	const icon = props.blockTypeIcon ? (
		props.blockTypeIcon
	) : (
		<TextIcon label={labelTextStyles} spacing="spacious" color="currentColor" />
	);

	return (
		<ToolbarButton
			spacing={props.isReducedSpacing ? 'none' : 'default'}
			selected={props.selected}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="block-type-btn"
			disabled={props.disabled}
			onClick={props.onClick}
			onKeyDown={props.onKeyDown}
			title={toolipTextStyles}
			aria-label={labelTextStyles}
			aria-haspopup
			aria-expanded={props['aria-expanded']}
			iconAfter={
				<span
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={[wrapperStyle, props.isSmall && wrapperSmallStyle]}
					data-testid="toolbar-block-type-text-styles-icon"
				>
					{icon}
					<span
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						css={expandIconContainerStyle}
					>
						<ChevronDownIcon spacing="spacious" label="" color="currentColor" size="small" />
					</span>
				</span>
			}
		/>
	);
};
