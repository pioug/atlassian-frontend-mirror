import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { DN30, DN900, N30 } from '@atlaskit/theme/colors';
import { Wrapper as WrapperDefault, padding } from '../styles';

export const Wrapper = styled(WrapperDefault)`
  .extension-overflow-wrapper:not(.with-body) {
    overflow-x: auto;
  }

  /* extension container breakout, only works on top level */
  .ProseMirror > [extensiontype] &[data-layout='full-width'],
  .ProseMirror > [extensiontype] &[data-layout='wide'] {
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .ProseMirror > * [extensiontype] &[data-layout='wide'],
  .ProseMirror > * [extensiontype] &[data-layout='wide'] {
    width: 100% !important;
  }
  cursor: pointer;
`;

export const Header = styled.div`
  padding: ${padding / 2}px ${padding / 2}px ${padding / 4}px;
  vertical-align: middle;

  &.with-children {
    padding: 4px 8px 8px;
  }
`;

export const Content = styled.div`
  padding: ${padding}px;
  background: ${themed({
    light: 'white',
    dark: DN30,
  })};
  color: ${themed({
    dark: DN900,
  })};
  border: 1px solid ${N30};
  border-radius: ${borderRadius()}px;
  cursor: initial;
`;

export const ContentWrapper = styled.div`
  padding: 0 ${padding}px ${padding}px;
`;
