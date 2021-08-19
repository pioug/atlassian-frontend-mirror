/** @jsx jsx */
import {
  Children,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { jsx } from '@emotion/core';

import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import { TabListContext, TabPanelContext } from '../internal/context';
import { getTabsStyles } from '../internal/styles';
import { onMouseDownBlur } from '../internal/utils';
import { SelectedType, TabsProps } from '../types';

const analyticsAttributes = {
  componentName: 'tabs',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const getTabPanelWithContext = ({
  tabPanel,
  index,
  isSelected,
  tabsId,
}: {
  tabPanel?: ReactNode;
  isSelected: boolean;
  index: SelectedType;
  tabsId: string;
}) =>
  // Ensure tabPanel exists in case it has been removed
  tabPanel && (
    <TabPanelContext.Provider
      value={{
        role: 'tabpanel',
        id: `${tabsId}-${index}-tab`,
        hidden: isSelected ? undefined : true,
        'aria-labelledby': `${tabsId}-${index}`,
        onMouseDown: onMouseDownBlur,
        tabIndex: isSelected ? 0 : -1,
      }}
      key={index}
    >
      {tabPanel}
    </TabPanelContext.Provider>
  );

type InnerProps = TabsProps & {
  mode: ThemeModes;
};

const TabsWithMode = (props: InnerProps) => {
  const {
    shouldUnmountTabPanelOnChange = false,
    selected: SelectedType,
    defaultSelected,
    onChange: onChangeProp,
    id,
    analyticsContext,
    children,
    testId,
    mode,
  } = props;

  const [selectedState, setSelected] = useState(
    SelectedType || defaultSelected || 0,
  );
  const selected = SelectedType === undefined ? selectedState : SelectedType;

  const childrenArray = Children.toArray(children)
    // Don't include any conditional children
    .filter((child) => Boolean(child));
  // First child should be a tabList followed by tab panels
  const [tabList, ...tabPanels] = childrenArray;

  // Keep track of visited and add to a set
  const visited = useRef<Set<SelectedType>>(new Set([selected]));
  if (!visited.current.has(selected)) {
    visited.current.add(selected);
  }

  const onChange = useCallback(
    (index: SelectedType, analyticsEvent: UIAnalyticsEvent) => {
      if (onChangeProp) {
        onChangeProp(index, analyticsEvent);
      }
      setSelected(index);
    },
    [onChangeProp],
  );

  const onChangeAnalytics = usePlatformLeafEventHandler({
    fn: onChange,
    action: 'clicked',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  const tabPanelsWithContext = shouldUnmountTabPanelOnChange
    ? getTabPanelWithContext({
        tabPanel: tabPanels[selected],
        index: selected,
        isSelected: true,
        tabsId: id,
      })
    : // If a panel has already been visited, don't unmount it
      Array.from(visited.current).map((tabIndex: SelectedType) =>
        getTabPanelWithContext({
          tabPanel: tabPanels[tabIndex],
          index: tabIndex,
          isSelected: tabIndex === selected,
          tabsId: id,
        }),
      );

  const tabsStyles = useMemo(() => getTabsStyles(mode), [mode]);

  return (
    // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
    <div data-testid={testId} css={tabsStyles}>
      <TabListContext.Provider
        value={{ selected, onChange: onChangeAnalytics, tabsId: id }}
      >
        {tabList}
      </TabListContext.Provider>
      {tabPanelsWithContext}
    </div>
  );
};

export const Tabs = (props: TabsProps) => (
  <GlobalTheme.Consumer>
    {({ mode }: { mode: ThemeModes }) => (
      <TabsWithMode {...props} mode={mode} />
    )}
  </GlobalTheme.Consumer>
);

export default Tabs;
