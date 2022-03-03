import { css } from '@emotion/react';

import { N60A, Y300, Y75 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { ThemeProps } from '@atlaskit/theme/types';

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

export const AnnotationSharedCSSByState = (props: ThemeProps) => ({
  focus: css`
    background: ${themed({ light: Y75, dark: DY75 })(props)};
    border-bottom: 2px solid ${themed({ light: Y300, dark: DY300 })(props)};
    box-shadow: 1px 2px 3px ${N60A}, -1px 2px 3px ${N60A};
    cursor: pointer;
  `,
  blur: css`
    background: ${themed({ light: Y75a, dark: DY75a })(props)};
    border-bottom: 2px solid ${themed({ light: Y200a, dark: DY200 })(props)};
    cursor: pointer;
  `,
});

export const annotationSharedStyles = (props: ThemeProps) => css`
  .ProseMirror {
    .${AnnotationSharedClassNames.focus} {
      ${AnnotationSharedCSSByState(props).focus};
    }

    .${AnnotationSharedClassNames.draft} {
      ${AnnotationSharedCSSByState(props).focus};
      cursor: initial;
    }

    .${AnnotationSharedClassNames.blur} {
      ${AnnotationSharedCSSByState(props).blur};
    }
  }
`;
