import { css } from 'styled-components';

import { Y300, Y75 } from '@atlaskit/theme/colors';

export const annotationPrefix = 'ak-editor-annotation';
export const AnnotationSharedClassNames = {
  focus: `${annotationPrefix}-focus`,
  blur: `${annotationPrefix}-blur`,
  draft: `${annotationPrefix}-draft`,
};

export const AnnotationSharedCSSByState = {
  focus: css`
    background: ${Y75};
    border-bottom: 2px solid ${Y300};
    cursor: pointer;
  `,
  blur: css`
    background: rgba(255, 240, 179, 0.5); // Y75
    border-bottom: 2px solid rgba(255, 196, 0, 0.82); // Y200
    cursor: pointer;
  `,
};

export const annotationSharedStyles = css`
  .ProseMirror {
    .${AnnotationSharedClassNames.focus} {
      ${AnnotationSharedCSSByState.focus};
    }

    .${AnnotationSharedClassNames.draft} {
      ${AnnotationSharedCSSByState.focus};
      cursor: initial;
    }

    .${AnnotationSharedClassNames.blur} {
      ${AnnotationSharedCSSByState.blur};
    }
  }
`;
