/** @jsx jsx */
import { ReactNode } from 'react';
import { css, jsx } from '@emotion/react';
import Tabs, { Tab, TabList, useTabPanel } from '@atlaskit/tabs';

const panelStyle = css`
  > div {
    width: 100%;
  }
`;

type TabItems = {
  name: string;
  content: ReactNode;
};
type DocsContentTabsProps = {
  tabs: TabItems[];
};

const CustomTabPanel = ({ children }: { children: ReactNode }) => {
  const context = useTabPanel();
  return (
    <div css={panelStyle} {...context}>
      {children}
    </div>
  );
};

export const DocsContentTabs: React.FC<DocsContentTabsProps> = ({
  tabs = [],
}: DocsContentTabsProps) => (
  <Tabs id="default">
    <TabList>
      {tabs.map(({ name }, idx: number) => (
        <Tab key={idx}>{name}</Tab>
      ))}
    </TabList>
    {tabs.map(({ content }, idx: number) => (
      <CustomTabPanel key={idx}>{content}</CustomTabPanel>
    ))}
  </Tabs>
);
