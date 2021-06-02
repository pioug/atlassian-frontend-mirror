/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlProvider } from 'react-intl';

import { Appearance } from '@atlaskit/button/types';
import Page from '@atlaskit/page';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import CommentIcon from '@atlaskit/icon/glyph/comment';

import { Frame } from '../src/BlockCard/components/Frame';
import { Thumbnail } from '../src/BlockCard/components/Thumbnail';
import { Icon } from '../src/BlockCard/components/Icon';
import { Name } from '../src/BlockCard/components/Name';
import { Byline } from '../src/BlockCard/components/Byline';
import { Provider } from '../src/BlockCard/components/Provider';
import { MetadataList } from '../src/BlockCard/components/MetadataList';
import { CollaboratorList } from '../src/BlockCard/components/CollaboratorList';
import { ActionList } from '../src/BlockCard/components/ActionList';

import {
  BlockCardResolvedView,
  BlockCardResolvingView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardErroredView,
  PreviewAction,
  BlockCardNotFoundView,
} from '../src/BlockCard';
import { CollaboratorListProps } from '../src/BlockCard/components/CollaboratorList';

const headerCSS = css`
  margin-top: 28px;
  margin-bottom: 16px;
`;
const subHeaderCSS = css`
  margin-top: 28px;
  margin-bottom: 8px;
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
        new Promise((resolve) => setTimeout(() => resolve(), 2000)),
    },
    {
      id: 'subscribe',
      text: 'Subscribe',
      promise: () =>
        new Promise((_resolve, reject) => setTimeout(() => reject(), 2000)),
    },
    {
      id: 'open',
      text: 'Open',
      promise: () =>
        new Promise((resolve, _reject) => setTimeout(() => resolve(), 2000)),
    },
    {
      id: 'download',
      text: 'Download',
      promise: () =>
        new Promise((resolve, _reject) => setTimeout(() => resolve(), 2000)),
    },
  ],
};

const failedActionListProps = {
  showDefaultActions: true,
  items: [
    {
      id: 'tryagain',
      text: 'Try a different account',
      promise: () =>
        new Promise((resolve) => setTimeout(() => resolve(), 2000)),
    },
  ],
};

const unauthorisedActionListProps = {
  showDefaultActions: true,
  items: [
    {
      id: 'connect',
      text: 'Connect',
      buttonAppearance: 'default' as Appearance,
      promise: () =>
        new Promise((resolve) => setTimeout(() => resolve(), 2000)),
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
          <h6 css={subHeaderCSS}>Unauthorized View</h6>
          <BlockCardUnauthorisedView
            icon={resolvedIconProps}
            link={
              'https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png'
            }
            actions={unauthorisedActionListProps.items}
            context={{ text: providerProps.name, icon: providerProps.icon }}
          />
          <h6 css={subHeaderCSS}>Permission Denied View</h6>
          <BlockCardForbiddenView
            icon={resolvedIconProps}
            link={
              'https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png'
            }
            context={{ text: providerProps.name, icon: providerProps.icon }}
            actions={failedActionListProps.items}
          />
          <h6 css={subHeaderCSS}>Not Found View</h6>
          <BlockCardNotFoundView
            icon={resolvedIconProps}
            link={
              'https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png'
            }
            context={{ text: providerProps.name, icon: providerProps.icon }}
          />
          <h6 css={subHeaderCSS}>Error View</h6>

          <BlockCardErroredView
            onRetry={() => {}}
            link={
              'https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png'
            }
          />
        </div>
      </Page>
    </IntlProvider>
  );
};
