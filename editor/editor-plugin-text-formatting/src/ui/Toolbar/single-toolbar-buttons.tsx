/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import {
	buttonGroupStyle,
	buttonGroupStyleBeforeVisualRefresh,
} from '@atlaskit/editor-common/styles';
import type { Command } from '@atlaskit/editor-common/types';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MenuIconItem } from './types';

export const SingleToolbarButtons = React.memo(
	({
		items,
		isReducedSpacing,
		editorView,
		hasMultiplePartsWithFormattingSelected,
	}: {
		items: MenuIconItem[];
		isReducedSpacing: boolean;
		editorView: EditorView;
		hasMultiplePartsWithFormattingSelected?: boolean;
	}) => {
		const onClick = useCallback(
			(command: Command) => {
				return () => {
					command(editorView.state, editorView.dispatch);

					return false;
				};
			},
			[editorView.state, editorView.dispatch],
		);
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<span
				css={
					// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration, @atlaskit/platform/ensure-feature-flag-prefix
					fg('platform-visual-refresh-icons')
						? // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
							buttonGroupStyle
						: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
							buttonGroupStyleBeforeVisualRefresh
				}
			>
				{items.map((item) => (
					<ToolbarButton
						key={item.key}
						testId={`editor-toolbar__${String(item.content)}`}
						buttonId={item.buttonId}
						spacing={isReducedSpacing ? 'none' : 'default'}
						onClick={onClick(item.command)}
						selected={
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							hasMultiplePartsWithFormattingSelected &&
							editorExperiment('platform_editor_controls', 'variant1') &&
							fg('platform_editor_controls_patch_7') &&
							!fg('platform_editor_controls_patch_10')
								? false
								: item.isActive
						}
						disabled={item.isDisabled}
						title={item.tooltipElement}
						iconBefore={item.iconElement}
						aria-pressed={
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							hasMultiplePartsWithFormattingSelected &&
							editorExperiment('platform_editor_controls', 'variant1') &&
							fg('platform_editor_controls_patch_7') &&
							!fg('platform_editor_controls_patch_10')
								? false
								: item.isActive
						}
						aria-label={item['aria-label'] ?? String(item.content)}
						aria-keyshortcuts={item['aria-keyshortcuts']}
					/>
				))}
			</span>
		);
	},
);
