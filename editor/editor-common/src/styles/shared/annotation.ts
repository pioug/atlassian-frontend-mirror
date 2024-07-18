// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { N60A, Y300, Y75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const annotationPrefix = 'ak-editor-annotation';
export const AnnotationSharedClassNames = {
	focus: `${annotationPrefix}-focus`,
	blur: `${annotationPrefix}-blur`,
	draft: `${annotationPrefix}-draft`,
};

export const blockAnnotationPrefix = 'ak-editor-block-annotation';
export const BlockAnnotationSharedClassNames = {
	focus: `${blockAnnotationPrefix}-focus`,
	blur: `${blockAnnotationPrefix}-blur`,
	draft: `${blockAnnotationPrefix}-draft`,
};

const Yellow100 = 'rgb(255, 247, 214)';
const Y200a = 'rgba(255, 196, 0, 0.82)';

export const AnnotationSharedCSSByState = () => {
	if (fg('editor_inline_comments_on_inline_nodes')) {
		// NOTE: These styles are shared between renderer and editor. Sometimes they
		// need different selectors and other times they apply the same attributes
		// in a different way. For example in renderer the focus styles are an
		// override, not a separate class. Be sure to check both usages of this
		// before modifying.
		return {
			common: {
				borderBottom: '2px solid transparent',
				cursor: 'pointer',
				padding: '1px 0 2px',
				'&:has(.card), &:has([data-inline-card])': fg(
					'annotations_align_editor_and_renderer_styles',
				)
					? {
							padding: '5px 0 3px 0',
						}
					: {
							paddingTop: '4px',
							border: 'none',
							boxShadow: `0 2px 0 0 ${token('color.border.accent.yellow', Y200a)}`,
						},
				'&:has(.date-lozenger-container)': {
					paddingTop: '2px',
				},
			},
			focus: css({
				background: token('color.background.accent.yellow.subtler', Y75),
				borderBottomColor: token('color.border.accent.yellow', Y300),
				boxShadow: token('elevation.shadow.overlay', `1px 2px 3px ${N60A}, -1px 2px 3px ${N60A}`),
			}),
			blur: css({
				background: token('color.background.accent.yellow.subtlest', Yellow100),
				borderBottomColor: token('color.border.accent.yellow', Y200a),
			}),
		};
	} else {
		return {
			focus: css({
				// Background is not coming through in confluence, suspecting to be caused by some specific combination of
				// emotion and token look up
				background: token('color.background.accent.yellow.subtler', Y75),
				borderBottom: `2px solid ${token('color.border.accent.yellow', Y300)}`,
				// TODO: https://product-fabric.atlassian.net/browse/DSP-4147
				boxShadow: token('elevation.shadow.overlay', `1px 2px 3px ${N60A}, -1px 2px 3px ${N60A}`),
				cursor: 'pointer',
			}),
			blur: css({
				background: token('color.background.accent.yellow.subtlest', Yellow100),
				borderBottom: `2px solid ${token('color.border.accent.yellow', Y200a)}`,
				cursor: 'pointer',
			}),
		};
	}
};

export const annotationSharedStyles = () =>
	fg('editor_inline_comments_on_inline_nodes')
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- `AnnotationSharedCSSByState()` is not safe in object syntax
			css`
				.ProseMirror {
					.${AnnotationSharedClassNames.blur},
						.${AnnotationSharedClassNames.focus},
						.${AnnotationSharedClassNames.draft} {
						${AnnotationSharedCSSByState().common};
					}

					.${AnnotationSharedClassNames.focus} {
						${AnnotationSharedCSSByState().focus};
					}

					.${AnnotationSharedClassNames.draft} {
						${AnnotationSharedCSSByState().focus};
						cursor: initial;
					}

					.${AnnotationSharedClassNames.blur} {
						${AnnotationSharedCSSByState().blur};
					}
				}
			`
		: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- `AnnotationSharedCSSByState()` is not safe in object syntax
			css`
				.ProseMirror {
					.${AnnotationSharedClassNames.focus} {
						${AnnotationSharedCSSByState().focus};
					}

					.${AnnotationSharedClassNames.draft} {
						${AnnotationSharedCSSByState().focus};
						cursor: initial;
					}

					.${AnnotationSharedClassNames.blur} {
						${AnnotationSharedCSSByState().blur};
					}
				}
			`;
