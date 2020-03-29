import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';
import * as colors from '@atlaskit/theme/colors';
import { GridColumn } from '@atlaskit/page';
import {
  ProgressTrackerStageContainer,
  ProgressTrackerStageMarker,
  ProgressTrackerStageBar,
  ProgressTrackerStageTitle,
} from './styled';
import { Stage, StatusType, ProgressTrackerStageRenderProp } from '../types';

const semibold = '600';
const regular = '400';
const getMarkerColor = (status: StatusType) => {
  switch (status) {
    case 'unvisited':
      return colors.N70;
    case 'current':
    case 'visited':
    case 'disabled':
      return colors.B300;
    default:
      return;
  }
};

const getTextColor = (status: StatusType) => {
  switch (status) {
    case 'unvisited':
      return colors.N300;
    case 'current':
      return colors.B300;
    case 'visited':
      return colors.N800;
    case 'disabled':
      return colors.N70;
    default:
      return;
  }
};

const getFontWeight = (status: StatusType) => {
  switch (status) {
    case 'unvisited':
      return regular;
    case 'current':
    case 'visited':
    case 'disabled':
      return semibold;
    default:
      return;
  }
};

export interface ProgressTrackerStageProps {
  /** stage data passed to each `ProgressTrackerStage` component */
  item: Stage;
  /** render prop to specify how to render components */
  render: ProgressTrackerStageRenderProp;
  /** delay before transitioning in ms */
  transitionDelay: number;
  /** speed at which to transition in ms */
  transitionSpeed: number;
  /** interface of easing for transition */
  transitionEasing: string;
}

interface State {
  transitioning: boolean;
  oldMarkerColor?: string;
  oldPercentageComplete: number;
}

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

  render() {
    const {
      item,
      render,
      transitionDelay,
      transitionSpeed,
      transitionEasing,
    } = this.props;

    const onEntered = () => {
      this.setState({
        transitioning: false,
        oldMarkerColor: getMarkerColor(item.status),
        oldPercentageComplete: item.percentageComplete,
      });
    };

    return (
      <GridColumn medium={2}>
        <ProgressTrackerStageContainer>
          <CSSTransition
            appear
            in={this.state.transitioning}
            onEntered={onEntered}
            timeout={transitionDelay + transitionSpeed}
            classNames="fade"
          >
            <ProgressTrackerStageMarker
              oldMarkerColor={this.state.oldMarkerColor}
              color={getMarkerColor(item.status)}
              transitionSpeed={transitionSpeed}
              transitionDelay={transitionDelay}
              transitionEasing={transitionEasing}
            />
          </CSSTransition>
          <CSSTransition
            appear
            in={this.state.transitioning}
            onEntered={onEntered}
            timeout={transitionDelay + transitionSpeed}
            classNames="fade"
          >
            <ProgressTrackerStageBar
              oldPercentageComplete={this.state.oldPercentageComplete}
              percentageComplete={item.percentageComplete}
              transitionSpeed={transitionSpeed}
              transitionDelay={transitionDelay}
              transitionEasing={transitionEasing}
            />
          </CSSTransition>
          <CSSTransition
            appear
            in={this.state.transitioning}
            onEntered={onEntered}
            timeout={transitionDelay + transitionSpeed}
            classNames="fade"
          >
            <ProgressTrackerStageTitle
              color={getTextColor(item.status)}
              fontweight={getFontWeight(item.status)}
              transitionSpeed={transitionSpeed}
              transitionDelay={transitionDelay}
            >
              {this.shouldShowLink() ? render.link({ item }) : item.label}
            </ProgressTrackerStageTitle>
          </CSSTransition>
        </ProgressTrackerStageContainer>
      </GridColumn>
    );
  }
}
