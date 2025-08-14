/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { MessageDescriptor, WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage } from 'react-intl-next';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { expandIconContainerStyle, wrapperStyle } from '@atlaskit/editor-common/styles';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import TextIcon from '@atlaskit/icon/core/text';
import { default as TextStyleIconLegacy } from '@atlaskit/icon/glyph/editor/text-style';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
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
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onClick(e: React.MouseEvent): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onKeyDown(e: React.KeyboardEvent): void;
	formatMessage: WrappedComponentProps['intl']['formatMessage'];
	blockTypeName?: string;
	blockTypeIcon?: ReactElement;
}

export const BlockTypeButton = (props: BlockTypeButtonProps) => {
	const blockTypeName = props.blockTypeName || '';
	const labelTextStyles = props.formatMessage(toolbarMessages.textStyles, {
		blockTypeName,
	});

	const toolipTextStyles = props.formatMessage(toolbarMessages.textStylesTooltip);

	const icon =
		expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') &&
		props.blockTypeIcon ? (
			props.blockTypeIcon
		) : (
			<TextIcon
				label={labelTextStyles}
				spacing="spacious"
				color="currentColor"
				LEGACY_fallbackIcon={TextStyleIconLegacy}
			/>
		);

	const chevronIconSpacing = expValEqualsNoExposure(
		'platform_editor_controls',
		'cohort',
		'variant1',
	)
		? 'spacious'
		: 'none';

	const shouldUseIconAsButton =
		props.isSmall || expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1');

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
							{shouldUseIconAsButton && icon}
							<span
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								css={expandIconContainerStyle}
							>
								<ChevronDownIcon
									spacing={chevronIconSpacing}
									label=""
									color="currentColor"
									LEGACY_margin="0 0 0 -8px"
									size="small"
								/>
							</span>
						</React.Fragment>
					}
				</span>
			}
		>
			{!shouldUseIconAsButton && (
				<Box
					xcss={[buttonContentStyle, props.isReducedSpacing && buttonContentReducedSpacingStyle]}
				>
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...(props.title || NORMAL_TEXT.title)}
					/>
				</Box>
			)}
		</ToolbarButton>
	);
};
