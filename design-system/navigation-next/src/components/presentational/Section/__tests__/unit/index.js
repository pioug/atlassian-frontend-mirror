import React from 'react';

import { mount } from 'enzyme';

import SectionWithTheme from '../../index';
import {
  ScrollableInner,
  ScrollableTransitionGroup,
  ScrollableWrapper,
  StaticTransitionGroup,
  StaticWrapper,
} from '../../Section';

describe('Section with Content Theming', () => {
  it('should wrap its children with an internally scrollable div when shouldGrow is true', () => {
    const notScrollable = mount(
      <SectionWithTheme>{() => <div>Hello world</div>}</SectionWithTheme>,
    );
    const scrollable = mount(
      <SectionWithTheme shouldGrow>
        {() => <div>Hello world</div>}
      </SectionWithTheme>,
    );

    expect(
      notScrollable.find(StaticTransitionGroup).find(StaticWrapper),
    ).toHaveLength(1);
    expect(scrollable.find(StaticWrapper)).toHaveLength(0);

    expect(
      scrollable
        .find(ScrollableTransitionGroup)
        .find(ScrollableWrapper)
        .find(ScrollableInner),
    ).toHaveLength(1);
  });
});
