import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import Breadcrumbs, { BreadcrumbsItem } from '../../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('analysis', () => {
  describe('Breadcrumbs', () => {
    it('should send event to atlaskit/analytics', () => {
      const originOnExpand = jest.fn();
      const onAnalyticsEvent = jest.fn();

      const { getByTestId } = render(
        <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
          <Breadcrumbs
            testId="breadcrumbs-container"
            maxItems={2}
            onExpand={originOnExpand}
          >
            <BreadcrumbsItem href="/item" text="Item" />
            <BreadcrumbsItem href="/item" text="Another item" />
            <BreadcrumbsItem href="/item" text="A third item" />
          </Breadcrumbs>
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
          <Breadcrumbs testId="breadcrumbs-container">
            <BreadcrumbsItem
              href="/item"
              text="Item"
              testId="item-1"
              onClick={originOnClick}
            />
            <BreadcrumbsItem href="/item" text="Another item" testId="item-2" />
            <BreadcrumbsItem href="/item" text="A third item" testId="item-3" />
          </Breadcrumbs>
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
