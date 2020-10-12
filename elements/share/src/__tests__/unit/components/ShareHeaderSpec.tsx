import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ShareHeader, FormHeaderTitle } from '../../../components/ShareHeader';
import { messages } from '../../../i18n';

describe('ShareHeader', () => {
  it('should render title', () => {
    const component = shallow(<ShareHeader />);

    const formHeader = component.find(FormHeaderTitle);
    expect(formHeader).toHaveLength(1);
    expect(formHeader.prop('children')).toEqual(
      <FormattedMessage {...messages.formTitle} />,
    );
  });

  it('should render with overridden title', () => {
    const component = shallow(<ShareHeader title="custom title" />);

    const formHeader = component.find(FormHeaderTitle);
    expect(formHeader).toHaveLength(1);
    expect(formHeader.prop('children')).toEqual('custom title');
  });
});
