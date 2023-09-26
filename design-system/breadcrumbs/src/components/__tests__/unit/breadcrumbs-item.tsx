import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { AtlassianIcon } from '@atlaskit/logo';

import BreadcrumbsItem from '../../breadcrumbs-item';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

describe('BreadcrumbsItem', () => {
  it('renders item', () => {
    const onClick = jest.fn();
    render(
      <BreadcrumbsItem
        href="/item"
        text="Item"
        testId="item-1"
        onClick={onClick}
      />,
    );

    const container = screen.getByTestId('item-1');

    expect(container).toBeInTheDocument();
    fireEvent.click(container);

    expect(onClick).toHaveBeenCalled();
  });

  it('renders item with truncated width', () => {
    render(
      <BreadcrumbsItem
        truncationWidth={200}
        href="/item"
        iconBefore={TestIcon}
        iconAfter={TestIcon}
        testId="item-1"
        text="Long content, icons before and after"
      />,
    );

    const item = screen.getByTestId('item-1');
    expect(item).toBeInTheDocument();

    const text = screen.getByText('Long content, icons before and after');
    expect(text).toBeInTheDocument();

    const icons = screen.getAllByLabelText('Test icon');
    expect(icons.length).toEqual(2);
  });

  it('should call onTooltipShown when tooltip is shown', () => {
    const onTooltipShown = jest.fn();

    render(
      <BreadcrumbsItem
        truncationWidth={200}
        href="/item"
        iconBefore={TestIcon}
        iconAfter={TestIcon}
        testId="item-1"
        text="Long content, icons before and after"
        onTooltipShown={onTooltipShown}
      />,
    );

    const tooltipTrigger = screen.getByTestId('item-1');
    expect(tooltipTrigger).toBeInTheDocument();
    fireEvent.mouseOver(tooltipTrigger);

    act(() => {
      jest.runAllTimers();
    });
    expect(onTooltipShown).toHaveBeenCalled;
  });
});
