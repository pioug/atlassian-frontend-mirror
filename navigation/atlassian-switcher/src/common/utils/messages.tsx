import React from 'react';
import { defineMessages } from 'react-intl';
import FormattedMessage from '../../ui/primitives/formatted-message';

import IntlProvider from '../../ui/components/intl-provider';

const messages = defineMessages({
  atlassianStart: {
    id: 'fabric.atlassianSwitcher.start',
    defaultMessage: 'Atlassian Start',
    description: 'The text of a link redirecting the user to the Start site',
  },
  switchTo: {
    id: 'fabric.atlassianSwitcher.switchTo',
    defaultMessage: 'Switch to',
    description:
      'In a context in which users are able to switch between products, this text is the title of the category displaying the products the user is able to switch to.',
  },
  switchToTooltip: {
    id: 'fabric.atlassianSwitcher.switchToTooltip',
    defaultMessage: 'Switch to…',
    description:
      'This text appears as a tooltip when a user hovers over the atlassian switcher icon before clicking on it.',
  },
  recent: {
    id: 'fabric.atlassianSwitcher.recent',
    defaultMessage: 'Recent',
    description:
      "In a context in which users are able to view recent projects or spaces they've viewed, this text is the title of the section displaying all the recent projects or spaces.",
  },
  more: {
    id: 'fabric.atlassianSwitcher.more',
    defaultMessage: 'More',
    description:
      'In a context in which users are able to view predefined custom links, this text is the title of the section displaying all existing custom links.',
  },
  try: {
    id: 'fabric.atlassianSwitcher.try',
    defaultMessage: 'Try',
    description:
      'This text appears as a way to encourage the user to try a new Atlassian product.',
  },
  manageList: {
    id: 'fabric.atlassianSwitcher.manageList',
    defaultMessage: 'Manage list',
    description:
      'This text is for the action for a user to manage the values present in an editable list of links.',
  },
  jiraProject: {
    id: 'fabric.atlassianSwitcher.jiraProject',
    defaultMessage: 'Jira project',
    description:
      'In a context in which several items are listed , this text describes that the specific type of a given item is a Jira project',
  },
  confluenceSpace: {
    id: 'fabric.atlassianSwitcher.confluenceSpace',
    defaultMessage: 'Confluence space',
    description:
      'In a context in which several items are listed , this text describes that the specific type of a given item is a Confluence space',
  },
  administration: {
    id: 'fabric.atlassianSwitcher.administration',
    defaultMessage: 'Administration',
    description:
      'The text of a link redirecting the user to the site administration',
  },
  discoverMore: {
    id: 'fabric.atlassianSwitcher.discoverMore',
    defaultMessage: 'More Atlassian products',
    description:
      'The text of a link redirecting the user to Discover More Atlassian products',
  },
  browseApps: {
    id: 'fabric.atlassianSwitcher.browseApps',
    defaultMessage: 'Browse Marketplace apps',
    description:
      'The text of a link redirecting the user to Discover Embedded Marketplace within in the product (Marketplace is a brand name. Please dont translate it)',
  },
  errorHeading: {
    id: 'fabric.atlassianSwitcher.errorHeading',
    defaultMessage: 'Something’s gone wrong',
    description:
      'Heading of the error screen which is shown when an unknown error happens in the Atlassian Switcher. Usually due to failed network requests.',
  },
  errorText: {
    id: 'fabric.atlassianSwitcher.errorText',
    defaultMessage:
      'We keep track of these errors, but feel free to contact us if refreshing doesn’t fix things',
    description:
      'Text that is displayed when an unknown error happens in the Atlassian Switcher.',
  },
  errorImageAltText: {
    id: 'fabric.atlassianSwitcher.errorImageAltText',
    defaultMessage: 'A broken robot and a number of people busy fixing it.',
    description:
      'Text displayed as alt text when an error occurs in the Atlassian Switcher',
  },
  errorTextNetwork: {
    id: 'fabric.atlassianSwitcher.errorTextNetwork',
    defaultMessage:
      'We couldn’t load this list. Please reload the page and try again.',
    description: 'Text that is displayed when we detect a network issue.',
  },
  errorHeadingLoggedOut: {
    id: 'fabric.atlassianSwitcher.errorHeadingLoggedOut',
    defaultMessage: 'Your Atlassian account is logged out',
    description:
      'Heading of the error screen which is shown when an unknown error happens in the Atlassian Switcher. Usually due to failed network requests.',
  },
  errorTextLoggedOut: {
    id: 'fabric.atlassianSwitcher.errorTextLoggedOut',
    defaultMessage: 'Log in again to use the Atlassian\u00A0switcher.',
    description: 'Text that is displayed when we detect user is logged out.',
  },
  errorHeadingUnverified: {
    id: 'fabric.atlassianSwitcher.errorHeadingUnverified',
    defaultMessage: 'Your account is unverified',
    description:
      'Heading that is displayed when we detect user account is unverified.',
  },
  errorTextUnverified: {
    id: 'fabric.atlassianSwitcher.errorTextUnverified',
    defaultMessage:
      'Please confirm your email address to view a list of available products.',
    description:
      'Text that is displayed when we detect user account is unverified.',
  },
  login: {
    id: 'fabric.atlassianSwitcher.login',
    defaultMessage: 'Log in',
    description: 'Text in log in button.',
  },
  showMoreSites: {
    id: 'fabric.atlassianSwitcher.show.more.sites',
    defaultMessage: 'Show more sites',
    description: 'The text of a toggle showing more site options',
  },
  discover: {
    id: 'fabric.atlassianSwitcher.discover',
    defaultMessage: 'Discover',
    description: 'The header of "Discover" section',
  },
  productDescriptionConfluence: {
    id: 'fabric.atlassianSwitcher.product.description.confluence',
    defaultMessage: 'Document collaboration',
    description: 'Text displayed under the Confluence product recommendation.',
  },
  freeEditionProductDescriptionConfluence: {
    id: 'fabric.atlassianSwitcher.free.edition.product.description.confluence',
    defaultMessage: 'Free document collaboration for up to 10 users',
    description:
      'Text displayed under the Confluence product recommendation for the free edition of the product.',
  },
  productDescriptionJiraServiceDesk: {
    id: 'fabric.atlassianSwitcher.product.description.jsd',
    defaultMessage: 'IT service desk and customer service',
    description:
      'Text displayed under the Jira Service Desk product recommendation.',
  },
  productDescriptionJiraServiceDeskMystique: {
    id: 'fabric.atlassianSwitcher.product.description.jsm',
    defaultMessage: 'Collaborative IT service management',
    description:
      'Text displayed under the Jira Service Desk Mystique product recommendation.',
  },
  freeEditionProductDescriptionJiraServiceDesk: {
    id: 'fabric.atlassianSwitcher.free.edition.product.description.jsd',
    defaultMessage:
      'Free IT service and customer service desk for up to 3 agents',
    description:
      'Text displayed under the Jira Service Desk product recommendation for the free edition of the product.',
  },
  freeEditionProductDescriptionJiraServiceManagement: {
    id: 'fabric.atlassianSwitcher.free.edition.product.description.jsm',
    defaultMessage:
      'Free collaborative IT service management for up to 3 agents',
    description:
      'Text displayed under the Jira Service Desk Mystique product recommendation for the free edition of the product.',
  },
  productDescriptionJiraSoftware: {
    id: 'fabric.atlassianSwitcher.product.description.jsw',
    defaultMessage: 'Project and issue tracking',
    description:
      'Text displayed under the Jira Software product recommendation.',
  },
  freeEditionProductDescriptionJiraSoftware: {
    id: 'fabric.atlassianSwitcher.free.edition.product.description.jsw',
    defaultMessage: 'Free project and issue tracking for up to 10 users',
    description:
      'Text displayed under the Jira Software product recommendation for the free edition of the product.',
  },
  // Leaving these commented out for now pending a decision to be made on the fate of Jira Core
  // productDescriptionJiraCore: {
  //   id: 'fabric.atlassianSwitcher.product.description.jira.core',
  //   defaultMessage: 'Business Managmenet',
  //   description: 'Text displayed under the Jira Core product recommendation.',
  // },
  // freeEditionProductDescriptionJiraCore: {
  //   id: 'fabric.atlassianSwitcher.free.edition.product.description.jira.core',
  //   defaultMessage: 'Free business management for up to 10 users',
  //   description:
  //     'Text displayed under the Jira Core product recommendation for the free edition of the product.',
  // },
  productDescriptionOpsgenie: {
    id: 'fabric.atlassianSwitcher.product.description.opsgenie',
    defaultMessage: 'Modern incident management',
    description: 'Text displayed under the Opsgenie product recommendation.',
  },
  productDescriptionDragonfruit: {
    id: 'fabric.atlassianSwitcher.product.description.dragonfruit',
    defaultMessage: 'Component manager',
    description: 'Text displayed under the Dragonfruit product recommendation.',
  },
  join: {
    id: 'fabric.atlassianSwitcher.join',
    defaultMessage: 'Join',
    description:
      'Section Header in Atlassian Switcher. To set the expectation of what items would be shown in following section. Shown when an user has at least one joinable site via Domain Enabled Sign up with common collaborators.',
  },
  signUpToJoinHeader: {
    id: 'fabric.atlassianSwitcher.sign.up.to.join.header',
    defaultMessage: 'Join {productLabel}',
    description: 'Header of the Sign up to join banner.',
  },
  signUpToJoinBody: {
    id: 'fabric.atlassianSwitcher.sign.up.to.join.body',
    defaultMessage:
      'To join {productLabel}, use your email address {email} to create an Atlassian account or log in if you already have one.',
    description:
      'Text in the body of the Sign up to join banner. Gives the user context on what is going to happen when they try to join a site.',
  },
  signUpToJoinCTA: {
    id: 'fabric.atlassianSwitcher.sign.up.to.join.cta',
    defaultMessage: 'Join with your email',
    description:
      'Text in the call to action button in the Sign up to join banner.',
  },
  signUpToJoinImageAltText: {
    id: 'fabric.atlassianSwitcher.sign.up.to.join.image',
    defaultMessage: 'A team looking at multiple holographic screens',
    description: 'An image of a team looking at multiple holographic screens.',
  },
  trelloHasNewFriendsHeading: {
    id: 'fabric.atlassianSwitcher.trello.has.new.freinds.heading',
    defaultMessage: 'Trello has some new friends',
    description: 'Heading of the Trello has new friends banner.',
  },
  trelloHasNewFriendsBody: {
    id: 'fabric.atlassianSwitcher.trello.has.new.freinds.body',
    defaultMessage:
      'You can now quickly find other Atlassian products right here in Trello. If you decide to try one, we’ll help you get set up with your Atlassian account.',
    description: 'Body of the Trello has new friends banner.',
  },
  trelloHasNewFriendsDismiss: {
    id: 'fabric.atlassianSwitcher.trello.has.new.freinds.dismiss',
    defaultMessage: 'Got it!',
    description:
      'Text in the button used to dismiss the Trello has new friends banner.',
  },
});

export const SwitchToTooltipText = (
  <IntlProvider>
    <FormattedMessage {...messages.switchToTooltip} />
  </IntlProvider>
);

export default messages;
