import { render } from '@testing-library/react';
import React from 'react';

import Breadcrumbs from '../../Breadcrumbs';
import BreadcrumbsItem from '../../BreadcrumbsItem';

describe('Breadcrumbs should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const breadcrumbsId = 'last-set-of-breadcrumbs';
    const ellipsisId = `${breadcrumbsId}--breadcrumb-ellipsis`;
    const breadcrumbToFindId = 'breadcrumb-to-find';
    const lastBreadcrumbId = 'last-breadcrumb';

    const { getByTestId, queryByTestId } = render(
      <Breadcrumbs maxItems={5} testId={breadcrumbsId}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem
          href="/item"
          text="Another item"
          testId={breadcrumbToFindId}
        />
        <BreadcrumbsItem href="/item" text="A third item" />
        <BreadcrumbsItem
          href="/item"
          text="A fourth item with a very long name"
        />
        <BreadcrumbsItem href="/item" text="Item 5" />
        <BreadcrumbsItem
          href="/item"
          text="A sixth item"
          testId={lastBreadcrumbId}
        />
      </Breadcrumbs>,
    );

    expect(getByTestId(breadcrumbsId)).toBeTruthy();
    expect(queryByTestId(breadcrumbToFindId)).toBeNull();

    getByTestId(ellipsisId).click();

    expect(queryByTestId(ellipsisId)).toBeNull();
    expect(getByTestId(breadcrumbToFindId)).toBeTruthy();
  });
});
