/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled
import { css, Global, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { layoutMessages as messages } from '@atlaskit/editor-common/messages';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

const getPlaceholderStyle = (message: string) => {
	if (editorExperiment('platform_editor_controls', 'variant1')) {
		return css({
			// when paragraph is the only child, and it only has a trailingBreak.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'.ProseMirror .layoutSectionView-content-wrap.selected [data-layout-column] > [data-layout-content] > p:only-child:has(.ProseMirror-trailingBreak:only-child)':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
					'&::before': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
						content: `"${message}"`,
						position: 'absolute',
						color: token('color.text.subtlest'),
						pointerEvents: 'none',
					},
				},
		});
	}

	if (fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
		return css({
			// when paragraph is the only child, and it only has a trailingBreak.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'.ProseMirror .layoutSectionView-content-wrap.selected [data-layout-column] > [data-layout-content] > p:only-child:has(.ProseMirror-trailingBreak:only-child)':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
					'&::before': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
						content: `"${message}"`,
						position: 'absolute',
						color: token('color.text.disabled', '#A5ADBA'),
						font: token('font.body'),
						marginTop: token('space.050', '4px'),
						pointerEvents: 'none',
					},
				},
		});
	}

	return css({
		// when paragraph is the only child, and it only has a trailingBreak.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'.ProseMirror [data-layout-column] > [data-layout-content] > p:only-child:has(.ProseMirror-trailingBreak:only-child)':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				'&::before': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					content: `"${message}"`,
					position: 'absolute',
					color: token('color.text.disabled', '#A5ADBA'),
					font: token('font.body'),
					marginTop: token('space.050', '4px'),
					pointerEvents: 'none',
				},
			},
	});
};

export const GlobalStylesWrapper = () => {
	const { formatMessage } = useIntl();
	const placeholderStyle = useMemo(() => {
		const placeholderText = editorExperiment('platform_editor_controls', 'variant1')
			? messages.controlslayoutPlaceholder
			: messages.layoutPlaceholder;
		return getPlaceholderStyle(formatMessage(placeholderText));
	}, [formatMessage]);

	return <Global styles={placeholderStyle} />;
};
