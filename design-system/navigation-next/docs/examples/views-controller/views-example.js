import React from 'react';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import PageIcon from '@atlaskit/icon/glyph/page';
import PortfolioIcon from '@atlaskit/icon/glyph/portfolio';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { JiraWordmark } from '@atlaskit/logo';
import { colors } from '@atlaskit/theme';

import {
  ContainerHeader,
  GroupHeading,
  HeaderSection,
  Item,
  ItemAvatar,
  light,
  MenuSection,
  SectionHeading,
  Separator,
  ThemeProvider,
  Wordmark,
} from '../../../src';
import { CONTENT_NAV_WIDTH } from '../../../src/common/constants';

const FakeContentNav = ({ isContainer = false, ...props }) => (
  <ThemeProvider
    theme={() => ({
      context: isContainer ? 'container' : 'product',
      mode: light,
    })}
  >
    <div
      css={{
        backgroundColor: isContainer ? colors.N20 : colors.B500,
        color: isContainer ? colors.N500 : colors.B50,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: 450,
        width: CONTENT_NAV_WIDTH,
      }}
      {...props}
    />
  </ThemeProvider>
);

const FlexColumn = props => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      marginRight: 16,
    }}
    {...props}
  />
);

export default () => (
  <div css={{ display: 'flex', alignItems: 'stretch' }}>
    <FlexColumn>
      <h3>Product home view</h3>
      <FakeContentNav>
        <HeaderSection key="header">
          {({ className }) => (
            <div className={className}>
              <Wordmark wordmark={JiraWordmark} />
            </div>
          )}
        </HeaderSection>
        <MenuSection key="menu">
          {({ className }) => (
            <div className={className}>
              <Item before={DashboardIcon} text="Dashboards" isSelected />
              <Item before={FolderIcon} text="Projects" />
              <Item before={IssueIcon} text="Issues and filters" />
              <Item before={PortfolioIcon} text="Portfolio" />
            </div>
          )}
        </MenuSection>
      </FakeContentNav>
    </FlexColumn>
    <FlexColumn>
      <h3>Product issues view</h3>
      <FakeContentNav>
        <HeaderSection key="header">
          {({ className }) => (
            <div className={className}>
              <Wordmark wordmark={JiraWordmark} />
              <div css={{ paddingBottom: 20 }}>
                <Item
                  before={() => (
                    <ArrowLeftIcon
                      primaryColor="currentColor"
                      secondaryColor="inherit"
                    />
                  )}
                  text="Back to Jira"
                />
              </div>
            </div>
          )}
        </HeaderSection>
        <MenuSection key="menu" alwaysShowScrollHint>
          {({ className }) => (
            <div className={className}>
              <SectionHeading>Issues and filters</SectionHeading>
              <Item text="Search issues" />
              <GroupHeading>Other</GroupHeading>
              <Item text="My open issues" />
              <Item text="Reported by me" />
              <Item text="All issues" />
              <Item text="Open issues" />
              <Item text="Done issues" />
              <Item text="Viewed recently" />
              <Item text="Created recently" />
              <Item text="Resolved recently" />
              <Item text="Updated recently" />
              <Separator />
              <Item text="View all filters" />
            </div>
          )}
        </MenuSection>
      </FakeContentNav>
    </FlexColumn>
    <FlexColumn>
      <h3>Project backlog view</h3>
      <FakeContentNav isContainer>
        <HeaderSection key="header">
          {({ css }) => (
            <div css={{ ...css, paddingBottom: 20 }}>
              <ContainerHeader
                before={itemState => (
                  <ItemAvatar
                    itemState={itemState}
                    appearance="square"
                    size="large"
                  />
                )}
                subText="Project description"
                text="Project name"
              />
            </div>
          )}
        </HeaderSection>
        <MenuSection key="menu">
          {({ className }) => (
            <div className={className}>
              <Item before={BacklogIcon} text="Backlog" />
              <Item before={BoardIcon} text="Active sprints" />
              <Item before={GraphLineIcon} text="Reports" />
              <Separator />
              <Item before={ShipIcon} text="Releases" />
              <Item before={IssueIcon} text="Issues and filters" />
              <Item before={PageIcon} text="Pages" />
              <Item before={ComponentIcon} text="Components" />
            </div>
          )}
        </MenuSection>
      </FakeContentNav>
    </FlexColumn>
  </div>
);
