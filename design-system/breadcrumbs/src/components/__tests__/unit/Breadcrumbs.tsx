import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Breadcrumbs, { BreadcrumbsItem } from '../../../index';

describe('Breadcrumbs container', () => {
  it('renders breadcrumb items', () => {
    const { getByTestId } = render(
      <Breadcrumbs testId="breadcrumbs-container">
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(3);
    const anchors = Array.from(links).map(l => l.text);

    expect(anchors).toEqual(
      expect.arrayContaining(['Item', 'Another item', 'A third item']),
    );
  });

  it('renders ellipsis when there are too many items', () => {
    const { getByTestId } = render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(2);

    const ellipsis = getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
    expect(ellipsis).toBeDefined();
  });

  it('renders ellipsis when there are too many items - expand', () => {
    const { getByTestId } = render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(2);

    const ellipsis = getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
    fireEvent.click(ellipsis);

    const updatedLinks = container.querySelectorAll('a');
    expect(updatedLinks.length).toEqual(3);
  });
});
