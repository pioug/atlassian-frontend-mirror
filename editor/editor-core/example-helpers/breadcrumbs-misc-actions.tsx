/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import LabelIcon from '@atlaskit/icon/glyph/label';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { EditorAppearance } from '../src/types';

import FullWidthToggle from './full-width-toggle';

const breadcrumbWrapper = css({
  flex: '1 1 80%',
  color: 'rgb(107, 119, 140)',
});

const wrapper = css({
  display: 'flex',
  alignItems: 'center',
  marginBottom: token('space.300', '24px'),
});

const link = css({
  flex: '1 1 80%',
});

const miscActionsWrapper = css({
  flex: '1 1 10%',
  alignContent: 'flex-end',
});

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
          <LockFilledIcon
            label="I do nothing"
            primaryColor={token('color.icon.accent.red', R400)}
          />
          <FullWidthToggle
            appearance={this.props.appearance}
            onFullWidthChange={this.props.onFullWidthChange}
          />
        </div>
      </div>
    );
  }
}
