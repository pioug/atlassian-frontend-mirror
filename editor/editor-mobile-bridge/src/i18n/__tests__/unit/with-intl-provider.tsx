import React from 'react';
import { render } from '@testing-library/react';
import { withIntlProvider } from '../../with-intl-provider';
import { injectIntl } from 'react-intl';
import * as UseTranslationsHook from '../../use-translations';

const TestComponent = withIntlProvider(
  injectIntl((props) => {
    return (
      <div>
        <span>default locale: {props.intl.locale}</span>
      </div>
    );
  }),
  jest.fn(() => Promise.resolve({})),
);

describe('i18n', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('with locale query params set', () => {
    it('should load proper locale', () => {
      const result = render(<TestComponent locale="es" />);

      return expect(
        result.findByText('default locale: es'),
      ).resolves.toBeDefined();
    });

    it('should load locale with region that is on whitelist', async () => {
      let result = render(<TestComponent locale="es-MX" />);

      return expect(
        result!.findByText('default locale: es-MX'),
      ).resolves.toBeDefined();
    });

    it('should fallback to english when translation is not loaded', () => {
      const result = render(<TestComponent locale="xx" />);

      return expect(
        result.findByText('default locale: en'),
      ).resolves.toBeDefined();
    });
  });

  describe('Locale change callbacks', () => {
    it('should call useTranslations hook with locale change callback if passed', () => {
      const onLocaleChanged = () => {};
      const onWillLocaleChange = () => {};
      const useTransaltionsSpy = jest.spyOn(
        UseTranslationsHook,
        'useTranslations',
      );

      render(
        <TestComponent
          locale="fr"
          onLocaleChanged={onLocaleChanged}
          onWillLocaleChange={onWillLocaleChange}
        />,
      );

      return expect(useTransaltionsSpy).toHaveBeenCalledWith(
        'fr',
        expect.anything(),
        onLocaleChanged,
        onWillLocaleChange,
      );
    });
  });

  describe('get messages', () => {
    let TestComponentWithMessageCallback: React.ComponentType<{
      locale: string;
    }>;
    let geti18NMessages: (localeFileName: string) => Promise<Object>;
    let useTransaltionsSpy: any;
    beforeEach(() => {
      useTransaltionsSpy = jest.spyOn(UseTranslationsHook, 'useTranslations');
      useTransaltionsSpy.mockImplementation(
        jest.fn().mockReturnValue({
          locale: 'en',
          messages: {},
        }),
      );
      geti18NMessages = jest.fn(() => Promise.resolve({ messages: {} }));
      TestComponentWithMessageCallback = withIntlProvider(
        injectIntl((props) => {
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
      render(<TestComponentWithMessageCallback locale="en" />);
      expect(useTransaltionsSpy).toHaveBeenCalledWith(
        'en',
        geti18NMessages,
        undefined,
        undefined,
      );
    });
  });
});
