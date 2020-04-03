import React from 'react';
import { shallow, mount } from 'enzyme';
import Lozenge from '@atlaskit/lozenge';
import { InlineCardResolvedView } from '../../index';
import { Icon } from '../../../../InlineCard/Icon';

describe('ResolvedView', () => {
  it('should render the title', () => {
    const element = mount(<InlineCardResolvedView title="some text content" />);
    expect(element.text()).toContain('some text content');
  });

  it('should render an icon when one is provided', () => {
    const element = mount(
      <InlineCardResolvedView
        icon="some-link-to-icon"
        title="some text content"
      />,
    );
    const elementIcon = element.find(Icon);
    expect(elementIcon).toHaveLength(1);
    const elementIconImage = elementIcon.find('img');
    expect(elementIconImage).toHaveLength(1);
    expect(elementIconImage.props()).toEqual(
      expect.objectContaining({
        src: 'some-link-to-icon',
      }),
    );
  });

  it('should not render an icon when one is not provided', () => {
    const element = mount(<InlineCardResolvedView title="some text content" />);
    expect(element.find(Icon)).toHaveLength(0);
  });

  it('should render a lozenge when one is provided', () => {
    const lozenge = {
      text: 'some-lozenge-text',
      isBold: true,
      appearance: 'inprogress' as 'inprogress',
    };
    const element = shallow(
      <InlineCardResolvedView title="some text content" lozenge={lozenge} />,
    );
    expect(element.find(Lozenge)).toHaveLength(1);
    expect(element.find(Lozenge).props()).toEqual(
      expect.objectContaining({
        appearance: 'inprogress',
        isBold: true,
        children: 'some-lozenge-text',
      }),
    );
  });

  it('should not render a lozenge when one is not provided', () => {
    const element = shallow(
      <InlineCardResolvedView title="some text content" />,
    );
    expect(element.find(Lozenge)).toHaveLength(0);
  });
});
