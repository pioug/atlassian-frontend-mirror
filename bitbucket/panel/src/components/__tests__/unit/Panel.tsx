import React from 'react';

import { mount, shallow } from 'enzyme';
import AnimateHeight from 'react-animate-height';

import Panel from '../../Panel';
import * as styles from '../../Panel/styledPanel';

const NestedContent = () => (
  <p>
    Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco
    deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit
    officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis.
  </p>
);

const Header = <span>Header</span>;

describe('Panel component', () => {
  it('toggles height prop of AnimateHeight component when clicked on header', () => {
    const wrapper = mount(
      <Panel header={Header}>
        <NestedContent />
      </Panel>,
    );
    expect(wrapper.find(AnimateHeight).props().height).toBe(0);

    const panelHeader = wrapper.find(styles.PanelHeader);
    panelHeader.simulate('click');

    expect(wrapper.find(AnimateHeight).props().height).toBe('auto');
  });
  it('is expanded by default when isDefaultExpanded is passed', () => {
    const wrapper = mount(
      <Panel header={Header} isDefaultExpanded>
        <NestedContent />
      </Panel>,
    );
    expect(wrapper.find(AnimateHeight).props().height).toBe('auto');
  });
  it('renders nested content', () => {
    const wrapper = mount(
      <Panel header={Header}>
        <NestedContent />
      </Panel>,
    );
    expect(wrapper.find(NestedContent)).toHaveLength(1);
  });
  it('header matches the snapshot', () => {
    const wrapper = shallow(
      <Panel header={Header}>
        <NestedContent />
      </Panel>,
    );
    const panelHeader = wrapper.dive().find(styles.PanelHeader);

    expect(panelHeader).toMatchSnapshot();
  });
});
