import React from 'react';

import { mount, shallow } from 'enzyme';

import MenuSection from '../../index';

describe('MenuSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should render Section with correct props', () => {
    const MyHeader = ({ className }) => (
      <div className={className}>My Header</div>
    );
    const wrapper = shallow(
      <MenuSection>
        {({ className }) => <MyHeader className={className} />}
      </MenuSection>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render children with section styles containing paddingBottom', () => {
    const MyHeader = ({ className }) => (
      <div className={className}>My Header</div>
    );
    const wrapper = mount(
      <MenuSection>
        {({ className, css }) => (
          <MyHeader className={className} MenuSectionCss={css} />
        )}
      </MenuSection>,
    );

    const myHeader = wrapper.find(MyHeader);

    // css prop
    expect(myHeader.prop('MenuSectionCss')).toEqual(
      expect.objectContaining({
        paddingBottom: 12,
      }),
    );

    // className prop
    expect(myHeader).toMatchSnapshot();
  });
});
