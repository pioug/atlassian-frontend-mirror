import { css } from 'styled-components';

import { N60A, Y300, Y75 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

export const annotationPrefix = 'ak-editor-annotation';
export const AnnotationSharedClassNames = {
  focus: `${annotationPrefix}-focus`,
  blur: `${annotationPrefix}-blur`,
  draft: `${annotationPrefix}-draft`,
};

const DY75 = 'rgb(111, 92, 37)';
const DY300 = '#ffd557';

const Y75a = 'rgba(255, 240, 179, 0.5)';
const Y200a = 'rgba(255, 196, 0, 0.82)';

const DY75a = 'rgba(111, 92, 37, 0.5)';
const DY200 = '#82641c';

export const AnnotationSharedCSSByState = {
  focus: css`
    background: ${themed({ light: Y75, dark: DY75 })};
    border-bottom: 2px solid ${themed({ light: Y300, dark: DY300 })};
    box-shadow: 1px 2px 3px ${N60A}, -1px 2px 3px ${N60A};
    cursor: pointer;
  `,
  blur: css`
    background: ${themed({ light: Y75a, dark: DY75a })};
    border-bottom: 2px solid ${themed({ light: Y200a, dark: DY200 })};
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
