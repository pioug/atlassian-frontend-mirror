import React from 'react';
import { render } from '@testing-library/react';
import { withIntlProvider } from '../../with-intl-provider';
import * as queryParamReader from '../../../query-param-reader';
import { injectIntl } from 'react-intl';
import * as UseTranslationsHook from '../../use-translations';

jest.mock('../../../query-param-reader');

const mockQueryParamReader = queryParamReader as jest.Mocked<
  typeof queryParamReader
>;
const TestComponent = withIntlProvider(
  injectIntl(props => {
    return (
      <div>
        <span>default locale: {props.intl.locale}</span>
      </div>
    );
  }),
  jest.fn(() => Promise.resolve({})),
);

describe('i18n', () => {
  beforeEach(() => {
    // By default is english
    mockQueryParamReader.getLocaleValue.mockImplementation(() => 'en');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load en locale by default', async () => {
    const result = render(<TestComponent />);

    return expect(
      result.findByText('default locale: en'),
    ).resolves.toBeDefined();
  });
  //
  describe('with locale query params set', () => {
    it('should load proper locale', () => {
      mockQueryParamReader.getLocaleValue.mockImplementation(() => 'es');
      const result = render(<TestComponent />);

      return expect(
        result.findByText('default locale: es'),
      ).resolves.toBeDefined();
    });

    it('should load locale with region that is on whitelist', async () => {
      mockQueryParamReader.getLocaleValue.mockImplementation(() => 'es-MX');
      let result = render(<TestComponent />);

      return expect(
        result!.findByText('default locale: es-MX'),
      ).resolves.toBeDefined();
    });

    it('should fallback to english when translation is not loaded', () => {
      mockQueryParamReader.getLocaleValue.mockImplementation(() => 'xx');
      const result = render(<TestComponent />);

      return expect(
        result.findByText('default locale: en'),
      ).resolves.toBeDefined();
    });
  });

  describe('get messages', () => {
    let TestComponentWithMessageCallback: React.ComponentType;
    let geti18NMessages: (localeFileName: string) => Promise<Object>;
    let useTransaltionsSpy: any;
    beforeEach(() => {
      useTransaltionsSpy = jest.spyOn(UseTranslationsHook, 'useTranslations');
      useTransaltionsSpy.mockImplementation(
        jest.fn().mockReturnValue(['en', {}]),
      );
      geti18NMessages = jest.fn(() => Promise.resolve({ messages: {} }));
      TestComponentWithMessageCallback = withIntlProvider(
        injectIntl(props => {
          return (
            <div>
              <span>default locale: {props.intl.locale}</span>
            </div>
          );
        }),
        geti18NMessages,
      );
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should call useTranslations hook with geti18NMessages callback if passed', () => {
      render(<TestComponentWithMessageCallback />);
      expect(useTransaltionsSpy).toHaveBeenCalledWith(geti18NMessages);
    });
  });
});
