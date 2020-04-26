import React from 'react';

import { mount, shallow } from 'enzyme';

import HeaderSection from '../../index';

describe('HeaderSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should render Section with correct props', () => {
    const MyHeader = ({ className }) => (
      <div className={className}>My Header</div>
    );
    const wrapper = shallow(
      <HeaderSection>
        {({ className }) => <MyHeader className={className} />}
      </HeaderSection>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render children with section styles containing paddingTop', () => {
    const MyHeader = ({ className }) => (
      <div className={className}>My Header</div>
    );
    const wrapper = mount(
      <HeaderSection>
        {({ className, css }) => (
          <MyHeader className={className} headerSectionCss={css} />
        )}
      </HeaderSection>,
    );

    const myHeader = wrapper.find(MyHeader);

    // css prop
    expect(myHeader.prop('headerSectionCss')).toEqual(
      expect.objectContaining({
        paddingTop: 20,
      }),
    );

    // className prop
    expect(myHeader).toMatchSnapshot();
  });
});
