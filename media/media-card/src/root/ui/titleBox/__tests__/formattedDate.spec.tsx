const formattedParts = {
  day: '02',
  month: 'Apr',
  year: '2315',
  hour: '01',
  minute: '02',
  dayPeriod: 'PM',
};
const formatToParts = jest.fn().mockReturnValue(formattedParts);
jest.mock('@atlaskit/locale', () => ({
  createLocalizationProvider: jest.fn().mockReturnValue({
    formatToParts,
  }),
}));
import React from 'react';
import { mount } from 'enzyme';
import {
  FormattedDate,
  formatterOptions,
  partsFormatter,
} from '../formattedDate';
import { createLocalizationProvider } from '@atlaskit/locale';
import { IntlProvider } from 'react-intl';

createLocalizationProvider as jest.Mock;

describe('FormattedDate', () => {
  it('should render a formatted date using LocalizationProvider', () => {
    const locale = 'en';
    const timestamp = 123456;
    const component = mount(
      <IntlProvider locale={locale}>
        <FormattedDate timestamp={timestamp} />
      </IntlProvider>,
    );
    expect(createLocalizationProvider).toBeCalledWith(locale, formatterOptions);
    expect(formatToParts).toBeCalledWith(timestamp);

    const formatted = component.find(FormattedDate);
    expect(formatted).toHaveLength(1);
    expect(formatted.first().contains(partsFormatter(formattedParts))).toBe(
      true,
    );
  });

  it('should set formatterOptions', () => {
    expect(formatterOptions).toEqual({
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  });

  it('should format date parts', () => {
    expect(partsFormatter(formattedParts)).toBe(`02 Apr 2315, 01:02 PM`);
  });
});
