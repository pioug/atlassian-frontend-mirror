// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { AnnotationSharedClassNames } from '@atlaskit/editor-common/styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const annotationStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${AnnotationSharedClassNames.blur}, .${AnnotationSharedClassNames.focus}, .${AnnotationSharedClassNames.draft}, .${AnnotationSharedClassNames.hover}`]:
			{
				borderBottom: '2px solid transparent',
				cursor: 'pointer',
				padding: '1px 0 2px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:has(.card), &:has([data-inline-card])': {
					padding: '5px 0 3px 0',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:has(.date-lozenger-container)': {
					paddingTop: token('space.025', '2px'),
				},
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${AnnotationSharedClassNames.focus}`]: {
			background: token('color.background.accent.yellow.subtlest.pressed'),
			borderBottomColor: token('color.border.accent.yellow'),
			boxShadow: token('elevation.shadow.raised'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${AnnotationSharedClassNames.draft}`]: {
			background: token('color.background.accent.yellow.subtlest.pressed'),
			borderBottomColor: token('color.border.accent.yellow'),
			boxShadow: token('elevation.shadow.raised'),
			cursor: 'initial',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${AnnotationSharedClassNames.blur}`]: {
			background: token('color.background.accent.yellow.subtlest'),
			borderBottomColor: token('color.border.accent.yellow'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${AnnotationSharedClassNames.hover}`]: {
			background: token('color.background.accent.yellow.subtlest.hovered'),
			borderBottomColor: token('color.border.accent.yellow'),
			boxShadow: token('elevation.shadow.raised'),
		},
	},
});
