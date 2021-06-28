import React, { useState } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import styled from 'styled-components';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { TabGroupField, TabField } from '@atlaskit/editor-common/extensions';

const TabWrapper = styled.div`
  // increase specificity to make sure the tab style is overridden
  &&& [role='tabpanel'][tabindex] {
    padding: 0;
  }

  &&& [role='tablist']::before {
    left: 0;
    right: 0;
  }
`;

const PanelWrapper = styled.div`
  flex-grow: 1;
`;

type Props = {
  field: TabGroupField;
  renderPanel: (tabField: TabField) => JSX.Element;
} & InjectedIntlProps;

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
    <TabWrapper>
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
            <PanelWrapper>{renderPanel(field)}</PanelWrapper>
          </TabPanel>
        ))}
      </Tabs>
    </TabWrapper>
  );
};
TabGroupImpl.displayName = 'TabGroup';

const TabGroup = injectIntl(TabGroupImpl);
export default TabGroup;
