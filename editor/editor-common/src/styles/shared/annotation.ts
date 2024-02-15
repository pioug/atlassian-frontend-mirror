import { css } from '@emotion/react';

import { N60A, Y300, Y75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const annotationPrefix = 'ak-editor-annotation';
export const AnnotationSharedClassNames = {
  focus: `${annotationPrefix}-focus`,
  blur: `${annotationPrefix}-blur`,
  draft: `${annotationPrefix}-draft`,
};

const Y75a = 'rgba(255, 240, 179, 0.5)';
const Y200a = 'rgba(255, 196, 0, 0.82)';

export const AnnotationSharedCSSByState = () => ({
  focus: css`
    // Background is not coming through in confluence, suspecting to be caused by some specific combination of
    // emotion and token look up

    background: ${token('color.background.accent.yellow.subtler', Y75)};
    border-bottom: 2px solid ${token('color.border.accent.yellow', Y300)};
    // TODO: https://product-fabric.atlassian.net/browse/DSP-4147
    box-shadow: ${token(
      'elevation.shadow.overlay',
      `1px 2px 3px ${N60A}, -1px 2px 3px ${N60A}`,
    )};
    cursor: pointer;
  `,
  blur: css`
    background: ${token('color.background.accent.yellow.subtlest', Y75a)};
    border-bottom: 2px solid ${token('color.border.accent.yellow', Y200a)};
    cursor: pointer;
  `,
});

export const annotationSharedStyles = () => css`
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
