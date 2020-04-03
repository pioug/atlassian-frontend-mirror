import styled from 'styled-components';
import { colors, borderRadius, themed } from '@atlaskit/theme';
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
`;

export const Header = styled.div`
  cursor: pointer;
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
    dark: colors.DN30,
  })};
  color: ${themed({
    dark: colors.DN900,
  })};
  border: 1px solid ${colors.N30};
  border-radius: ${borderRadius()}px;
`;

export const ContentWrapper = styled.div`
  padding: 0 ${padding}px ${padding}px;
`;
