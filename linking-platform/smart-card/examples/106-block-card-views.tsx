/** @jsx jsx */
import { ProviderProps } from '@atlaskit/link-provider';
import { jsx, css } from '@emotion/react';
import React from 'react';
import { IntlProvider } from 'react-intl-next';

import Page from '@atlaskit/page';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import { token } from '@atlaskit/tokens';

import { Frame } from '../src/view/BlockCard/components/Frame';
import { Thumbnail } from '../src/view/BlockCard/components/Thumbnail';
import { Icon } from '../src/view/common/Icon';
import { Name } from '../src/view/BlockCard/components/Name';
import { Byline } from '../src/view/common/Byline';
import { Provider } from '../src/view/BlockCard/components/Provider';
import { MetadataList } from '../src/view/common/MetadataList';
import { CollaboratorList } from '../src/view/BlockCard/components/CollaboratorList';
import { ActionList } from '../src/view/BlockCard/components/ActionList';

import {
  BlockCardResolvedView,
  BlockCardResolvingView,
  PreviewAction,
} from '../src/view/BlockCard';
import { CollaboratorListProps } from '../src/view/BlockCard/components/CollaboratorList';
import { mockAnalytics } from '../src/utils/mocks';
import CardView from './utils/card-view';
import {
  ErroredClient,
  ForbiddenClient,
  ForbiddenWithObjectRequestAccessClient,
  ForbiddenWithSiteDeniedRequestClient,
  ForbiddenWithSiteDirectAccessClient,
  ForbiddenWithSiteForbiddenClient,
  ForbiddenWithSitePendingRequestClient,
  ForbiddenWithSiteRequestAccessClient,
  NotFoundClient,
  NotFoundWithSiteAccessExistsClient,
  UnAuthClient,
  UnAuthClientWithNoAuthFlow,
} from './utils/custom-client';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const headerCSS = css`
  margin-top: 28px;
  margin-bottom: ${token('space.200', '16px')};
`;
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const subHeaderCSS = css`
  margin-top: 28px;
  margin-bottom: ${token('space.100', '8px')};
`;

const resolvedViewDetails = [
  {
    icon: <AttachmentIcon size="small" label="attachment" />,
    text: '2',
    tooltip: '2 attachments',
  },
  {
    icon: <CommentIcon size="small" label="comment" />,
    text: '5',
    tooltip: '5 attachments',
  },
];

const resolvedIconProps = {
  url: 'https://cdn.iconscout.com/icon/free/png-512/dropbox-186-1180072.png',
};

const resolvedCollabProps: CollaboratorListProps = {
  items: [
    {
      src: 'https://i.pravatar.cc/300',
      name: 'Mizuki',
    },
    {
      src: 'https://i.pravatar.cc/300',
      name: 'Tom',
    },
    {
      src: 'https://i.pravatar.cc/300',
      name: 'Jacob',
    },
    {
      src: 'https://i.pravatar.cc/300',
      name: 'Anand',
    },
    {
      src: 'https://i.pravatar.cc/300',
      name: 'Baek',
    },
    {
      src: 'https://i.pravatar.cc/300',
      name: 'Cheese',
    },
  ],
  handleAvatarClick: (event) => {
    event.stopPropagation();
    event.preventDefault();
  },
  handleMoreAvatarsClick: () => {},
};

const resolvedActionListProps = {
  showDefaultActions: true,
  items: [
    {
      id: 'like',
      text: 'Like',
      promise: () =>
        new Promise<void>((resolve) => setTimeout(() => resolve(), 2000)),
    },
    {
      id: 'subscribe',
      text: 'Subscribe',
      promise: () =>
        new Promise<void>((_resolve, reject) =>
          setTimeout(() => reject(), 2000),
        ),
    },
    {
      id: 'open',
      text: 'Open',
      promise: () =>
        new Promise<void>((resolve, _reject) =>
          setTimeout(() => resolve(), 2000),
        ),
    },
    {
      id: 'download',
      text: 'Download',
      promise: () =>
        new Promise<void>((resolve, _reject) =>
          setTimeout(() => resolve(), 2000),
        ),
    },
  ],
};

const bylineProps = {
  text: 'Updated 2 days ago. Created 3 days ago.',
  tooltip: 'Here is a byline',
};

const providerProps = {
  name: 'Dropbox',
  icon: 'https://cdn.iconscout.com/icon/free/png-512/dropbox-186-1180072.png',
};

const kittyThumb =
  'https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png';

const render = (
  client: ProviderProps['client'],
  title: string,
  description?: string,
) => (
  <React.Fragment>
    <h6>{title}</h6>
    {description ? <p>Context: {description}</p> : undefined}
    <CardView
      appearance="block"
      client={client}
      url="https://site.atlassian.net/browse/key-1"
    />
  </React.Fragment>
);

