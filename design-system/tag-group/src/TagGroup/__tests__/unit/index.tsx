import React from 'react';
import { shallow, mount } from 'enzyme';
import Tag from '@atlaskit/tag';

import TagGroup from '../..';
import { Container } from '../../styled';

describe('TagGroup', () => {
  it('should export a base component', () => {
    expect(
      shallow(
        <TagGroup>
          <Tag text="test" />
        </TagGroup>,
      ),
    ).toBeInstanceOf(Object);
  });

  it('should render supplied tags', () => {
    const tags = ['Candy canes', 'Tiramisu', 'Gummi bears'];

    const wrapper = mount(
      <TagGroup>
        {tags.map(tagName => (
          <Tag key={tagName} text={tagName} />
        ))}
      </TagGroup>,
    );

    expect(wrapper.text()).toBe(tags.join(''));
  });

  it('should justify to the start when alignment not set', () => {
    const wrapper = mount(
      <TagGroup>
        <Tag text="test" />
      </TagGroup>,
    );
    expect(wrapper.find(Container).prop('justify')).toBe('start');
  });

  it('should justify to the end when alignment is set to end', () => {
    const wrapper = mount(
      <TagGroup alignment="end">
        <Tag text="test" />
      </TagGroup>,
    );
    expect(wrapper.find(Container).prop('justify')).toBe('end');
  });
});
