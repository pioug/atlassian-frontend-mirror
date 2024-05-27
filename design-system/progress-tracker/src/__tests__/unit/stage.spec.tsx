import React from 'react';

import { render as renderFn, screen } from '@testing-library/react';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { varBackgroundColor } from '../../internal/constants';
import ProgressTrackerLink from '../../internal/link';
import ProgressTrackerStage from '../../internal/stage';
import { type LinkComponentProps, type Stage } from '../../types';

const defaultTestId = 'test';

describe('@atlaskit/progress-tracker/stage', () => {
  it('should render the component', () => {
    const item: Stage = {
      id: 'visited-1',
      label: 'Visited Step',
      percentageComplete: 100,
      status: 'visited',
      href: '#',
    };
    const render = {
      link: ({ item }: LinkComponentProps) => <ProgressTrackerLink {...item} />,
    };

    renderFn(
      <ProgressTrackerStage
        item={item}
        render={render}
        transitionDelay={0}
        transitionSpeed={0}
        transitionEasing="linear"
        testId={defaultTestId}
      />,
    );

    expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();
    expect(screen.getByTestId(`${defaultTestId}-bar`)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  //Appearance
  it('should render unvisited stage with correct state', () => {
    const percentageComplete = 0;
    const item: Stage = {
      id: 'unvisited-1',
      label: 'Unvisited Step',
      percentageComplete,
      status: 'unvisited',
      href: '#',
    } as const;
    const render = {
      link: ({ item }: LinkComponentProps) => <ProgressTrackerLink {...item} />,
    };

    renderFn(
      <ProgressTrackerStage
        item={item}
        testId={defaultTestId}
        render={render}
        transitionDelay={0}
        transitionSpeed={0}
        transitionEasing="linear"
      />,
    );

    const baseElement = screen.getByTestId(defaultTestId);
    const marker = screen.getByTestId(`${defaultTestId}-marker`);
    const title = screen.getByTestId(`${defaultTestId}-title`);

    // get root styles
    const styles = getComputedStyle(baseElement);
    expect(styles.getPropertyValue(varBackgroundColor)).toEqual(
      token('color.icon.subtle', colors.N70),
    );
    expect(marker).toHaveStyleDeclaration(
      'background-color',
      `var(${varBackgroundColor})`,
    );

    expect(title).toHaveStyle(
      `color: ${token('color.text.subtle', colors.N300)}`,
    );
  });

  it('should render current stage with correct state', () => {
    const percentageComplete = 0;
    const item: Stage = {
      id: 'current-1',
      label: 'Current Step',
      percentageComplete,
      status: 'current',
      href: '#',
    } as const;
    const render = {
      link: ({ item }: LinkComponentProps) => <ProgressTrackerLink {...item} />,
    };

    const { getByTestId } = renderFn(
      <ProgressTrackerStage
        item={item}
        testId={defaultTestId}
        render={render}
        transitionDelay={0}
        transitionSpeed={0}
        transitionEasing="linear"
      />,
    );

    const baseElement = getByTestId(defaultTestId);
    const marker = getByTestId(`${defaultTestId}-marker`);
    const title = getByTestId(`${defaultTestId}-title`);

    // get root styles
    const styles = getComputedStyle(baseElement);
    expect(styles.getPropertyValue(varBackgroundColor)).toEqual(
      token('color.icon.brand', colors.B300),
    );
    expect(marker).toHaveStyleDeclaration(
      'background-color',
      `var(${varBackgroundColor})`,
    );

    expect(title).toHaveStyle(
      `color: ${token('color.text.brand', colors.B300)}`,
    );
  });

  it('should render disabled stage with correct state', () => {
    const percentageComplete = 0;
    const item: Stage = {
      id: 'disabled-1',
      label: 'Disabled Step',
      percentageComplete,
      status: 'disabled',
      href: '#',
    } as const;
    const render = {
      link: ({ item }: LinkComponentProps) => <ProgressTrackerLink {...item} />,
    };

    const { getByTestId } = renderFn(
      <ProgressTrackerStage
        item={item}
        testId={defaultTestId}
        render={render}
        transitionDelay={0}
        transitionSpeed={0}
        transitionEasing="linear"
      />,
    );

    const baseElement = getByTestId(defaultTestId);
    const marker = getByTestId(`${defaultTestId}-marker`);
    const title = getByTestId(`${defaultTestId}-title`);

    // get root styles
    const styles = getComputedStyle(baseElement);
    expect(styles.getPropertyValue(varBackgroundColor)).toEqual(
      token('color.icon.brand', colors.B300),
    );
    expect(marker).toHaveStyleDeclaration(
      'background-color',
      `var(${varBackgroundColor})`,
    );

    expect(title).toHaveStyle(
      `color: ${token('color.text.disabled', colors.N70)}`,
    );
  });

  it('should render visited stage with default link and correct props', () => {
    const percentageComplete = 100;
    const item: Stage = {
      id: 'visited-1',
      label: 'Visited Step',
      percentageComplete,
      status: 'visited',
      href: '#',
    } as const;
    const render = {
      link: ({ item }: LinkComponentProps) => <ProgressTrackerLink {...item} />,
    };

    const { getByTestId } = renderFn(
      <ProgressTrackerStage
        item={item}
        testId={defaultTestId}
        render={render}
        transitionDelay={0}
        transitionSpeed={0}
        transitionEasing="linear"
      />,
    );

    const baseElement = getByTestId(defaultTestId);
    const marker = getByTestId(`${defaultTestId}-marker`);
    const title = getByTestId(`${defaultTestId}-title`);

    // get root styles
    const styles = getComputedStyle(baseElement);
    expect(styles.getPropertyValue(varBackgroundColor)).toEqual(
      token('color.icon.brand', colors.B300),
    );
    expect(marker).toHaveStyleDeclaration(
      'background-color',
      `var(${varBackgroundColor})`,
    );

    expect(title).toHaveStyle(`color: ${token('color.text', colors.N800)}`);
  });

  it('should render visited stage without link if noLink is true', () => {
    const percentageComplete = 100;
    const item: Stage = {
      id: 'visited-1',
      label: 'Visited Step',
      percentageComplete,
      status: 'visited',
      noLink: true,
    };
    const render = {
      link: ({ item }: LinkComponentProps) => <ProgressTrackerLink {...item} />,
    };

    renderFn(
      <ProgressTrackerStage
        item={item}
        render={render}
        transitionDelay={0}
        transitionSpeed={0}
        transitionEasing="linear"
      />,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
