import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { DN30, DN900, N30 } from '@atlaskit/theme/colors';
import { Wrapper as WrapperDefault, padding } from '../styles';

const dataConsumerSelector = '[data-mark-type="dataConsumer"]';
export const widerLayoutClassName = 'wider-layout';

export const Wrapper = styled(WrapperDefault)<{ extensionWidth: String }>`
  cursor: pointer;
  width: 100%;

  .extension-overflow-wrapper:not(.with-body) {
    overflow-x: auto;
  }

  /* extension container breakout, only works on top level*/
  .ProseMirror
    > ${dataConsumerSelector}
    > [extensiontype]
    &.${widerLayoutClassName},
    .ProseMirror
    > [extensiontype]
    &.${widerLayoutClassName} {
    width: ${({ extensionWidth }) => `${extensionWidth}`};
    margin-left: 50%;
    transform: translateX(-50%);
  }
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
