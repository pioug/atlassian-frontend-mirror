import React from 'react';
import { mount } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { Popup } from '@atlaskit/editor-common/ui';
import FloatingToolbar from '../../../ui/FloatingToolbar';
import Toolbar from '../../../plugins/floating-toolbar/ui/Toolbar';
import { FloatingToolbarItem } from '../../../plugins/floating-toolbar/types';
import { Command } from '../../../types';

const DummyContainer = (
  <div className="dummy-container" key={1}>
    Hello
  </div>
);

const items: Array<FloatingToolbarItem<Command>> = [
  {
    type: 'custom',
    fallback: [],
    render: () => DummyContainer,
  },
];

describe('FloatingToolbar', () => {
  const target = document.createElement('div');

  it('renders nothing if there is no target', () => {
    const wrapper = mount(<FloatingToolbar />);
    expect(wrapper.find(Popup).length).toBe(0);
  });

  it('renders popup', () => {
    const wrapper = mount(<FloatingToolbar target={target} />);
    expect(wrapper.find(Popup).length).toBe(1);
  });

  it('renders container', () => {
    const wrapper = mount(<FloatingToolbar target={target} />);
    expect(wrapper.find('div[data-testid="popup-container"]').length).toBe(1);
  });

  it('passes height to popup', () => {
    const wrapper = mount(<FloatingToolbar target={target} fitHeight={30} />);
    expect(wrapper.find(Popup).props().fitHeight).toBe(30);
  });

  // temp disable, will introduce emotion test lib and unskip this test
  it.skip('passes height to container', () => {
    const wrapper = mount(<FloatingToolbar target={target} fitHeight={32} />);

    expect(
      wrapper.find('div[data-testid="popup-container"]').props().height,
    ).toBe(32);
  });
});

describe('Renders custom UI on toolbar', () => {
  it('should render a custom react component', () => {
    const wrapper = mountWithIntl(
      <Toolbar
        items={items}
        dispatchCommand={() => {}}
        node={undefined as any}
      />,
    );
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('.dummy-container').length).toEqual(1);
  });
});
