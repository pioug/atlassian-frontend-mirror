import { css } from '@emotion/react';

import { ThemeProps } from '@atlaskit/theme/types';

import { codeMarkSharedStyles } from '@atlaskit/editor-common/styles';

export const textFormattingStyles = (props: ThemeProps) => css`
  ${codeMarkSharedStyles(props)}
`;
