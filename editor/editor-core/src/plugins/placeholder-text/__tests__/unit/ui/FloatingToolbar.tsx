import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
// eslint-disable-next-line no-restricted-imports, import/no-extraneous-dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { Popup } from '@atlaskit/editor-common/ui';
import FloatingToolbar from '../../../ui/FloatingToolbar/index';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import Toolbar from '@atlaskit/editor-plugin-floating-toolbar/src/ui/Toolbar';
import type {
  Command,
  FloatingToolbarItem,
} from '@atlaskit/editor-common/types';

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
        featureFlags={{}}
        api={undefined}
      />,
    );
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('.dummy-container').length).toEqual(1);
  });
});
