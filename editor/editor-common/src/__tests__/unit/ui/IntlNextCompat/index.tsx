import React from 'react';

import { mount, ReactWrapper } from 'enzyme';
import { IntlProvider as LegacyIntlProvider } from 'react-intl';
import { useIntl } from 'react-intl-next';

import { LegacyToNextIntlProvider } from '../../../../ui/LegacyToNextIntlProvider';

const IntlNextConsumerExample = () => {
  const intl = useIntl();
  return (
    <div className="intl-config">
      {JSON.stringify({ locale: intl.locale, message: intl.messages })}
    </div>
  );
};

const SimpleComponent = () => <div />;

describe('LegacyToNextIntlProvider', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper?.length && wrapper.unmount();
  });

  it('should render a next IntlProvider when legacy IntlProvider exists, and have identical intl config', () => {
    wrapper = mount(
      <LegacyIntlProvider locale="es" messages={{ hi: 'hola' }}>
        <LegacyToNextIntlProvider>
          <IntlNextConsumerExample />
        </LegacyToNextIntlProvider>
      </LegacyIntlProvider>,
    );

    // we infer that a next IntlProvider was correctly setup by checking that next intl consumers
    // can render and can access an intl object with the expected config values
    const renderedIntlConfig = JSON.parse(wrapper.find('.intl-config').text());

    expect(renderedIntlConfig).toMatchObject({
      locale: 'es',
      message: { hi: 'hola' },
    });
    expect(true).toEqual(true);
  });

  it('should not render a next IntlProvider when legacy IntlProvider does NOT exist', () => {
    // again, we infer that a next intlProvider was not setup by checking that a next intl
    // consumer component throws a "missing IntlProvider" error
    const render = () => {
      mount(
        <LegacyToNextIntlProvider>
          <IntlNextConsumerExample />
        </LegacyToNextIntlProvider>,
      );
    };
    expect(render).toThrowError(
      '[React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry.',
    );
  });

  it('should render children as-is when legacy IntlProvider does NOT exist', () => {
    wrapper = mount(
      <LegacyToNextIntlProvider>
        <SimpleComponent />
      </LegacyToNextIntlProvider>,
    );
    expect(wrapper.contains(<SimpleComponent />)).toEqual(true);
  });
});
