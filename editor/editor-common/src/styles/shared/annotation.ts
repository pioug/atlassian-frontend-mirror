import { css } from '@emotion/react';

import { N60A, Y300, Y75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { commentStatusStyleMap } from '../../media/styles';

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

const mediaNodeDomRef = 'mediaView-content-wrap';

const Y75a = 'rgba(255, 240, 179, 0.5)';
const Y200a = 'rgba(255, 196, 0, 0.82)';

export const AnnotationSharedCSSByState = () => ({
  focus: css({
    // Background is not coming through in confluence, suspecting to be caused by some specific combination of
    // emotion and token look up
    background: token('color.background.accent.yellow.subtler', Y75),
    borderBottom: `2px solid ${token('color.border.accent.yellow', Y300)}`,
    // TODO: https://product-fabric.atlassian.net/browse/DSP-4147
    boxShadow: token(
      'elevation.shadow.overlay',
      `1px 2px 3px ${N60A}, -1px 2px 3px ${N60A}`,
    ),
    cursor: 'pointer',
  }),
  blur: css({
    background: token('color.background.accent.yellow.subtlest', Y75a),
    borderBottom: `2px solid ${token('color.border.accent.yellow', Y200a)}`,
    cursor: 'pointer',
  }),
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- `AnnotationSharedCSSByState()` is not safe in object syntax
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

    // Styling for comments on media node
    .${mediaNodeDomRef}[class*=ak-editor-block-annotation-] {
      border-radius: 3px;
    }

    .${mediaNodeDomRef}.${BlockAnnotationSharedClassNames.draft} {
      box-shadow: ${commentStatusStyleMap('draft')};
    }

    .${mediaNodeDomRef}.${BlockAnnotationSharedClassNames.focus} {
      box-shadow: ${commentStatusStyleMap('focus')};
    }

    .${mediaNodeDomRef}.${BlockAnnotationSharedClassNames.blur} {
      box-shadow: ${commentStatusStyleMap('blur')};
    }
  }
`;
