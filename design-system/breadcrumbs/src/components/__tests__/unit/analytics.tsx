import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import { BreadcrumbsItem, BreadcrumbsStateless } from '../../../index';
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';

describe('analysis', () => {
  describe('BreadcrumbsStateless', () => {
    it('should send event to atlaskit/analytics', () => {
      const originOnExpand = jest.fn();
      const onAnalyticsEvent = jest.fn();

      const { getByTestId } = render(
        <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
          <BreadcrumbsStateless
            testId="breadcrumbs-container"
            maxItems={2}
            onExpand={originOnExpand}
          >
            <BreadcrumbsItem href="/item" text="Item" />
            <BreadcrumbsItem href="/item" text="Another item" />
            <BreadcrumbsItem href="/item" text="A third item" />
          </BreadcrumbsStateless>
        </AnalyticsListener>,
      );

      const ellipsis = getByTestId(
        'breadcrumbs-container--breadcrumb-ellipsis',
      );
      fireEvent.click(ellipsis!);

      expect(originOnExpand).toHaveBeenCalled();

      // breadcrumbs and button
      expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

      expect(onAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            action: 'expanded',
            actionSubject: 'breadcrumbs',
            attributes: {
              componentName: 'breadcrumbs',
              packageName,
              packageVersion,
            },
          },
        }),
        'atlaskit',
      );
    });
  });

  describe('Breadcrumbs item', () => {
    it('should send event to atlaskit/analytics', () => {
      const originOnClick = jest.fn();
      const onAnalyticsEvent = jest.fn();

      const { getByTestId } = render(
        <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
          <BreadcrumbsStateless testId="breadcrumbs-container">
            <BreadcrumbsItem
              href="/item"
              text="Item"
              testId="item-1"
              onClick={originOnClick}
            />
            <BreadcrumbsItem href="/item" text="Another item" testId="item-2" />
            <BreadcrumbsItem href="/item" text="A third item" testId="item-3" />
          </BreadcrumbsStateless>
        </AnalyticsListener>,
      );

      const item1 = getByTestId('item-1');
      fireEvent.click(item1!);

      expect(originOnClick).toHaveBeenCalled();

      // breadcrumbs and button
      expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

      expect(onAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            action: 'clicked',
            actionSubject: 'breadcrumbsItem',
            attributes: {
              componentName: 'breadcrumbsItem',
              packageName,
              packageVersion,
            },
          },
        }),
        'atlaskit',
      );
    });
  });
});
