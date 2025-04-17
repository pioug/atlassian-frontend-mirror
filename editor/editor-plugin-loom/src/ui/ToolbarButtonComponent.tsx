/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import VideoIcon from '@atlaskit/icon/core/video';
import { token } from '@atlaskit/tokens';

import type { LoomPlugin } from '../loomPluginType';
import { type ButtonComponentProps } from '../types';

// This const is derived from the breakpoint where the toolbar hides its icons. It is used to hide the text in the AI button.
// Derived from values from platform/packages/editor/editor-core/src/ui/Appearance/FullPage/MainToolbar.tsx
const LOOM_BUTTON_WIDTH_BREAKPOINT = 1076;
interface Props extends Omit<ButtonComponentProps, 'onClickBeforeInit'> {
	disabled: boolean;
	appearance: EditorAppearance;
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
	hideTooltip?: boolean;
}

const iconMinWidthStyle = css({
	minWidth: 24,
});

const LoomToolbarButtonInternal = React.forwardRef<HTMLElement, Props & WrappedComponentProps>(
	(
		{
			disabled,
			api,
			appearance,
			intl: { formatMessage },
			selected,
			onBlur,
			onFocus,
			onKeyDown,
			onMouseEnter,
			onMouseLeave,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHasPopup,
			'data-ds--level': dataDsLevel,
			onClick,
			href,
			target,
			hideTooltip,
			rel,
		},
		ref,
	) => {
		const { widthState } = useSharedPluginState(api, ['loom', 'width']);
		const label = formatMessage(
			appearance === 'comment'
				? toolbarInsertBlockMessages.addLoomVideoComment
				: toolbarInsertBlockMessages.addLoomVideo,
		);
		const shouldShowRecordText = (widthState?.width || 0) > LOOM_BUTTON_WIDTH_BREAKPOINT;

		return (
			<ToolbarButton
				hideTooltip={hideTooltip}
				ref={ref}
				href={href}
				buttonId={TOOLBAR_BUTTON.RECORD_VIDEO}
				disabled={disabled}
				title={label}
				iconBefore={
					<span css={iconMinWidthStyle}>
						<VideoIcon
							label={label}
							color={disabled ? token('color.icon.disabled') : token('color.icon.subtle')}
							spacing="spacious"
						/>
					</span>
				}
				selected={selected}
				onBlur={onBlur}
				onFocus={onFocus}
				onKeyDown={onKeyDown}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				aria-controls={ariaControls}
				aria-expanded={ariaExpanded}
				aria-haspopup={ariaHasPopup}
				data-ds--level={dataDsLevel}
				onClick={onClick}
				target={target}
				rel={rel}
			>
				{shouldShowRecordText && formatMessage(toolbarInsertBlockMessages.recordLoomShortTitle)}
			</ToolbarButton>
		);
	},
);

export default injectIntl(LoomToolbarButtonInternal, { forwardRef: true });
