/** @jsx jsx */
import { Component } from 'react';

import { jsx } from '@emotion/core';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { tabStyles } from '../internal/styles';
import {
  IsSelectedTestFunction,
  SelectedProp,
  TabData,
  TabsProps,
  TabsState,
} from '../types';

import DefaultTabContent from './TabContent';
import DefaultTabItem from './TabItem';
import TabsNavigation from './TabsNavigation';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const defaultIsSelectedTestNumber: IsSelectedTestFunction = (
  selectedIndex,
  _tab,
  tabIndex,
) => selectedIndex === tabIndex;

const defaultIsSelectedTestObject: IsSelectedTestFunction = (selected, tab) =>
  selected === tab;

const defaultComponents = {
  Content: DefaultTabContent,
  Item: DefaultTabItem,
};

class Tabs extends Component<TabsProps, TabsState> {
  static defaultProps = {
    components: {},
    isContentPersisted: false,
  };

  constructor(props: TabsProps) {
    super(props);

    const initiallyselected =
      this.props.selected || this.props.defaultSelected || this.props.tabs[0];

    const selected = this.resolveSelected(initiallyselected);

    this.state = {
      selected,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps: TabsProps) {
    if (
      typeof newProps.selected !== 'undefined' &&
      newProps.selected !== this.state.selected
    ) {
      const selected = this.resolveSelected(newProps.selected, newProps);
      this.setState({ selected });
    } else if (newProps.tabs !== this.props.tabs) {
      const updatedselected = this.resolveSelected(
        this.state.selected,
        newProps,
      );
      this.setState({ selected: updatedselected });
    }
  }

  resolveSelected = (selected: SelectedProp, newProps?: TabsProps): TabData => {
    const { tabs, isSelectedTest } = newProps || this.props;

    const testFunction: IsSelectedTestFunction = (() => {
      if (isSelectedTest) {
        return isSelectedTest;
      }
      if (typeof selected === 'number') {
        return defaultIsSelectedTestNumber;
      }
      return defaultIsSelectedTestObject;
    })();

    return (
      tabs.find((tab, tabIndex) => testFunction(selected, tab, tabIndex)) ||
      tabs[0]
    );
  };

  onSelect = (newselected: TabData, newSelectedIndex: number) => {
    const { onSelect, selected } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(newselected, newSelectedIndex);
    }
    if (typeof selected === 'undefined') {
      this.setState({ selected: newselected });
    }
  };

  render() {
    const { components, tabs, testId, isContentPersisted } = this.props;
    const { selected } = this.state;

    const { Content, Item } = { ...defaultComponents, ...components };

    const contents = () => {
      return tabs.map((tab, index) => {
        const isSelected = tab === selected;
        const contentProps = {
          data: tab,
          elementProps: {
            role: 'tabpanel',
          },
          isSelected,
        };
        return <Content key={index} {...contentProps} />;
      });
    };

    const contentProps = {
      data: selected,
      elementProps: {
        role: 'tabpanel',
      },
      isSelected: true,
    };

    return (
      <div data-testid={testId} css={tabStyles}>
        <TabsNavigation
          component={Item}
          onSelect={this.onSelect}
          selected={selected}
          tabs={tabs}
        />
        {isContentPersisted ? contents() : <Content {...contentProps} />}
      </div>
    );
  }
}

export { Tabs as TabsWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'tabs',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onSelect: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'tab',

      attributes: {
        componentName: 'tabs',
        packageName,
        packageVersion,
      },
    }),
  })(Tabs),
);
