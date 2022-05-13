import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { AtlassianIcon } from '@atlaskit/logo';

import BreadcrumbsItem from '../../breadcrumbs-item';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

describe('BreadcrumbsItem', () => {
  it('renders item', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <BreadcrumbsItem
        href="/item"
        text="Item"
        testId="item-1"
        onClick={onClick}
      />,
    );

    const container = getByTestId('item-1');

    expect(container).toBeDefined();
    fireEvent.click(container);

    expect(onClick).toHaveBeenCalled();
  });

  it('renders item with truncated width', () => {
    const { getByTestId, getByText, container } = render(
      <BreadcrumbsItem
        truncationWidth={200}
        href="/item"
        iconBefore={TestIcon}
        iconAfter={TestIcon}
        testId="item-1"
        text="Long content, icons before and after"
      />,
    );

    const item = getByTestId('item-1');
    expect(item).toBeDefined();

    const text = getByText('Long content, icons before and after');
    expect(text).toBeDefined();

    const icons = container.querySelectorAll('span[aria-label="Test icon"]');
    expect(icons.length).toEqual(2);
  });

  it('should call onTooltipShown when tooltip is shown', () => {
    const onTooltipShown = jest.fn();

    const { getByTestId } = render(
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

    const tooltipTrigger = getByTestId('item-1');
    expect(tooltipTrigger).toBeDefined();
    fireEvent.mouseOver(tooltipTrigger);

    act(() => {
      jest.runAllTimers();
    });
    expect(onTooltipShown).toHaveBeenCalled;
  });
});
