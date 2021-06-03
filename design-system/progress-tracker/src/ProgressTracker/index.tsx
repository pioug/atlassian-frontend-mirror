import React, { PureComponent } from 'react';

import { ThemeProvider } from 'styled-components';

import { Grid } from '@atlaskit/page';

import ProgressTrackerLink from '../ProgressTrackerLink';
import ProgressTrackerStage from '../ProgressTrackerStage';
import {
  LinkComponentProps,
  ProgressTrackerStageRenderProp,
  Spacing,
  Stages,
} from '../types';

import { ProgressTrackerContainer } from './styled';

export interface ProgressTrackerProps {
  /** Ordered list of stage data */
  items: Stages;
  /** Margin spacing type between steps */
  spacing: Spacing;
  /** Render prop to specify custom implementations of components */
  render: ProgressTrackerStageRenderProp;
  /** Turns off transition animations if set to false */
  animated: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /** Text to be used as an aria-label of progress tracker */
  label?: string;
}

interface State {
  prevStages: Stages;
}

const TRANSITION_SPEED = 300;
const LINEAR_TRANSITION_SPEED = 50;
const easeOut = 'cubic-bezier(0.15,1,0.3,1)';
const defaultLabel = 'Progress';

export default class ProgressTracker extends PureComponent<
  ProgressTrackerProps,
  State
> {
  static defaultProps = {
    items: [],
    spacing: 'cosy',
    render: {
      link: (props: LinkComponentProps) => <ProgressTrackerLink {...props} />,
    },
    animated: true,
    label: defaultLabel,
  };

  createTheme = () => ({
    spacing: this.props.spacing,
    columns: this.props.items.length * 2,
  });

  state = {
    prevStages: this.props.items.map((stage, index) => ({
      ...stage,
      percentageComplete: 0,
    })),
  };

  UNSAFE_componentWillReceiveProps(nextProps: ProgressTrackerProps) {
    const prevStages = nextProps.items.map((stage) => {
      const oldStage = this.props.items.find((st) => st.id === stage.id);
      return oldStage !== undefined ? oldStage : stage;
    });

    this.setState({
      prevStages,
    });
  }

  render() {
    const { testId, label } = this.props;
    const progressChanges = this.props.items.filter(
      (stage, index) =>
        stage.percentageComplete !==
        this.state.prevStages[index].percentageComplete,
    ).length;
    const totalStepsForward = this.props.items.filter(
      (stage, index) =>
        stage.percentageComplete >
        this.state.prevStages[index].percentageComplete,
    ).length;
    const totalStepsBack = this.props.items.filter(
      (stage, index) =>
        stage.percentageComplete <
        this.state.prevStages[index].percentageComplete,
    ).length;
    let stepsForward = totalStepsForward;
    let stepsBack = totalStepsBack;
    const items = this.props.items.map((stage, index) => {
      let transitionSpeed = 0;
      let transitionDelay = 0;
      const transitionEasing = progressChanges > 1 ? 'linear' : easeOut;
      if (this.props.animated) {
        transitionSpeed =
          progressChanges > 1 ? LINEAR_TRANSITION_SPEED : TRANSITION_SPEED;
        if (
          stage.percentageComplete <
          this.state.prevStages[index].percentageComplete
        ) {
          /** load each transition sequentially in reverse */
          transitionDelay = (stepsBack - 1) * transitionSpeed;
          stepsBack -= 1;
        } else if (
          stage.percentageComplete >
          this.state.prevStages[index].percentageComplete
        ) {
          /** load each transition sequentially */
          transitionDelay =
            (totalStepsForward - stepsForward) * transitionSpeed;
          stepsForward -= 1;
        }
      }

      return (
        <ProgressTrackerStage
          key={stage.id}
          item={stage}
          render={this.props.render}
          transitionSpeed={transitionSpeed}
          transitionDelay={transitionDelay}
          transitionEasing={transitionEasing}
        />
      );
    });

    return (
      <ThemeProvider theme={this.createTheme()}>
        <Grid testId={testId}>
          <ProgressTrackerContainer aria-label={label}>
            {items}
          </ProgressTrackerContainer>
        </Grid>
      </ThemeProvider>
    );
  }
}
