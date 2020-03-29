import React, { Fragment, Component } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import { AtlassianIcon, AtlassianWordmark } from '@atlaskit/logo';
import {
  ContainerHeader,
  GroupHeading,
  Item,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  Section,
  Separator,
} from '@atlaskit/navigation-next';

import FeedbackCollector from '../src';

const EMBEDDABLE_KEY = 'your_jsd_embeddable_key';
const REQUEST_TYPE_ID = 'your_jsd_request_type_id';
const name = 'Feedback Sender';
const email = 'fsender@atlassian.com';

class FeedbackCollectorNavItem extends Component {
  state = {
    isFeedbackModalOpen: false,
  };

  openModal = () => {
    this.setState({ isFeedbackModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isFeedbackModalOpen: false });
  };

  handleSubmit = () => {
    /* ... */
  };

  render() {
    const { isFeedbackModalOpen } = this.state;
    return (
      <Fragment>
        <Item
          before={FeedbackIcon}
          text="Give Feedback"
          onClick={this.openModal}
        />
        {isFeedbackModalOpen && (
          <FeedbackCollector
            onClose={this.closeModal}
            onSubmit={this.handleSubmit}
            email={email}
            name={name}
            requestTypeId={REQUEST_TYPE_ID}
            embeddableKey={EMBEDDABLE_KEY}
            additionalFields={[
              {
                id: 'customfield_123456',
                value: 'Some additional value',
              },
              {
                id: 'customfield_65432',
                value: { id: 'another_value' },
              },
              {
                id: 'customfield_123654',
                value: [{ id: 'value' }],
              },
            ]}
          />
        )}
      </Fragment>
    );
  }
}

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <AtlassianIcon size="medium" />}
    onProductClick={() => {}}
  />
);

const MyProductNavigation = () => (
  <div css={{ padding: '16px 0' }}>
    <Section>
      {({ className }: { className: string }) => (
        <div className={className}>
          <div css={{ padding: '8px 0' }}>
            <AtlassianWordmark />
          </div>
        </div>
      )}
    </Section>
    <Section>
      {({ className }: { className: string }) => (
        <div className={className}>
          <Item text="Dashboard" />
          <Item text="Things" />
          <Item text="Settings" />
          <Separator />
          <GroupHeading>Add-ons</GroupHeading>
          <Item text="My plugin" />
        </div>
      )}
    </Section>
  </div>
);
const MyContainerNavigation = () => (
  <div css={{ padding: '16px 0' }}>
    <Section>
      {({ className }: { className: string }) => (
        <div className={className}>
          <ContainerHeader
            before={(itemState: any) => (
              <ItemAvatar
                itemState={itemState}
                appearance="square"
                src="https://ecosystem.atlassian.net/secure/projectavatar?pid=12870&amp;avatarId=10011"
              />
            )}
            text="Customer Feedback"
            subText="Project to store customer feedback"
          />
        </div>
      )}
    </Section>
    <Section>
      {({ className }: { className: string }) => (
        <div className={className}>
          <Item text="Dashboards" />
          <Item text="Reports" />
          <Separator />
          <GroupHeading>Feedback</GroupHeading>
          <FeedbackCollectorNavItem />
        </div>
      )}
    </Section>
  </div>
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productNavigation={MyProductNavigation}
      containerNavigation={MyContainerNavigation}
    >
      <div>Kanban Board or Queues with some awesome feedback.</div>
    </LayoutManager>
  </NavigationProvider>
);
