import React from 'react';
import { mount } from 'enzyme';
import { Content } from '../../../content';
import {
  InactivityDetector,
  WithShowControlMethodProp,
} from '@atlaskit/media-ui';

class DummyChild extends React.Component<WithShowControlMethodProp> {
  render() {
    return null;
  }
}

describe('<Content />', () => {
  const setup = () => {
    const showControls = jest.fn();
    const component = mount(
      <Content>
        <DummyChild />
      </Content>,
    );
    const children = mount(
      component.find(InactivityDetector).props().children(showControls),
    );

    return {
      component,
      children,
      showControls,
    };
  };

  it('should render children', () => {
    const { children } = setup();
    expect(children).toHaveLength(2);
  });

  it('should allow children to show controls', () => {
    const { children, showControls } = setup();
    const childrenShowControls = children.find(DummyChild).prop('showControls');
    expect(childrenShowControls).toBeDefined();
    expect(childrenShowControls).toBe(showControls);
  });
});
