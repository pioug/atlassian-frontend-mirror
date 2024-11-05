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
import TextIcon from '@atlaskit/icon/core/text';
import { default as TextStyleIconLegacy } from '@atlaskit/icon/glyph/editor/text-style';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { NORMAL_TEXT } from '../../block-types';

import { wrapperSmallStyle } from './styled';

const buttonContentStyle = xcss({
	minWidth: `calc(80px + 2*${token('space.075')})`,
	overflow: 'hidden',
	padding: 'space.075',
});

const buttonContentReducedSpacingStyle = xcss({
	padding: 'space.100',
	minWidth: `calc(80px + 2*${token('space.100')})`,
});

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
								<TextIcon
									label={labelTextStyles}
									spacing="spacious"
									color="currentColor"
									LEGACY_fallbackIcon={TextStyleIconLegacy}
								/>
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
				<Box
					xcss={[buttonContentStyle, props.isReducedSpacing && buttonContentReducedSpacingStyle]}
				>
					<FormattedMessage {...(props.title || NORMAL_TEXT.title)} />
				</Box>
			)}
		</ToolbarButton>
	);
};
