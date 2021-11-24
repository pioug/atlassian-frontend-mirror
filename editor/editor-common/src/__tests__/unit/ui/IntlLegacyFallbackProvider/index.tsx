import React from 'react';

import { mount, ReactWrapper } from 'enzyme';
import { IntlProvider } from 'react-intl';

import { IntlLegacyFallbackProvider } from '../../../../ui/IntlLegacyFallbackProvider';

describe('IntlLegacyFallbackProvider', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render fallback IntlProvider if there is no existing IntlProvider', () => {
    wrapper = mount(
      <IntlLegacyFallbackProvider>
        <div />
      </IntlLegacyFallbackProvider>,
    );
    const intlProvider = wrapper.find(IntlProvider);
    expect(intlProvider.length).toEqual(1);
    expect(intlProvider.props()).toEqual(
      expect.objectContaining({ locale: 'en' }),
    );
  });

  it('should not render fallback IntlProvider if there is an existing IntlProvider', () => {
    wrapper = mount(
      <IntlProvider locale="es" messages={{ hi: 'hola' }}>
        <IntlLegacyFallbackProvider>
          <div />
        </IntlLegacyFallbackProvider>
      </IntlProvider>,
    );
    const intlProvider = wrapper.find(IntlProvider);
    expect(intlProvider.length).toEqual(1);
    expect(intlProvider.props()).toMatchObject({
      locale: 'es',
      messages: { hi: 'hola' },
    });
  });
});
