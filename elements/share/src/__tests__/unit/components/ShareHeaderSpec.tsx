import React from 'react';

import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl-next';

import { ShareHeader } from '../../../components/ShareHeader';
import { messages } from '../../../i18n';

describe('ShareHeader', () => {
  it('should render title', () => {
    const component = mount(
      <IntlProvider locale="en">
        <ShareHeader />
      </IntlProvider>,
    );

    expect(component.text()).toEqual(messages.formTitle.defaultMessage);
  });

  it('should render with overridden title', () => {
    const component = mount(<ShareHeader title="custom title" />);

    expect(component.text()).toEqual('custom title');
  });
});
