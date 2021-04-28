import { KeyboardEvent, MouseEvent, ReactNode } from 'react';

import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';

export interface TabProps {
  /**
   * The children to be rendered within a `Tab`.
   */
  children: ReactNode;
  /**
   * A `testId` prop is  is a unique string that appears as a data attribute `data-testid`
   * on the `Tab` element, serving as a hook for automated tests.
   */
  testId?: string;
}

export interface TabPanelProps {
  /**
   * The children to be rendered within a `TabPanel`.
   */
  children: ReactNode;
  /**
   * A `testId` prop is  is a unique string that appears as a data attribute `data-testid`
   * on the `TabPanel` element, serving as a hook for automated tests.
   */
  testId?: string;
}

/**
 * @deprecated
 * Previously this was the type for the tabs prop that was used like
 * <Tabs tabs={tabs} />
 * The codemod changes this to be
 * <Tabs>
 *  <TabList>
 *    {tabs.map(tab => <Tab testId={tab.testId}>{tab.label}</Tab>)}
 *  </TabList>
 *  {tabs.map(tab => <TabPanel>{tab.content}</TabPanel>)}
 * </Tabs>
 * The TabData type remains so the variable used in tabs can have a type.
 */
export interface TabData {
  /** String to be put inside a tab */
  label?: string;
  /** String to be put inside a tab panel */
  content?: ReactNode;
  /** A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests. This `testId` is put on the tab. */
  testId?: string;
  /** Used by consumers to convey extra information about the tab. */
  [key: string]: any;
}

export type SelectedType = number;
export type OnChangeCallback = (
  index: SelectedType,
  analyticsEvent: UIAnalyticsEvent,
) => void;

export interface TabsProps extends WithAnalyticsEventsProps {
  /**
   * The index of the tab that will be selected by default when the component mounts.
   * If not set the first tab will be displayed by default.
   */
  defaultSelected?: SelectedType;
  /**
   * A callback function which will be fired when a changed. It will be passed
   * the index of the selected tab and a `UIAnalyticsEvent`.
   */
  onChange?: OnChangeCallback;
  /**
   * The selected tab's index. If this prop is set the component behaves as a
   * controlled component. It will be up to you to listen to `onChange`.
   */
  selected?: SelectedType;
  /**
   * Tabs by default leaves `TabPanel`'s mounted on the page after they have been selected.
   * If you would like to unmount a `TabPanel` when it is not selected, set this prop to
   * be true.
   */
  shouldUnmountTabPanelOnChange?: boolean;
  /**
   * Additional information to be included in the `context` of analytics events that come from `Tabs`.
   */
  analyticsContext?: Record<string, any>;
  /**
   * A `testId` prop is a unique string that appears as a data attribute `data-testid`
   * on the `Tabs` element, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * The children of Tabs. The first child should be a `TabList` filled with `Tab`'s.
   * Subsequent children should be `TabPanel`'s. There should be a `Tab` for each `TabPanel`.
   * If you want to customize `Tab` or `TabPanel`, refer to the examples in the documentation.
   */
  children: ReactNode;
  /**
   * A unique ID that will be used to generate IDs for tabs and tab panels.
   * This is required for accessibility purposes.
   */
  id: string;
}

export interface TabListProps {
  /**
   * A collection of `Tab`'s.  There should be a `Tab` for each `TabPanel`.
   * If you want to customize `Tab` there is documentation in the tab section.
   */
  children: ReactNode;
}

export type TabAttributesType = {
  /**
   * Changes the selected tab.
   */
  onClick: () => void;
  /**
   * ID of the tab.
   */
  id: string;
  /**
   * The id of the tab panel that this tab links.
   */
  'aria-controls': string;
  /**
   * The position of this tab within the tab list.
   */
  'aria-posinset': number;
  /**
   * Whether this tab is selected.
   */
  'aria-selected': boolean;
  /**
   * The number of tabs in this tab list.
   */
  'aria-setsize': number;
  /**
   * Prevents a focus ring being shown when clicked.
   */
  onMouseDown: (e: MouseEvent<HTMLElement>) => void;
  /**
   * Allows navigation of tabs with automatic activation.
   * Read here for more details: https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html
   */
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  /**
   * Role is "tab".
   */
  role: 'tab';
  /**
   * If the tab is selected the tab index is 0 and is focusable.
   * Otherwise it is -1 and is not focusable.
   */
  tabIndex: number;
};

export type TabListAttributesType = {
  /**
   * The index of the selected tab.
   */
  selected: SelectedType;
  /**
   * A unique ID that will be used to generate IDs for tabs and tab panels.
   * This is required for accessibility reasons.
   */
  tabsId: string;
  /**
   * A callback function which will be fired when a tab is changed.
   */
  onChange: (index: SelectedType) => void;
};

export type TabPanelAttributesType = {
  /**
   * Role is "tabpanel".
   */
  role: 'tabpanel';
  /**
   * ID of the the tab panel.
   */
  id: string;
  /**
   * Hidden is true if it is not the selected tab.
   */
  hidden?: boolean;
  /**
   * The id of the tab that links to this tab panel.
   */
  'aria-labelledby': string;
  /**
   * Prevents a focus ring being shown when clicked.
   */
  onMouseDown: (e: MouseEvent<HTMLElement>) => void;
  /**
   * If the tab panel is selected the tab index is 0 and is focusable.
   * Otherwise it is -1 and is not focusable.
   */
  tabIndex: number;
};
