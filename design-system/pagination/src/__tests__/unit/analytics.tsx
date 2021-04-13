import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Pagination from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Pagination analytics', () => {
  const setupPaginationWithAnalyticsContext = (analyticsContext = {}) => {
    const onChange = jest.fn();
    const onAnalyticsEvent = jest.fn();

    const renderResult = render(
      <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
        <Pagination
          onChange={onChange}
          pages={[1, 2, 3, 4]}
          analyticsContext={analyticsContext}
        />
      </AnalyticsListener>,
    );

    const changeEventResult = {
      payload: {
        action: 'changed',
        actionSubject: 'pageNumber',
        attributes: {
          componentName: 'pagination',
          packageName,
          packageVersion,
        },
      },
    };

    return {
      renderResult,
      onChange,
      onAnalyticsEvent,
      changeEventResult,
    };
  };

  describe('send change event to atlaskit/analytics', () => {
    it('when clicked on any page', () => {
      const {
        renderResult,
        onChange,
        onAnalyticsEvent,
        changeEventResult,
      } = setupPaginationWithAnalyticsContext();

      fireEvent.click(renderResult.getByText('2'));

      expect(onChange).toHaveBeenCalledTimes(1);

      // pagination and button analytics. First button will fire then pagination.
      expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

      expect(onAnalyticsEvent).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining(changeEventResult),
        'atlaskit',
      );
    });

    it('when navigated forwards and backwards', () => {
      const {
        renderResult,
        onChange,
        onAnalyticsEvent,
        changeEventResult,
      } = setupPaginationWithAnalyticsContext();

      fireEvent.click(renderResult.getByLabelText('next'));
      fireEvent.click(renderResult.getByLabelText('previous'));

      expect(onChange).toHaveBeenCalledTimes(2);

      // pagination and button analytics. First button will fire then pagination.
      expect(onAnalyticsEvent).toHaveBeenCalledTimes(4);

      expect(onAnalyticsEvent).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining(changeEventResult),
        'atlaskit',
      );
      expect(onAnalyticsEvent).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining(changeEventResult),
        'atlaskit',
      );
    });
  });

  describe('context', () => {
    it('should not error if there is no analytics provider', () => {
      const error = jest.spyOn(console, 'error');

      render(<Pagination pages={[1, 2]} />);

      expect(error).not.toHaveBeenCalled();

      error.mockRestore();
    });

    it('should allow the addition of additional context', () => {
      const analyticsContext = { key: 'value' };
      const {
        renderResult,
        onChange,
        changeEventResult,
      } = setupPaginationWithAnalyticsContext(analyticsContext);

      fireEvent.click(renderResult.getByText('2'));

      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        ...changeEventResult,
        context: [
          {
            componentName: 'pagination',
            packageName,
            packageVersion,
            ...analyticsContext,
          },
        ],
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][2].payload).toEqual(expected.payload);
      expect(onChange.mock.calls[0][2].context).toEqual(expected.context);
    });
  });
});
