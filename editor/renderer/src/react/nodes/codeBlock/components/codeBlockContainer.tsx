/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import type { ReactNode } from 'react';
import type { CodeBlockButtonContainerProps } from './codeBlockButtonContainer';

import {
  overflowShadow,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { N20, DN50 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { fontSize } from '@atlaskit/theme/constants';
import type { ThemeProps } from '@atlaskit/theme/types';
import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

import { token } from '@atlaskit/tokens';

import CodeBlockButtonContainer from './codeBlockButtonContainer';

const codeBlockStyleOverrides = (props?: ThemeProps) =>
  css`
    tab-size: 4;
    background-color: ${themed({
      light: token('elevation.surface.raised', N20),
      dark: token('elevation.surface.raised', DN50),
    })(props)};

    &:hover {
      button {
        opacity: 1;
      }
    }

    button {
      opacity: 0;
      transition: opacity 0.2s ease 0s;
    }

    ${CodeBlockSharedCssClassName.DS_CODEBLOCK} {
      font-size: ${relativeFontSizeToBase16(fontSize())};
      line-height: 1.5rem;
      background-image: ${overflowShadow({
        background: themed({
          light: token('color.background.neutral', N20),
          dark: token('color.background.neutral', DN50),
        })(props),
        leftCoverWidth: token('space.300', '24px'),
      })};
      background-attachment: local, local, local, local, scroll, scroll, scroll,
        scroll;
      background-position: 0 0, 0 0, 100% 0, 100% 0, 100% 0, 100% 0, 0 0, 0 0;
    }
  `;

interface ContainerProps extends CodeBlockButtonContainerProps {
  children: ReactNode;
  className?: string;
}

const CodeBlockContainer = ({
  allowCopyToClipboard,
  allowWrapCodeBlock,
  children,
  className,
  setWrapLongLines,
  text,
  wrapLongLines,
}: ContainerProps) => {
  return (
    <div className={className} css={codeBlockStyleOverrides}>
      <CodeBlockButtonContainer
        allowCopyToClipboard={allowCopyToClipboard}
        allowWrapCodeBlock={allowWrapCodeBlock}
        setWrapLongLines={setWrapLongLines}
        text={text}
        wrapLongLines={wrapLongLines}
      />
      {children}
    </div>
  );
};

export default CodeBlockContainer;
