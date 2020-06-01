import React from 'react';
import {
  NavigationProvider,
  LayoutManager,
  HeaderSection,
  MenuSection,
  GlobalNav,
  Item,
  ItemAvatar,
  ContainerHeader,
  Separator,
  Wordmark,
} from '@atlaskit/navigation-next';
import { JiraIcon, JiraWordmark } from '@atlaskit/logo';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import Avatar from '@atlaskit/avatar';
import AddIcon from '@atlaskit/icon/glyph/add';
import SearchIcon from '@atlaskit/icon/glyph/search';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

type ClassNameProps = { className: string };

const Nav = () => (
  <GlobalNav
    primaryItems={[
      {
        id: 'jira',
        icon: ({ label }: any) => <JiraIcon size="medium" label={label} />,
        label: 'Jira',
      },
      { id: 'search', icon: SearchIcon },
      { id: 'create', icon: AddIcon },
    ]}
    secondaryItems={[
      { id: 'help', icon: QuestionCircleIcon, label: 'Help', size: 'small' },
      {
        icon: () => <Avatar borderColor="transparent" size="small" />,
        label: 'Profile',
        size: 'small',
        id: 'profile',
      },
    ]}
  />
);

const ContainerNavigation = () => (
  <div>
    <HeaderSection>
      {({ css }: any) => (
        <div
          style={{
            ...css,
            paddingBottom: '16px',
          }}
        >
          <ContainerHeader
            before={(itemState: any) => (
              <ItemAvatar
                itemState={itemState}
                appearance="square"
                size="large"
              />
            )}
            text="Fabric Editor"
            subText="Renderer"
          />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }: ClassNameProps) => (
        <div className={className}>
          <Item before={BacklogIcon} text="Backlog" isSelected />
          <Item before={BoardIcon} text="Active sprints" />
          <Item before={GraphLineIcon} text="Reports" />
          <Separator />
        </div>
      )}
    </MenuSection>
  </div>
);

const ProductNavigation = () => (
  <div>
    <HeaderSection>
      {({ className }: ClassNameProps) => (
        <div className={className}>
          <Wordmark wordmark={JiraWordmark} />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }: ClassNameProps) => (
        <div className={className}>
          <Item text="Dashboards" />
          <Item text="Projects" />
          <Item text="Issues" />
        </div>
      )}
    </MenuSection>
  </div>
);

const LOCALSTORAGE_renderer_sidebar_key =
  'fabric.editor.examples.renderer.sidebar';

export const getDefaultShowSidebarState = (defaultValue = false) => {
  if (localStorage) {
    const defaultState = localStorage.getItem(
      LOCALSTORAGE_renderer_sidebar_key,
    );
    if (defaultState) {
      return JSON.parse(defaultState).showSidebar;
    }
  }

  return defaultValue;
};

export function NavigationNext({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <LayoutManager
        globalNavigation={Nav}
        productNavigation={ProductNavigation}
        containerNavigation={ContainerNavigation}
      >
        <div style={{ padding: 40 }}>{children}</div>
      </LayoutManager>
    </NavigationProvider>
  );
}

type SidebarProps = { children: any; showSidebar: boolean };

export default class Sidebar extends React.Component<
  SidebarProps,
  { showSidebar: boolean }
> {
  componentDidUpdate(prevProps: SidebarProps) {
    if (prevProps.showSidebar !== this.props.showSidebar) {
      localStorage.setItem(
        LOCALSTORAGE_renderer_sidebar_key,
        JSON.stringify({ showSidebar: this.props.showSidebar }),
      );
    }
  }

  render() {
    if (typeof this.props.children !== 'function') {
      return this.props.children;
    }

    if (!this.props.showSidebar) {
      return this.props.children({});
    }

    const additionalRendererProps = {
      appearance: 'full-page',
      allowDynamicTextSizing: true,
    };

    return (
      <NavigationNext>
        {this.props.children(additionalRendererProps)}
      </NavigationNext>
    );
  }
}
