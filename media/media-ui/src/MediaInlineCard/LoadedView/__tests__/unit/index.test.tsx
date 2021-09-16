import React from 'react';
import { mount } from 'enzyme';
import { MediaInlineCardLoadedView } from '../../index';
import { Icon } from '../../../Icon';

jest.mock('react-render-image');

describe('LoadedView', () => {
  it('should render the title', () => {
    const element = mount(
      <MediaInlineCardLoadedView title="some text content" />,
    );
    expect(element.text()).toContain('some text content');
  });

  it('should render an icon when one is provided', () => {
    const element = mount(
      <MediaInlineCardLoadedView
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
    const element = mount(
      <MediaInlineCardLoadedView title="some text content" />,
    );
    expect(element.find(Icon)).toHaveLength(0);
  });
});
