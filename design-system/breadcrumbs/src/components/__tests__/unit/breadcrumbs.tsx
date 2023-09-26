import React, { createRef } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import Breadcrumbs, { BreadcrumbsItem } from '../../../index';

describe('Breadcrumbs container', () => {
  it('should be able to render a single child', () => {
    const { container } = render(
      <Breadcrumbs onExpand={__noop} testId="bcs">
        <BreadcrumbsItem text="item" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(1);
  });

  it('should render a navigation role', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbsItem text="item" />
      </Breadcrumbs>,
    );

    expect(screen.queryAllByRole('navigation')).toHaveLength(1);
  });

  it('should not render a navigation role if `isNavigation` is false', () => {
    render(
      <Breadcrumbs testId="bcs" isNavigation={false}>
        <BreadcrumbsItem text="item" />
      </Breadcrumbs>,
    );

    expect(screen.queryAllByRole('navigation')).toHaveLength(0);
  });

  it('should render multiple children', () => {
    render(
      <Breadcrumbs testId="breadcrumbs-container">
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = screen.getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(3);
    const anchors = Array.from(links).map((l) => l.text);

    expect(anchors).toEqual(
      expect.arrayContaining(['Item', 'Another item', 'A third item']),
    );
  });

  it('should not count empty children', () => {
    const { container } = render(
      <Breadcrumbs onExpand={__noop} maxItems={3}>
        {null}
        <BreadcrumbsItem text="item" />
        <BreadcrumbsItem text="item" />
        <BreadcrumbsItem text="item" />
        {undefined}
        {false}
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(3);
  });

  it('renders ellipsis for statefull breadcrumbs when there are too many items', () => {
    render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = screen.getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(2);

    const ellipsis = screen.getByTestId(
      'breadcrumbs-container--breadcrumb-ellipsis',
    );
    expect(ellipsis).toBeInTheDocument();
  });

  it('should set the reference on the breadcrumbs', () => {
    const ref = createRef();
    render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2} ref={ref}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const nav = screen.getByLabelText('Breadcrumbs');
    expect(nav).toBe(ref.current);
  });

  it('should accept a function as a reference', () => {
    let ourNode: HTMLElement | undefined;
    render(
      <Breadcrumbs
        testId="breadcrumbs-container"
        maxItems={2}
        ref={(node: HTMLElement) => {
          ourNode = node;
        }}
      >
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const nav = screen.getByLabelText('Breadcrumbs');
    expect(nav).toBe(ourNode);
  });
});

describe('Controlled breadcrumbs', () => {
  it('render ellipsis', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <Breadcrumbs onExpand={onExpand} maxItems={2} testId="bcs">
        <BreadcrumbsItem text="item 1" />
        <BreadcrumbsItem text="item 2" />
        <BreadcrumbsItem text="item 3" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(2);

    const anchors = Array.from(links).map((l) => l.text);

    expect(anchors).toEqual(expect.arrayContaining(['item 1', 'item 3']));
    expect(anchors).not.toEqual(expect.arrayContaining(['item 2']));

    const ellipsis = container.querySelector('button');
    fireEvent.click(ellipsis!);
    expect(onExpand).toHaveBeenCalled();
  });

  it('render ellipsis - before and after', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <Breadcrumbs
        onExpand={onExpand}
        maxItems={4}
        itemsBeforeCollapse={2}
        itemsAfterCollapse={2}
        testId="bcs"
      >
        <BreadcrumbsItem text="item 1" />
        <BreadcrumbsItem text="item 2" />
        <BreadcrumbsItem text="item 3" />
        <BreadcrumbsItem text="item 4" />
        <BreadcrumbsItem text="item 5" />
        <BreadcrumbsItem text="item 6" />
        <BreadcrumbsItem text="item 7" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(4);

    const anchors = Array.from(links).map((l) => l.text);

    expect(anchors).toEqual(
      expect.arrayContaining(['item 1', 'item 2', 'item 6', 'item 7']),
    );
    expect(anchors).not.toEqual(
      expect.arrayContaining(['item 3', 'item 4', 'item 5']),
    );
  });

  it('should be wrapped into nav tag', () => {
    const { container } = render(
      <Breadcrumbs testId="breadcrumbs-container">
        <BreadcrumbsItem href="/item" text="Item" />
      </Breadcrumbs>,
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeDefined();
  });

  it('nav wrapper should have a default aria-label when no label passed through props', () => {
    const { container } = render(
      <Breadcrumbs testId="breadcrumbs-container">
        <BreadcrumbsItem href="/item" text="Item" />
      </Breadcrumbs>,
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeDefined();
    expect(nav?.getAttribute('aria-label')).toBe('Breadcrumbs');
  });

  it('received label props should be set as aria-label of nav wrapper', () => {
    const { container } = render(
      <Breadcrumbs testId="breadcrumbs-container" label="Blog Breadcrumbs">
        <BreadcrumbsItem href="/item" text="Item" />
      </Breadcrumbs>,
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeDefined();
    expect(nav?.getAttribute('aria-label')).toBe('Blog Breadcrumbs');
  });

  it('render ellipsis - default aria-label', () => {
    render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const ellipsis = screen.getByTestId(
      'breadcrumbs-container--breadcrumb-ellipsis',
    );
    expect(ellipsis).toBeInTheDocument();

    const ariaLabel = ellipsis.getAttribute('aria-label');
    expect(ariaLabel).toBe('Show more breadcrumbs');
  });

  it('render ellipsis - received aria-label', () => {
    render(
      <Breadcrumbs
        testId="breadcrumbs-container"
        maxItems={2}
        ellipsisLabel="Test label"
      >
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const ellipsis = screen.getByTestId(
      'breadcrumbs-container--breadcrumb-ellipsis',
    );
    expect(ellipsis).toBeInTheDocument();

    const ariaLabel = ellipsis.getAttribute('aria-label');
    expect(ariaLabel).toBe('Test label');
  });
});

describe('Focus managment', () => {
  const breadcrumbsFixture = (props: any = {}) => {
    return (
      <Breadcrumbs testId="bcs" maxItems={2} {...props}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>
    );
  };

  it('should focus first revealed item, if ellipsis was focused', () => {
    render(breadcrumbsFixture());

    const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
    ellipsis.focus();

    fireEvent.click(ellipsis);
    const revealedItem = screen.getByText('Another item').parentElement;

    expect(revealedItem).toHaveFocus();
  });

  it('should not focus first revealed item, if ellipsis was not focused', () => {
    render(breadcrumbsFixture());

    const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');

    fireEvent.click(ellipsis);
    const revealedItem = screen.getByText('Another item').parentElement;

    expect(revealedItem).not.toHaveFocus();
  });

  describe('should not focus when there is no one of controlling prop', () => {
    it('without onExpand', () => {
      const { rerender } = render(breadcrumbsFixture({ isExpanded: false }));

      const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
      ellipsis.focus();
      fireEvent.click(ellipsis);

      rerender(breadcrumbsFixture({ isExpanded: true }));

      const revealedItem = screen.getByText('Another item').parentElement;
      expect(revealedItem).not.toHaveFocus();
    });
  });

  it('should focus first revealed item, when have both isExpanded and onExpand props', () => {
    const mockOnExpand = jest.fn();

    const { rerender } = render(
      breadcrumbsFixture({ isExpanded: false, onExpand: mockOnExpand }),
    );

    const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
    ellipsis.focus();
    fireEvent.click(ellipsis);

    rerender(breadcrumbsFixture({ isExpanded: true, onExpand: mockOnExpand }));

    const revealedItem = screen.getByText('Another item').parentElement;
    expect(revealedItem).toHaveFocus();
  });

  it('should focus the wrapper when there are no intractive elements', () => {
    const NonInteractiveComponent = ({ children }: any) => (
      <div>{children}</div>
    );

    render(
      <Breadcrumbs testId="bcs" maxItems={2}>
        <BreadcrumbsItem
          href="/item"
          text="Item"
          component={NonInteractiveComponent}
        />
        <BreadcrumbsItem
          href="/item"
          text="Another item"
          component={NonInteractiveComponent}
        />
        <BreadcrumbsItem
          href="/item"
          text="A third item"
          component={NonInteractiveComponent}
        />
      </Breadcrumbs>,
    );

    const wrapper = screen.getByLabelText('Breadcrumbs');
    const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
    ellipsis.focus();
    fireEvent.click(ellipsis);

    expect(wrapper).toHaveFocus();
  });

  it('should focus the first breadcrumb item when there are no intractive elements appeared', () => {
    const NonInteractiveComponent = ({ children }: any) => (
      <div>{children}</div>
    );

    render(
      <Breadcrumbs testId="bcs" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem
          href="/item"
          text="Another item"
          component={NonInteractiveComponent}
        />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const firstBreadcrumbItem = screen.getByText('Item').parentElement;
    const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
    ellipsis.focus();
    fireEvent.click(ellipsis);

    expect(firstBreadcrumbItem).toHaveFocus();
  });
});
