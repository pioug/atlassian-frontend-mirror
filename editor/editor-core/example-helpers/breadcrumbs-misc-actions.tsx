import React from 'react';
import styled from 'styled-components';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import LabelIcon from '@atlaskit/icon/glyph/label';
import FullWidthToggle from './full-width-toggle';
import { EditorAppearance } from '../src/types';

const BreadcrumbWrapper = styled.div`
  flex: 1 1 80%;
  color: rgb(107, 119, 140);
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Link = styled.a`
  flex: 1 1 80%;
`;

const MiscActionsWrapper = styled.div`
  flex: 1 1 10%;
  align-content: flex-end;
`;

interface Props {
  appearance: EditorAppearance;
  onFullWidthChange: (fullWidthMode: boolean) => void;
}

interface State {
  fullWidthMode: boolean;
}

export default class BreadcrumbsMiscActions extends React.Component<
  Props,
  State
> {
  render() {
    return (
      <Wrapper>
        <Link id="breadcrumb" href="#">
          <BreadcrumbWrapper>Breadcrumbs / Placeholder / ...</BreadcrumbWrapper>
        </Link>
        <MiscActionsWrapper>
          <LabelIcon label="I do nothing" />
          <LockFilledIcon label="I do nothing" primaryColor="#de350b" />
          <FullWidthToggle
            appearance={this.props.appearance}
            onFullWidthChange={this.props.onFullWidthChange}
          />
        </MiscActionsWrapper>
      </Wrapper>
    );
  }
}
