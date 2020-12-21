import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { BreadcrumbsStateless, BreadcrumbsItem as Item } from '../../../index';

describe('BreadcrumbsStateless', () => {
  it('should be able to render a single child', () => {
    const { container } = render(
      <BreadcrumbsStateless onExpand={() => {}} testId="bcs">
        <Item text="item" />
      </BreadcrumbsStateless>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(1);
  });

  it('should render multiple children', () => {
    const { container } = render(
      <BreadcrumbsStateless onExpand={() => {}} testId="bcs">
        <Item text="item" />
        <Item text="item" />
        <Item text="item" />
      </BreadcrumbsStateless>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(3);
  });

  it('should not count empty children', () => {
    const { container } = render(
      <BreadcrumbsStateless onExpand={() => {}} maxItems={3}>
        {null}
        <Item text="item" />
        <Item text="item" />
        <Item text="item" />
        {undefined}
        {false}
      </BreadcrumbsStateless>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(3);
  });

  it('render ellipsis', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <BreadcrumbsStateless onExpand={onExpand} maxItems={2} testId="bcs">
        <Item text="item 1" />
        <Item text="item 2" />
        <Item text="item 3" />
      </BreadcrumbsStateless>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(2);

    const anchors = Array.from(links).map(l => l.text);

    expect(anchors).toEqual(expect.arrayContaining(['item 1', 'item 3']));
    expect(anchors).not.toEqual(expect.arrayContaining(['item 2']));

    const ellipsis = container.querySelector('button');
    fireEvent.click(ellipsis!);
    expect(onExpand).toHaveBeenCalled();
  });

  it('render ellipsis - before and after', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <BreadcrumbsStateless
        onExpand={onExpand}
        maxItems={4}
        itemsBeforeCollapse={2}
        itemsAfterCollapse={2}
        testId="bcs"
      >
        <Item text="item 1" />
        <Item text="item 2" />
        <Item text="item 3" />
        <Item text="item 4" />
        <Item text="item 5" />
        <Item text="item 6" />
        <Item text="item 7" />
      </BreadcrumbsStateless>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(4);

    const anchors = Array.from(links).map(l => l.text);

    expect(anchors).toEqual(
      expect.arrayContaining(['item 1', 'item 2', 'item 6', 'item 7']),
    );
    expect(anchors).not.toEqual(
      expect.arrayContaining(['item 3', 'item 4', 'item 5']),
    );
  });
});
