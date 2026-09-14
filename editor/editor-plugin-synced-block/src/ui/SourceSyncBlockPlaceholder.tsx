/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

// Plugin content components need a global selector because the ProseMirror content is not a child
// of this component. This follows the existing layout placeholder pattern.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, Global, jsx } from '@emotion/react';
import { useIntl } from 'react-intl';

import { placeholderTextMessages } from '@atlaskit/editor-common/messages';
import { BodiedSyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import { token } from '@atlaskit/tokens';

const getSourceSyncBlockPlaceholderStyles = (placeholderText: string) =>
	css({
		// Emptiness is signalled by the node view via the `empty` class, which is derived from the
		// ProseMirror document. Keeping this visual state in CSS means typing, deletion, undo/redo,
		// and remote changes update it without decorations.
		//
		// This deliberately does NOT inspect the rendered DOM shape. The paragraph inside an empty
		// block routinely gains extra children that are not user content — the selection marker's
		// cursor widget (`.ProseMirror-widget`), ProseMirror's `.ProseMirror-separator` hack node,
		// and the `.ProseMirror-trailingBreak`. An earlier `:has(.ProseMirror-trailingBreak:only-child)`
		// form treated those decorations as content and hid the placeholder whenever the user placed
		// a cursor in the block and then blurred the editor. See EDITOR-8327.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`.ProseMirror .${BodiedSyncBlockSharedCssClassName.prefix}.${BodiedSyncBlockSharedCssClassName.empty} .${BodiedSyncBlockSharedCssClassName.content}[contenteditable="true"] > p:only-child`]:
			{
				position: 'relative',

				'&::before': {
					// JSON.stringify produces a quoted and escaped CSS string.
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					content: placeholderText,
					position: 'absolute',
					boxSizing: 'border-box',
					color: token('color.text.subtlest'),
					font: 'inherit',
					insetInlineStart: 0,
					width: '100%',
					overflow: 'hidden',
					pointerEvents: 'none',
					textOverflow: 'ellipsis',
					userSelect: 'none',
					whiteSpace: 'nowrap',
				},
			},
	});

export const SourceSyncBlockPlaceholder = (): JSX.Element => {
	const { formatMessage } = useIntl();
	const placeholderStyles = useMemo(
		() =>
			getSourceSyncBlockPlaceholderStyles(
				JSON.stringify(formatMessage(placeholderTextMessages.sourceSyncBlockPlaceholderText)),
			),
		[formatMessage],
	);

	return <Global styles={placeholderStyles} />;
};
