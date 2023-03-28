/* eslint-disable @repo/internal/styles/no-nested-styles */
/** @jsx jsx */
import { PureComponent } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { spacing } from './constants';
import {
  ANIMATION_EASE_OUT,
  LINEAR_TRANSITION_SPEED,
  TRANSITION_SPEED,
  varSpacing,
} from './internal/constants';
import Link from './internal/link';
import Stage from './internal/stage';
import type {
  LinkComponentProps,
  ProgressTrackerStageRenderProp,
  Spacing,
  Stages,
} from './types';

const containerStyles = css({
  display: 'grid',
  width: '100%',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  margin: '0 auto',
  padding: token('space.0', '0px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  gap: `var(${varSpacing})`,
  listStyleType: 'none',
  '&&': {
    marginTop: token('space.500', '40px'),
  },
});

export interface ProgressTrackerProps {
  /**
   * Ordered list of stage data
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items: Stages;
  /**
   * Margin spacing type between steps
   */
  spacing: Spacing;
  /**
   * Render prop to specify custom implementations of components
   */
  render: ProgressTrackerStageRenderProp;
  /**
   * Turns off transition animations if set to false
   */
  // eslint-disable-next-line
  animated: boolean;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
  /**
   * Text to be used as an aria-label of progress tracker
   */
  label?: string;
}

interface State {
  prevStages: Stages;
}

export default class ProgressTracker extends PureComponent<
  ProgressTrackerProps,
  State
> {
  static defaultProps = {
    items: [],
    spacing: 'cosy',
    render: {
      link: ({ item }: LinkComponentProps) => <Link {...item} />,
    },
    animated: true,
    label: 'Progress',
  };

  state = {
    prevStages: this.props.items.map((stage) => ({
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
      const transitionEasing =
        progressChanges > 1 ? 'linear' : ANIMATION_EASE_OUT;
      if (this.props.animated) {
        transitionSpeed =
          progressChanges > 1 ? LINEAR_TRANSITION_SPEED : TRANSITION_SPEED;
        if (
          stage.percentageComplete <
          this.state.prevStages[index].percentageComplete
        ) {
          /**
           * load each transition sequentially in reverse
           */
          transitionDelay = (stepsBack - 1) * transitionSpeed;
          stepsBack -= 1;
        } else if (
          stage.percentageComplete >
          this.state.prevStages[index].percentageComplete
        ) {
          /**
           * load each transition sequentially
           */
          transitionDelay =
            (totalStepsForward - stepsForward) * transitionSpeed;
          stepsForward -= 1;
        }
      }

      return (
        <Stage
          transitionSpeed={transitionSpeed}
          transitionDelay={transitionDelay}
          transitionEasing={transitionEasing}
          key={stage.id}
          item={stage}
          render={this.props.render}
        />
      );
    });

    const listInlineStyles = {
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      [varSpacing]: spacing[this.props.spacing],
      maxWidth: 8 * 10 * items.length * 2,
    };

    return (
      <ul
        data-testid={testId}
        style={listInlineStyles}
        css={containerStyles}
        aria-label={label}
      >
        {items}
      </ul>
    );
  }
}
