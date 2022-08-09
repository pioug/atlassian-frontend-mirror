import { css } from '@emotion/react';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { DN30, DN900, N30 } from '@atlaskit/theme/colors';
import { wrapperDefault, padding } from '../styles';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const dataConsumerSelector = '[data-mark-type="dataConsumer"]';
export const widerLayoutClassName = 'wider-layout';

export const wrapperStyle = (theme: ThemeProps, extensionWidth: string) => css`
  ${wrapperDefault(theme)}

  &.without-frame {
    background: transparent;
  }
  cursor: pointer;
  width: 100%;

  .extension-overflow-wrapper:not(.with-body) {
    overflow-x: auto;
  }

  /* extension container breakout, only works on top level */
  .ProseMirror
    > ${dataConsumerSelector}
    > [extensiontype]
    &.${widerLayoutClassName},
    .ProseMirror
    > [extensiontype]
    &.${widerLayoutClassName} {
    width: ${extensionWidth};
    margin-left: 50%;
    transform: translateX(-50%);
  }
`;

export const header = css`
  padding: ${padding / 2}px ${padding / 2}px 0px;
  vertical-align: middle;

  &.with-children:not(.without-frame) {
    padding: 4px 8px 8px;
  }
  &.without-frame {
    padding: 0;
  }
`;

export const content = (theme: ThemeProps) => css`
  padding: ${padding}px;
  background: ${themed({
    light: token('elevation.surface', 'white'),
    dark: token('elevation.surface', DN30),
  })(theme)};
  color: ${themed({
    dark: token('color.text', DN900),
  })(theme)};
  border: 1px solid ${token('color.border', N30)};
  border-radius: ${borderRadius()}px;
  cursor: initial;
`;

export const contentWrapper = css`
  padding: 0 ${padding}px ${padding}px;
`;
