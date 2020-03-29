import React, { Component } from 'react';
import { mount, shallow, ReactWrapper } from 'enzyme';

import TabsWithAnalytics, { TabContent, TabItem } from '../../..';
import { TabsWithoutAnalytics as Tabs } from '../../Tabs';
import {
  IsSelectedTestFunction,
  TabContentComponentProvided,
  TabItemComponentProvided,
} from '../../../types';
import { name } from '../../../version.json';

declare var global: any;

const tabs = [
  { content: 'Tab 1 content', label: 'Tab 1 label' },
  { content: 'Tab 2 content', label: 'Tab 2 label' },
  { content: 'Tab 3 content', label: 'Tab 3 label' },
];

const clickTab = (tabsComponent: ReactWrapper, tabIndex: number) => {
  tabsComponent
    .find(TabItem)
    .at(tabIndex)
    .simulate('click');
};

describe(name, () => {
  describe('Tabs', () => {
    describe('rendering', () => {
      const wrapper = mount(<Tabs tabs={tabs} />);

      it('should be able to create a component', () => {
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a tab navigation item for every entry in the array', () => {
        expect(wrapper.find(TabItem)).toHaveLength(tabs.length);
      });

      it('should only ever render a single tab content pane', () => {
        expect(wrapper.find(TabContent)).toHaveLength(1);
      });
    });

    describe('props', () => {
      describe('defaultSelected', () => {
        it('should set the selected tab on initial mount', () => {
          const wrapper = shallow(
            <Tabs tabs={tabs} defaultSelected={tabs[1]} />,
          );

          expect(wrapper.state('selected')).toEqual(tabs[1]);
        });

        it('should accept an index', () => {
          const wrapper = shallow(<Tabs tabs={tabs} defaultSelected={2} />);
          expect(wrapper.state('selected')).toEqual(tabs[2]);
        });

        it('should use the isSelectedTest function if provided', () => {
          const isSelectedTest: IsSelectedTestFunction = (selected, tab) =>
            tab.label === selected;
          const wrapper = shallow(
            <Tabs
              tabs={tabs}
              defaultSelected="Tab 2 label"
              isSelectedTest={isSelectedTest}
            />,
          );
          expect(wrapper.state('selected')).toEqual(tabs[1]);
        });

        it('changing this prop should not update the selected tab after the initial mount', () => {
          const wrapper = shallow(
            <Tabs tabs={tabs} defaultSelected={tabs[1]} />,
          );
          wrapper.setProps({ defaultSelected: tabs[2] });
          expect(wrapper.state('selected')).toEqual(tabs[1]);
        });
      });

      describe('selected', () => {
        it('should set the selected tab on initial mount', () => {
          const wrapper = shallow(<Tabs tabs={tabs} selected={tabs[1]} />);
          expect(wrapper.state('selected')).toEqual(tabs[1]);
        });

        it('should take precedence over defaultSelected', () => {
          const wrapper = shallow(
            <Tabs tabs={tabs} defaultSelected={tabs[1]} selected={tabs[2]} />,
          );
          expect(wrapper.state('selected')).toEqual(tabs[2]);
        });

        it('should use the isSelectedTest function if provided', () => {
          const isSelectedTest: IsSelectedTestFunction = (selected, tab) =>
            tab.label === selected;
          const wrapper = shallow(
            <Tabs
              tabs={tabs}
              selected="Tab 2 label"
              isSelectedTest={isSelectedTest}
            />,
          );
          expect(wrapper.state('selected')).toEqual(tabs[1]);
        });

        it('changing this prop should update the selected tab after the initial mount', () => {
          const wrapper = shallow(<Tabs tabs={tabs} selected={tabs[1]} />);
          wrapper.setProps({ selected: tabs[2] });
          expect(wrapper.state('selected')).toEqual(tabs[2]);
        });

        it('should default to the first tab if neither selected nor defaultSelected are set', () => {
          const wrapper = shallow(<Tabs tabs={tabs} />);
          expect(wrapper.state('selected')).toEqual(tabs[0]);
        });

        describe("setting this prop should make the component 'controlled'", () => {
          it('should not maintain its own internal state', () => {
            const uncontrolledTabs = mount(
              <Tabs tabs={tabs} defaultSelected={tabs[1]} />,
            );
            clickTab(uncontrolledTabs, 2);
            expect(uncontrolledTabs.state('selected')).toEqual(tabs[2]);

            const controlledTabs = mount(
              <Tabs tabs={tabs} selected={tabs[1]} />,
            );
            clickTab(controlledTabs, 2);
            expect(controlledTabs.state('selected')).toEqual(tabs[1]);
          });

          it('should not maintain its own internal state even if tabs change', () => {
            const nextGenTabs = [...tabs];
            const controlledTabs = mount(
              <Tabs tabs={nextGenTabs} selected={1} />,
            );

            expect(controlledTabs.state('selected')).toEqual(nextGenTabs[1]);

            controlledTabs.setProps({
              tabs: [...tabs],
              selected: 2,
            });

            expect(controlledTabs.state('selected')).toEqual(nextGenTabs[2]);
          });
        });
      });

      describe('isSelectedTest', () => {
        it('should override the in-built check to determine whether a tab is selected', () => {
          const isSelectedTest: IsSelectedTestFunction = (selected, tab) =>
            tab.label === selected;
          const wrapper = shallow(
            <Tabs tabs={tabs} isSelectedTest={isSelectedTest} />,
          );
          expect(wrapper.state('selected')).toEqual(tabs[0]);
          wrapper.setProps({ selected: 'Tab 2 label' });
          expect(wrapper.state('selected')).toEqual(tabs[1]);
        });
      });

      describe('components', () => {
        it('should render a custom tab content component if components.Content is provided', () => {
          const TabContentComponent = (props: TabContentComponentProvided) => (
            <div>{props.data.content}</div>
          );
          const wrapper = mount(
            <Tabs components={{ Content: TabContentComponent }} tabs={tabs} />,
          );
          expect(wrapper.find(TabContentComponent)).toHaveLength(1);
        });

        it('should render a custom tab item component if components.Item is provided', () => {
          const TabItemComponent = (props: TabItemComponentProvided) => (
            <div>{props.data.label}</div>
          );
          const wrapper = mount(
            <Tabs components={{ Item: TabItemComponent }} tabs={tabs} />,
          );
          expect(wrapper.find(TabItemComponent)).toHaveLength(tabs.length);
        });

        it('should render the in-built components by default', () => {
          const wrapper = mount(<Tabs tabs={tabs} />);
          expect(wrapper.find(TabContent)).toHaveLength(1);
          expect(wrapper.find(TabItem)).toHaveLength(tabs.length);
        });
      });

      describe('onSelect', () => {
        it('is not fired for default selected tab', () => {
          const spy = jest.fn();
          mount(<Tabs onSelect={spy} tabs={tabs} defaultSelected={tabs[0]} />);
          mount(<Tabs onSelect={spy} tabs={tabs} selected={tabs[0]} />);
          expect(spy).not.toHaveBeenCalled();
        });
        it('is fired with the selected tab and its index when selected by click', () => {
          const spy = jest.fn();
          const wrapper = mount(<Tabs onSelect={spy} tabs={tabs} />);

          clickTab(wrapper, 2);
          expect(spy).toHaveBeenCalledWith(tabs[2], 2);
        });
        it('is fired with the selected tab and its index when selected by keyboard', () => {
          const spy = jest.fn();
          const wrapper = mount(<Tabs onSelect={spy} tabs={tabs} />);

          wrapper
            .find(TabItem)
            .at(0)
            .simulate('keyDown', {
              key: 'ArrowRight',
            });
          expect(spy).toHaveBeenCalledWith(tabs[1], 1);
        });
      });
    });

    describe('behaviour', () => {
      describe('keyboard navigation', () => {
        describe('with 3 tabs, when the 2nd tab is selected', () => {
          let wrapper: ReactWrapper;
          const simulateKeyboardNav = (index: number, key: string) => {
            wrapper
              .find(TabItem)
              .at(index)
              .simulate('keyDown', { key });
          };

          beforeEach(() => {
            wrapper = mount(<Tabs tabs={tabs} defaultSelected={tabs[1]} />);
          });

          it('pressing LEFT arrow selects the first tab', () => {
            expect(wrapper.state('selected')).toBe(tabs[1]);
            simulateKeyboardNav(1, 'ArrowLeft');
            expect(wrapper.state('selected')).toBe(tabs[0]);
          });

          it('pressing the RIGHT arrow selects the last tab', () => {
            expect(wrapper.state('selected')).toBe(tabs[1]);
            simulateKeyboardNav(1, 'ArrowRight');
            expect(wrapper.state('selected')).toBe(tabs[2]);
          });

          it('pressing the LEFT arrow twice leaves selection on the first tab', () => {
            expect(wrapper.state('selected')).toBe(tabs[1]);
            simulateKeyboardNav(1, 'ArrowLeft');
            simulateKeyboardNav(0, 'ArrowLeft');
            expect(wrapper.state('selected')).toBe(tabs[0]);
          });

          it('pressing the RIGHT arrow twice leaves selection on the last tab', () => {
            expect(wrapper.state('selected')).toBe(tabs[1]);
            simulateKeyboardNav(1, 'ArrowRight');
            simulateKeyboardNav(2, 'ArrowRight');
            expect(wrapper.state('selected')).toBe(tabs[2]);
          });
        });
      });
    });
  });
});

describe('TabsWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<TabsWithAnalytics tabs={tabs} />);
    // eslint-disable-next-line no-console
    expect(console.warn).not.toHaveBeenCalled();
    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled();
  });
});
