/** @jsx jsx */
import type { ReactNode } from 'react';
import { jsx, css } from '@emotion/react';

import {
  overflowShadow,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { N20, DN50 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import type { ThemeProps } from '@atlaskit/theme/types';
import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

import CopyButton from '../../codeBlockCopyButton';
import { Props as CodeBlockProps } from '../codeBlock';

// TODO: Quality ticket https://product-fabric.atlassian.net/browse/DSP-4118
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const codeBlockStyleOverrides = (props?: ThemeProps) =>
  css`
    tab-size: 4;
    ${CodeBlockSharedCssClassName.DS_CODEBLOCK} {
      font-size: ${relativeFontSizeToBase16(fontSize())};
      line-height: 1.5rem;
      background-image: ${overflowShadow({
        background: themed({ light: N20, dark: DN50 })(props),
        width: `${gridSize()}px`,
      })};
      background-attachment: local, scroll, scroll;
      background-position: 100% 0, 100% 0, 0 0;
    }
  `;

interface ContainerProps {
  className?: string;
  text: CodeBlockProps['text'];
  children: ReactNode;
  allowCopyToClipboard?: boolean;
}

const CodeBlockContainer = ({
  text,
  className,
  allowCopyToClipboard,
  children,
}: ContainerProps) => {
  return (
    <div className={className} css={codeBlockStyleOverrides}>
      {allowCopyToClipboard ? <CopyButton content={text} /> : null}
      {children}
    </div>
  );
};

export default CodeBlockContainer;
