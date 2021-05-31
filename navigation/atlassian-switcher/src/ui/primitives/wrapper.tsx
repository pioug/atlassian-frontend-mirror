import React from 'react';
import styled from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize, colors } from '@atlaskit/theme';
import ManageButton from './manage-button';
import { Appearance } from '../theme/types';

const Wrapper = styled.div<{ appearance?: Appearance }>`
  box-sizing: border-box;
  height: 100%;
  ${({ appearance }) =>
    appearance === 'drawer' && `padding-right: ${gridSize() * 4}px;`};
  ${({ appearance }) => appearance === 'drawer' && `padding-top: 5px;`};
`;

const Body = styled.div`
  min-width: 280px;
  min-height: calc(100% - 7.5 * ${gridSize}px);
`;
const Footer = styled.footer`
  border-top: 1px solid ${colors.N30A};
  padding: ${1.5 * gridSize()}px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: sticky;
  bottom: 0;
  background-color: ${colors.N0};
`;

type SwitcherWrapperProps = {
  children: React.ReactNode;
  onRender?: () => void;
  appearance?: Appearance;
};

class SwitcherWrapper extends React.Component<SwitcherWrapperProps> {
  render() {
    const { appearance, children } = this.props;

    const manageButton = React.Children.toArray(children).filter(
      (child) =>
        React.isValidElement(child) &&
        React.Children.only(child).type === ManageButton,
    );
    const items = React.Children.toArray(children).filter(
      (child) =>
        React.isValidElement(child) &&
        React.Children.only(child).type !== ManageButton,
    );

    return (
      <Wrapper appearance={appearance}>
        <Body>{items}</Body>
        {manageButton.length ? <Footer>{manageButton}</Footer> : null}
      </Wrapper>
    );
  }
}

export default SwitcherWrapper;
