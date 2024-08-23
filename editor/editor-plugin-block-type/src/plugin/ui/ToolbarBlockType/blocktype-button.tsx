/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { MessageDescriptor, WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage } from 'react-intl-next';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { expandIconContainerStyle, wrapperStyle } from '@atlaskit/editor-common/styles';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import TextStyleIcon from '@atlaskit/icon/core/migration/text-style--editor-text-style';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';

import { NORMAL_TEXT } from '../../block-types';

import { buttonContentReducedSpacingStyle, buttonContentStyle, wrapperSmallStyle } from './styled';

export interface BlockTypeButtonProps {
	isSmall?: boolean;
	isReducedSpacing?: boolean;
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	selected: boolean;
	disabled: boolean;
	title: MessageDescriptor;
	onClick(e: React.MouseEvent): void;
	onKeyDown(e: React.KeyboardEvent): void;
	formatMessage: WrappedComponentProps['intl']['formatMessage'];
	blockTypeName?: string;
}

export const BlockTypeButton = (props: BlockTypeButtonProps) => {
	const blockTypeName = props.blockTypeName || '';
	const labelTextStyles = props.formatMessage(toolbarMessages.textStyles, {
		blockTypeName,
	});

	const toolipTextStyles = props.formatMessage(toolbarMessages.textStylesTooltip);

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
					{
						<React.Fragment>
							{props.isSmall && (
								<TextStyleIcon label={labelTextStyles} spacing="spacious" color="currentColor" />
							)}
							<span
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								css={expandIconContainerStyle}
							>
								<ChevronDownIcon label="" color="currentColor" LEGACY_margin="0 0 0 -8px" />
							</span>
						</React.Fragment>
					}
				</span>
			}
		>
			{!props.isSmall && (
				<span
					css={[
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						buttonContentStyle,
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						props.isReducedSpacing && buttonContentReducedSpacingStyle,
					]}
				>
					<FormattedMessage {...(props.title || NORMAL_TEXT.title)} />
				</span>
			)}
		</ToolbarButton>
	);
};
