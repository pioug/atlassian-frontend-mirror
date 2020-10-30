import * as mocks from './formattedDate.spec.mock';
import React from 'react';
import { mount } from 'enzyme';
import {
  FormattedDate,
  formatterOptions,
  partsFormatter,
} from '../formattedDate';
import { createLocalizationProvider } from '@atlaskit/locale';
import { IntlProvider } from 'react-intl';

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
    expect(mocks.mockFormatToParts).toBeCalledWith(timestamp);

    const formatted = component.find(FormattedDate);
    expect(formatted).toHaveLength(1);
    expect(
      formatted.first().contains(partsFormatter(mocks.formattedParts)),
    ).toBe(true);
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
    expect(partsFormatter(mocks.formattedParts)).toBe(`02 Apr 2315, 01:02 PM`);
  });
});
