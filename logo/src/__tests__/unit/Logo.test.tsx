import { mount } from 'enzyme';
import React from 'react';

import { AtlassianLogo } from '../..';

describe('Logo component', () => {
  it('should render an svg', () => {
    const wrapper = mount(<AtlassianLogo />);
    // Need to search the html string because we use dangerouslySetInnerHTML, which
    // does not work with .find
    expect(wrapper.html().includes('<svg')).toBe(true);
  });

  it('should have a unique id', () => {
    // We need to ensure that each Logo component is being generated an unique
    // id. This is to ensure that each component's gradient is pointing to the
    // correct gradient.
    const startColor1 = '#e6e6e6';
    const stopColor1 = '#fff';
    const startColor2 = '#dedede';
    const stopColor2 = 'rebeccapurple';

    const logos = [
      mount(<AtlassianLogo />),
      mount(<AtlassianLogo />),
      mount(
        <AtlassianLogo
          iconGradientStart={startColor1}
          iconGradientStop={stopColor2}
        />,
      ),
      mount(
        <AtlassianLogo
          iconGradientStart={startColor1}
          iconGradientStop={stopColor2}
        />,
      ),
      mount(
        <AtlassianLogo
          iconGradientStart={startColor2}
          iconGradientStop={stopColor1}
        />,
      ),
    ];

    const logoIds = logos.map(l => {
      return l
        .find('span')
        .render()
        .find('svg')
        .find('stop')
        .parent()[0].attribs.id;
    });

    function hasDuplicates(array: Array<any>) {
      return new Set(array).size !== array.length;
    }

    const logoIdsContainDuplicates = hasDuplicates(logoIds);

    expect(logoIdsContainDuplicates).toEqual(false);
  });
});
