/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import LabelIcon from '@atlaskit/icon/glyph/label';
import FullWidthToggle from './full-width-toggle';
import { EditorAppearance } from '../src/types';

const breadcrumbWrapper = css`
  flex: 1 1 80%;
  color: rgb(107, 119, 140);
`;

const wrapper = css`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const link = css`
  flex: 1 1 80%;
`;

const miscActionsWrapper = css`
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
      <div css={wrapper}>
        <a css={link} id="breadcrumb" href="#">
          <div css={breadcrumbWrapper}>Breadcrumbs / Placeholder / ...</div>
        </a>
        <div css={miscActionsWrapper}>
          <LabelIcon label="I do nothing" />
          <LockFilledIcon label="I do nothing" primaryColor="#de350b" />
          <FullWidthToggle
            appearance={this.props.appearance}
            onFullWidthChange={this.props.onFullWidthChange}
          />
        </div>
      </div>
    );
  }
}
