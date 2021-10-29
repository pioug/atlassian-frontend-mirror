/* eslint-disable @repo/internal/styles/no-nested-styles */
/** @jsx jsx */
import { CSSProperties, PureComponent } from 'react';

import { css, jsx } from '@emotion/core';
import { CSSTransition } from 'react-transition-group';

import { fontSize } from '@atlaskit/theme/constants';

import ProgressBar from './bar';
import {
  LABEL_TOP_SPACING,
  varBackgroundColor,
  varMarkerColor,
  varTransitionDelay,
  varTransitionEasing,
  varTransitionSpeed,
} from './constants';
import ProgressMarker from './marker';
import type { ProgressTrackerStageProps } from './types';
import { getFontWeight, getMarkerColor, getTextColor } from './utils';

interface State {
  transitioning: boolean;
  oldMarkerColor?: string;
  oldPercentageComplete: number;
}

const containerStyles = css({
  width: '100%',
  position: 'relative',
});

const listItemStyles = css({
  margin: 0,
  overflowWrap: 'break-word',
});

const titleStyles = css({
  marginTop: LABEL_TOP_SPACING,
  marginRight: 'auto',
  marginLeft: 'auto',
  fontSize: fontSize(),
  lineHeight: '16px',
  textAlign: 'center',
  '&.fade-appear': {
    opacity: 0.01,
  },
  '&.fade-appear.fade-appear-active': {
    opacity: 1,
    transition: `opacity var(${varTransitionSpeed}) cubic-bezier(0.2, 0, 0, 1)`,
  },
});

export type { ProgressTrackerStageProps };

export default class ProgressTrackerStage extends PureComponent<
  ProgressTrackerStageProps,
  State
> {
  constructor(props: ProgressTrackerStageProps) {
    super(props);
    this.state = {
      transitioning: false,
      oldMarkerColor: getMarkerColor(this.props.item.status),
      oldPercentageComplete: 0,
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({
      ...this.state,
      transitioning: true,
    });
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      ...this.state,
      transitioning: true,
    });
  }

  shouldShowLink() {
    return this.props.item.status === 'visited' && !this.props.item.noLink;
  }

  onEntered = () => {
    this.setState({
      transitioning: false,
      oldMarkerColor: getMarkerColor(this.props.item.status),
      oldPercentageComplete: this.props.item.percentageComplete,
    });
  };

  render() {
    const {
      item,
      render,
      transitionDelay,
      transitionSpeed,
      transitionEasing,
      testId,
    } = this.props;

    const ariaCurrent = item.status === 'current' ? 'step' : 'false';
    return (
      <li
        data-testid={testId}
        style={
          {
            [varTransitionSpeed]: `${transitionSpeed}ms`,
            [varTransitionDelay]: `${transitionDelay}ms`,
            [varTransitionEasing]: transitionEasing,
            [varMarkerColor]: this.state.oldMarkerColor,
            [varBackgroundColor]: getMarkerColor(item.status),
          } as CSSProperties
        }
        css={listItemStyles}
        aria-current={ariaCurrent}
      >
        <div css={containerStyles}>
          <CSSTransition
            appear
            in={this.state.transitioning}
            onEntered={this.onEntered}
            timeout={transitionDelay + transitionSpeed}
            classNames="fade"
          >
            <ProgressMarker testId={testId && `${testId}-marker`} />
          </CSSTransition>
          <CSSTransition
            appear
            in={this.state.transitioning}
            onEntered={this.onEntered}
            timeout={transitionDelay + transitionSpeed}
            classNames="fade"
          >
            <ProgressBar
              testId={testId && `${testId}-bar`}
              percentageComplete={item.percentageComplete}
            />
          </CSSTransition>
          <CSSTransition
            appear
            in={this.state.transitioning}
            onEntered={this.onEntered}
            timeout={transitionDelay + transitionSpeed}
            classNames="fade"
          >
            <div
              css={titleStyles}
              data-testid={testId && `${testId}-title`}
              style={
                {
                  color: getTextColor(item.status),
                  fontWeight: getFontWeight(item.status),
                } as CSSProperties
              }
            >
              {this.shouldShowLink() ? render.link({ item }) : item.label}
            </div>
          </CSSTransition>
        </div>
      </li>
    );
  }
}
