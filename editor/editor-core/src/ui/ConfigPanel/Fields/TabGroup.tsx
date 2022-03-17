/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { TabGroupField, TabField } from '@atlaskit/editor-common/extensions';

const tabWrapper = css`
  // increase specificity to make sure the tab style is overridden
  &&& [role='tabpanel'][tabindex] {
    padding: 0;
  }

  &&& [role='tablist']::before {
    left: 0;
    right: 0;
  }
`;

const panelWrapper = css`
  flex-grow: 1;
  max-width: 100%;
`;

type Props = {
  field: TabGroupField;
  renderPanel: (tabField: TabField) => JSX.Element;
} & WrappedComponentProps;

const TabGroupImpl = (props: Props) => {
  const { field, renderPanel } = props;
  const { fields } = field;

  const [activeTab, setActiveTab] = useState<number>(() => {
    const activeTabName = field.defaultTab || fields[0].name;
    const index = fields.findIndex((f) => f.name === activeTabName);
    return Math.max(index, 0);
  });

  const onChange = React.useCallback(
    (index: number) => {
      setActiveTab(index);
    },
    [setActiveTab],
  );

  return (
    <div css={tabWrapper}>
      <Tabs
        id={`configPanelTabs-${field.name}`}
        onChange={onChange}
        selected={activeTab}
      >
        <TabList>
          {fields.map(({ name, label }) => (
            <Tab key={`tab-${name}`}>{label}</Tab>
          ))}
        </TabList>
        {fields.map((field) => (
          <TabPanel key={`panel-${field.name}`}>
            <div css={panelWrapper}>{renderPanel(field)}</div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};
TabGroupImpl.displayName = 'TabGroup';

const TabGroup = injectIntl(TabGroupImpl);
export default TabGroup;
