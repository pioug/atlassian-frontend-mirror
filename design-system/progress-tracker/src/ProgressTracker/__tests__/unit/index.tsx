import React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';
import { ThemeProvider } from 'styled-components';

import { Grid } from '@atlaskit/page';

import { ProgressTracker, Stages } from '../../../index';
import ProgressTrackerStage, {
  ProgressTrackerStageProps,
} from '../../../ProgressTrackerStage';
import { ProgressTrackerContainer } from '../../styled';

const items: Stages = [
  {
    id: '1',
    label: 'Step 1',
    percentageComplete: 0,
    href: '#',
    status: 'current',
  },
  {
    id: '2',
    label: 'Step 2',
    percentageComplete: 0,
    href: '#',
    status: 'unvisited',
  },
  {
    id: '3',
    label: 'Step 3',
    percentageComplete: 0,
    href: '#',
    status: 'unvisited',
  },
  {
    id: '4',
    label: 'Step 4',
    percentageComplete: 0,
    href: '#',
    status: 'unvisited',
  },
  {
    id: '5',
    label: 'Step 5',
    percentageComplete: 0,
    href: '#',
    status: 'unvisited',
  },
  {
    id: '6',
    label: 'Step 6',
    percentageComplete: 0,
    href: '#',
    status: 'unvisited',
  },
];

const completedStages: Stages = [
  {
    id: '1',
    label: 'Step 1',
    percentageComplete: 100,
    href: '#',
    status: 'current',
  },
  {
    id: '2',
    label: 'Step 2',
    percentageComplete: 100,
    href: '#',
    status: 'unvisited',
  },
  {
    id: '3',
    label: 'Step 3',
    percentageComplete: 100,
    href: '#',
    status: 'unvisited',
  },
  {
    id: '4',
    label: 'Step 4',
    percentageComplete: 100,
    href: '#',
    status: 'unvisited',
  },
  {
    id: '5',
    label: 'Step 5',
    percentageComplete: 100,
    href: '#',
    status: 'unvisited',
  },
  {
    id: '6',
    label: 'Step 6',
    percentageComplete: 100,
    href: '#',
    status: 'unvisited',
  },
];

const testBackwardsRenderTransitions = (
  progressTrackerStages: ShallowWrapper<ProgressTrackerStageProps>,
) => {
  progressTrackerStages.forEach((stage, index) => {
    expect(stage.props().transitionDelay).toBe(
      (progressTrackerStages.length - 1 - index) * 50,
    );
  });
};

const testMultiStepRenderTransitions = (
  progressTrackerStages: ShallowWrapper<ProgressTrackerStageProps>,
) => {
  progressTrackerStages.forEach((stage, index) => {
    expect(stage.props().transitionDelay).toBe(index * 50);
    expect(stage.props().transitionEasing).toBe('linear');
  });
};

const testNoOrSingleStepRenderTransitions = (
  progressTrackerStages: ShallowWrapper<ProgressTrackerStageProps>,
) => {
  progressTrackerStages.forEach((stage) => {
    expect(stage.props().transitionDelay).toBe(0);
    expect(stage.props().transitionEasing).toBe('cubic-bezier(0.15,1,0.3,1)');
  });
};

describe('ak-progress-tracker/progress-tracker', () => {
  it('should render the component', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    expect(wrapper.length).toBeGreaterThan(0);
    expect(wrapper.find(ProgressTrackerContainer)).toHaveLength(1);
    expect(wrapper.find(Grid)).toHaveLength(1);
    expect(wrapper.find(ThemeProvider)).toHaveLength(1);
    expect(wrapper.find(ProgressTrackerStage)).toHaveLength(6);
  });

  it('should create default theme correctly', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    expect(wrapper.find(ThemeProvider).props().theme).toMatchObject({
      spacing: 'cosy',
      columns: 12,
    });
  });

  it('should set initial transition', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    const progressTrackerStages = wrapper.find(ProgressTrackerStage);
    testNoOrSingleStepRenderTransitions(progressTrackerStages);
  });

  it('should set backwards transition', () => {
    const wrapper = shallow(<ProgressTracker items={completedStages} />);
    wrapper.setProps({ items });
    const progressTrackerStages = wrapper.find(ProgressTrackerStage);
    testBackwardsRenderTransitions(progressTrackerStages);
  });

  it('should set multistep transition on first render', () => {
    const wrapper = shallow(<ProgressTracker items={completedStages} />);
    const progressTrackerStages = wrapper.find(ProgressTrackerStage);
    testMultiStepRenderTransitions(progressTrackerStages);
  });

  it('should set multistep transition when multiple stages are completed', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    wrapper.setProps({ items: completedStages });
    const progressTrackerStages = wrapper.find(ProgressTrackerStage);
    testMultiStepRenderTransitions(progressTrackerStages);
  });

  it('should set single step transitions', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    const changedStages = items.map((stage) => {
      if (stage.id === '1') {
        return {
          id: '1',
          label: 'Step 1',
          percentageComplete: 50,
          href: '#',
          status: 'current',
        };
      }
      return stage;
    });
    wrapper.setProps({ changedStages });
    const progressTrackerStages = wrapper.find(ProgressTrackerStage);
    testNoOrSingleStepRenderTransitions(progressTrackerStages);
  });

  it('should adapt to having a stage added', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    expect(wrapper.find(ProgressTrackerStage)).toHaveLength(6);

    const newItems = items.map((oldStage) => {
      return {
        ...oldStage,
        percentageComplete: 100,
      };
    });

    newItems.push({
      id: '7',
      label: 'Step 7',
      percentageComplete: 0,
      href: '#',
      status: 'unvisited',
    });

    wrapper.setProps({ items: newItems });
    expect(wrapper.find(ProgressTrackerStage)).toHaveLength(newItems.length);
  });

  it('should adapt to having a stage removed', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    expect(wrapper.find(ProgressTrackerStage)).toHaveLength(6);

    const newItems = items.slice(0, 4);

    wrapper.setProps({ items: newItems });
    expect(wrapper.find(ProgressTrackerStage)).toHaveLength(newItems.length);
  });
});
