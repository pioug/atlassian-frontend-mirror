import React from 'react';

import { shallow } from 'enzyme';

import Page from '../../index';

describe('@atlaskit/page', () => {
  it('page should accept navigation as a property', () => {
    const Navigation = () => <span>Navigation</span>;
    expect(
      shallow(<Page navigation={<Navigation />} />).find(Navigation).length,
    ).toBe(1);
  });

  it('should set aria-hidden to true when banner is not visible', () => {
    const Banner = () => <div>Banner</div>;
    const wrapper = shallow(<Page banner={<Banner />} isBannerOpen={false} />);

    expect(
      wrapper.find(Banner).parents().at(1).prop('aria-hidden'),
    ).toBeTruthy();
  });

  it('should set aria-hidden to false when banner is visible', () => {
    const Banner = () => <div>Banner</div>;
    const wrapper = shallow(<Page banner={<Banner />} isBannerOpen />);

    expect(
      wrapper.find(Banner).parents().at(1).prop('aria-hidden'),
    ).toBeFalsy();
  });
});
