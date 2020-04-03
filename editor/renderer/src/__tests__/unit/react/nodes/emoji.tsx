import React from 'react';
import { mount } from 'enzyme';

import RendererEmoji from '../../../../react/nodes/emoji';
import { Emoji } from '@atlaskit/editor-common';

describe('Emoji', () => {
  it('should render Emoji UI component', () => {
    const component = mount(
      <RendererEmoji shortName="shortname" id="id" text="fallback" />,
    );
    expect(component.find(Emoji)).toHaveLength(1);
    component.unmount();
  });

  it('should convert text to fallback attribute', () => {
    const component = mount(
      <RendererEmoji shortName="shortname" id="id" text="fallback" />,
    );

    expect(component.find(Emoji).prop('fallback')).toEqual('fallback');
    component.unmount();
  });
});
