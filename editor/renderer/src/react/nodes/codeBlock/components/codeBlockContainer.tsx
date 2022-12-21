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
import { token } from '@atlaskit/tokens';

// TODO: Quality ticket https://product-fabric.atlassian.net/browse/DSP-4118
const codeBlockStyleOverrides = (props?: ThemeProps) =>
  css`
    tab-size: 4;
    background-color: ${themed({
      light: token('elevation.surface.raised', N20),
      dark: token('elevation.surface.raised', DN50),
    })(props)};

    ${CodeBlockSharedCssClassName.DS_CODEBLOCK} {
      font-size: ${relativeFontSizeToBase16(fontSize())};
      line-height: 1.5rem;
      background-image: ${overflowShadow({
        background: themed({
          light: token('color.background.neutral', N20),
          dark: token('color.background.neutral', DN50),
        })(props),
        width: `${gridSize()}px`,
      })};
      background-attachment: local, local, local, local, scroll, scroll;
      background-position: 0 0, 0 0, 100% 0, 100% 0, 100% 0, 0 0;
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