export default () => {
  return (
    <IntlProvider locale={'en'}>
      <Page>
        <div style={{ padding: '30px' }}>
          <h2 css={headerCSS}>Components</h2>
          <h6 css={subHeaderCSS}>Frame</h6>
          <Frame />
          <h6 css={subHeaderCSS}>Frame (selected)</h6>
          <Frame isSelected />
          <h6 css={subHeaderCSS}>Frame (hoverable)</h6>
          <Frame isHoverable />
          <h6 css={subHeaderCSS}>Frame (compact)</h6>
          <Frame compact />
          <h6 css={subHeaderCSS}>Frame (compact + selected)</h6>
          <Frame isSelected compact />
          <h6 css={subHeaderCSS}>Frame (compact + hoverable)</h6>
          <Frame isHoverable compact />
          <h6 css={subHeaderCSS}>Image</h6>
          <Thumbnail src={kittyThumb} />
          <h6 css={subHeaderCSS}>Icon</h6>
          <Icon url="https://upload.wikimedia.org/wikipedia/commons/3/3a/Dropbox_Logo_02.svg" />
          <h6 css={subHeaderCSS}>Name</h6>
          <Name name="Smart Links designs" />
          <h6 css={subHeaderCSS}>Byline</h6>
          <Byline {...bylineProps} />
          <h6 css={subHeaderCSS}>Provider</h6>
          <Provider {...providerProps} />
          <h6 css={subHeaderCSS}>Metadata</h6>
          <MetadataList items={resolvedViewDetails} />
          <h6 css={subHeaderCSS}>Collaborators</h6>
          <CollaboratorList {...resolvedCollabProps} />
          <h6 css={subHeaderCSS}>Actions</h6>
          <ActionList {...resolvedActionListProps} />
          <h6 css={subHeaderCSS}>Preview Action</h6>
          <ActionList
            items={[
              PreviewAction({
                src: kittyThumb,
                url: kittyThumb,
                providerName: 'somePlace',
                title: 'some-place/file.js',
                details: resolvedViewDetails,
                icon: resolvedIconProps,
                download: 'something',
                byline: 'Look some fancy text',
                analytics: mockAnalytics,
              }),
            ]}
          />
          <h2 css={headerCSS}>Views</h2>
          <h6 css={subHeaderCSS}>Resolving View</h6>
          <BlockCardResolvingView />
          <h6 css={subHeaderCSS}>Resolved View</h6>
          <BlockCardResolvedView
            icon={resolvedIconProps}
            users={resolvedCollabProps.items}
            actions={resolvedActionListProps.items}
            thumbnail={kittyThumb}
            byline={bylineProps.text}
            context={{ text: providerProps.name, icon: providerProps.icon }}
            title="Smart Links designs"
            link="https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png"
            handleAvatarClick={() => {
              console.log('you clicked an avatar!');
            }}
          />
          <h6 css={subHeaderCSS}>Resolved View (with details)</h6>
          <BlockCardResolvedView
            icon={resolvedIconProps}
            users={resolvedCollabProps.items}
            actions={resolvedActionListProps.items}
            thumbnail={kittyThumb}
            context={{ text: providerProps.name, icon: providerProps.icon }}
            title="Smart Links designs"
            details={resolvedViewDetails}
            link="https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png"
            handleAvatarClick={() => {
              console.log('you clicked an avatar!');
            }}
          />
          {render(new ForbiddenClient(), '[Forbidden] Default')}
          {render(
            new ForbiddenWithSiteRequestAccessClient(),
            '[Forbidden] Site - Request Access',
            "I don't have access to the site, but I can request access",
          )}
          {render(
            new ForbiddenWithSitePendingRequestClient(),
            '[Forbidden] Site - Pending Request',
            "I don't have access to the site, but I’ve already requested access and I’m waiting",
          )}
          {render(
            new ForbiddenWithSiteDeniedRequestClient(),
            '[Forbidden] Site - Denied Request',
            "I don't have access to the site, and my previous request was denied",
          )}
          {render(
            new ForbiddenWithSiteDirectAccessClient(),
            '[Forbidden] Site - Direct Access',
            "I don't have access to the site, but I can join directly",
          )}
          {render(
            new ForbiddenWithObjectRequestAccessClient(),
            '[Forbidden] Object - Request Access',
            'I have access to the site, but not the object',
          )}
          {render(
            new ForbiddenWithSiteForbiddenClient(),
            '[Forbidden] Forbidden',
            "When you don't have access to the site, and you can’t request access",
          )}
          {render(new NotFoundClient(), '[Not Found] Default')}
          {render(
            new NotFoundWithSiteAccessExistsClient(),
            '[Not Found] Access Exists',
            'I have access to the site, but not the object or object is not-found',
          )}
          {render(new UnAuthClient(), '[Unauthorized]')}
          {render(
            new UnAuthClientWithNoAuthFlow(),
            '[Unauthorized] No auth flow',
          )}
          {render(new NotFoundClient(), '[Not Found]')}
          {render(new ErroredClient(), '[Error]')}
        </div>
      </Page>
    </IntlProvider>
  );
};
