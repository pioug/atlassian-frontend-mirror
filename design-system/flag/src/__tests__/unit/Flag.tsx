import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { FlagProps } from '../../types';
import Flag from '../../flag';
import FlagGroup from '../../flag-group';

describe('Flag', () => {
  const generateFlag = (extraProps?: Partial<FlagProps>) => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );

  describe('description prop', () => {
    it('description element should not be rendered if description prop is empty', () => {
      const { queryByTestId } = render(
        generateFlag({ description: '', testId: 'flag-test' }),
      );

      expect(queryByTestId('flag-test-description')).toBeNull();
    });

    it('description element should not be rendered if description prop not passed', () => {
      const { queryByTestId } = render(generateFlag({ testId: 'flag-test' }));

      expect(queryByTestId('flag-test-description')).toBeNull();
    });

    it('description prop text should be rendered to correct location', () => {
      const { getByText } = render(generateFlag({ description: 'Oh hi!' }));

      expect(getByText('Oh hi!')).not.toBeNull();
    });

    it('should accept JSX in description', () => {
      const { queryByTestId } = render(
        generateFlag({
          description: (
            <span data-testid="description-jsx">
              Check this
              <a href="https://google.com">link</a>
              out
            </span>
          ),
          testId: 'flag-test',
        }),
      );

      expect(queryByTestId('description-jsx')).not.toBeNull();
    });
  });

  describe('appearance prop', () => {
    describe('basic appearance tests', () => {
      it('should default to normal appearance', () => {
        const { getByTestId } = render(generateFlag({ testId: 'flag-test' }));

        // Assume normal appearance has a qhite background
        const style = window.getComputedStyle(getByTestId('flag-test'));
        expect(style.backgroundColor).toEqual('rgb(255, 255, 255)');
      });
    });

    describe('non-bold (normal) appearance', () => {
      it('should not render dismiss icon if isDismissAllowed is false or if no onDismissed callback is provided', () => {
        const { queryByTestId } = render(generateFlag({ testId: 'flag-test' }));

        expect(queryByTestId('flag-test-toggle')).toBeNull();
        expect(queryByTestId('flag-test-dismiss')).toBeNull();
      });

      it('should render dismiss icon if first element in a FlagGroup', () => {
        const { queryByTestId } = render(
          <FlagGroup onDismissed={() => {}}>
            {generateFlag({
              testId: 'flag-test',
            })}
          </FlagGroup>,
        );
        expect(queryByTestId('flag-test-dismiss')).not.toBeNull();
      });
    });

    describe('bold appearances', () => {
      it('should set aria-expanded to false if not expanded', () => {
        const { getByTestId } = render(
          generateFlag({
            appearance: 'info',
            description: 'Hello',
            testId: 'flag-test',
          }),
        );

        expect(
          getByTestId('flag-test-toggle').getAttribute('aria-expanded'),
        ).toEqual('false');
      });

      it('should set aria-expanded to true if expanded', () => {
        const { getByTestId } = render(
          generateFlag({
            appearance: 'info',
            description: 'Hello',
            testId: 'flag-test',
          }),
        );
        const toggleButton = getByTestId('flag-test-toggle');
        fireEvent.click(toggleButton);

        expect(
          getByTestId('flag-test-toggle').getAttribute('aria-expanded'),
        ).toEqual('true');
      });

      it('should only render an expand button if either description or actions props are set', () => {
        const { queryByTestId, rerender } = render(
          generateFlag({
            appearance: 'info',
            testId: 'flag-test',
          }),
        );
        expect(queryByTestId('flag-test-toggle')).toBeNull();

        rerender(
          generateFlag({
            appearance: 'info',
            testId: 'flag-test',
            actions: [],
            description: 'Hello',
          }),
        );
        expect(queryByTestId('flag-test-toggle')).not.toBeNull();

        rerender(
          generateFlag({
            appearance: 'info',
            testId: 'flag-test',
            actions: [{ content: 'Hello', onClick: () => {} }],
          }),
        );
        expect(queryByTestId('flag-test-toggle')).not.toBeNull();
      });

      it('should un-expand an expanded bold flag when the description and actions props are removed', () => {
        const { getByTestId, rerender } = render(
          generateFlag({
            appearance: 'info',
            testId: 'flag-test',
            description: 'Hello',
            actions: [{ content: 'Hello', onClick: () => {} }],
          }),
        );

        fireEvent.click(getByTestId('flag-test-toggle'));

        expect(
          getByTestId('flag-test-expander').getAttribute('aria-hidden'),
        ).toEqual('false');

        rerender(
          generateFlag({
            appearance: 'info',
            testId: 'flag-test',
            actions: [{ content: 'Hello', onClick: () => {} }],
          }),
        );

        expect(
          getByTestId('flag-test-expander').getAttribute('aria-hidden'),
        ).toEqual('false');

        rerender(
          generateFlag({
            appearance: 'info',
            testId: 'flag-test',
            description: 'Hello',
          }),
        );

        expect(
          getByTestId('flag-test-expander').getAttribute('aria-hidden'),
        ).toEqual('false');

        rerender(
          generateFlag({
            appearance: 'info',
            testId: 'flag-test',
          }),
        );
        expect(
          getByTestId('flag-test-expander').getAttribute('aria-hidden'),
        ).toEqual('true');
      });
    });

    describe('flag actions', () => {
      it('onDismissed should be called with flag id as param when dismiss icon clicked', () => {
        const spy = jest.fn();
        const { getByTestId } = render(
          <FlagGroup onDismissed={spy}>
            {generateFlag({
              id: 'a',
              testId: 'flag-test',
            })}
          </FlagGroup>,
        );
        fireEvent.click(getByTestId('flag-test-dismiss'));

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('a', expect.anything());
      });

      it('Dismiss button should not be rendered if isDismissAllowed is omitted', () => {
        const spy = jest.fn();
        const { queryByTestId } = render(
          generateFlag({
            id: 'a',
            testId: 'flag-test',
          }),
        );

        expect(queryByTestId('flag-test-dismiss')).toBeNull();
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
