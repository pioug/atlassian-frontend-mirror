import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import DateTimeType, { DateProps, DATETIME_TYPE_TEST_ID } from './index';

describe('DateTime Type', () => {
  const setup = ({
    value,
    display = 'date',
    ...props
  }: {
    value: DateProps['value']['value'];
    display?: DateProps['display'];
    [key: string]: any;
  }) => {
    return render(
      <IntlProvider locale="en" timeZone="Australia/Sydney">
        <DateTimeType value={{ value }} {...props} display={display} />
      </IntlProvider>,
    );
  };

  describe('when "display" is "date"', () => {
    it('renders date in the correct format when a valid date is passed', async () => {
      const { queryByTestId } = setup({
        value: '2006-09-14T00:00:00.000Z',
        display: 'date',
      });

      const el = queryByTestId(DATETIME_TYPE_TEST_ID);

      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('Sep 14, 2006');
    });

    it('renders date in the correct format when a valid non-iso date format is passed', async () => {
      const { queryByTestId } = setup({
        value: '11/11/2023',
        display: 'date',
      });

      const el = queryByTestId(DATETIME_TYPE_TEST_ID);

      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('Nov 11, 2023');
    });

    it('does not render when the date is empty', async () => {
      const { queryByTestId } = setup({
        value: '',
        display: 'date',
      });
      expect(queryByTestId(DATETIME_TYPE_TEST_ID)).not.toBeInTheDocument();
    });

    it('does not render when the date is invalid', async () => {
      const { queryByTestId } = setup({
        value: '2021-13-25',
        display: 'date',
      });
      expect(queryByTestId(DATETIME_TYPE_TEST_ID)).not.toBeInTheDocument();
    });
  });

  describe('when "display" is "time"', () => {
    it('renders time in the correct format when a valid date is passed', async () => {
      const { queryByTestId } = setup({
        value: '2023-04-20T23:00:00.000Z',
        display: 'time',
      });

      const el = queryByTestId(DATETIME_TYPE_TEST_ID);

      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('09:00');
    });

    it('renders time in the correct format when a valid non-iso date format is passed', async () => {
      const { queryByTestId } = setup({
        value: '11/11/2023 11:10',
        display: 'time',
      });

      const el = queryByTestId(DATETIME_TYPE_TEST_ID);

      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('22:10');
    });

    it('does not render when the date is empty', async () => {
      const { queryByTestId } = setup({
        value: '',
        display: 'time',
      });
      expect(queryByTestId(DATETIME_TYPE_TEST_ID)).not.toBeInTheDocument();
    });

    it('does not render when the date is invalid', async () => {
      const { queryByTestId } = setup({
        value: '2021-13-25',
        display: 'time',
      });
      expect(queryByTestId(DATETIME_TYPE_TEST_ID)).not.toBeInTheDocument();
    });
  });

  describe('when "display" is "datetime"', () => {
    it('renders datetime in the correct format when a valid date is passed', async () => {
      const { queryByTestId } = setup({
        value: '2023-04-20T23:00:00.000Z',
        display: 'datetime',
      });

      const el = queryByTestId(DATETIME_TYPE_TEST_ID);

      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('Apr 21, 2023, 09:00');
    });

    it('renders datetime in the correct format when a valid non-iso date format is passed', async () => {
      const { queryByTestId } = setup({
        value: '11/11/2023 11:10',
        display: 'datetime',
      });

      const el = queryByTestId(DATETIME_TYPE_TEST_ID);

      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('Nov 11, 2023, 22:10');
    });

    it('does not render when the date is empty', async () => {
      const { queryByTestId } = setup({
        value: '',
        display: 'time',
      });
      expect(queryByTestId(DATETIME_TYPE_TEST_ID)).not.toBeInTheDocument();
    });

    it('does not render when the date is invalid', async () => {
      const { queryByTestId } = setup({
        value: '2021-13-25',
        display: 'time',
      });
      expect(queryByTestId(DATETIME_TYPE_TEST_ID)).not.toBeInTheDocument();
    });
  });

  describe('when "display" is an invalid value', () => {
    it('it then fallbacks to default date display', async () => {
      const display: any = 'invalid';
      const { queryByTestId } = setup({
        value: '2006-09-14T00:00:00.000Z',
        display,
      });

      const el = queryByTestId(DATETIME_TYPE_TEST_ID);

      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('Sep 14, 2006');
    });
  });
});
