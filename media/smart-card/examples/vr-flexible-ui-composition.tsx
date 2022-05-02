/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { IntlProvider } from 'react-intl-next';
import { css, jsx } from '@emotion/core';

import {
  AsanaTask,
  BitbucketPullRequest,
  BitbucketRepository,
  ConfluencePage,
} from './../examples-helpers/_jsonLDExamples';
import { VRTestWrapper } from './utils/vr-test';
import { TitleBlock } from '../src/view/FlexibleCard/components/blocks';
import { exampleTokens, getJsonLdResponse } from './utils/flexible-ui';
import {
  ActionName,
  Card,
  Client,
  Provider,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
} from '../src/index';

const listStyles = css`
  list-style: none;
  margin-top: 0;
  max-width: 300px;
  padding-left: 0;
  li {
    padding: 4px 10px 4px 8px;
    &:hover {
      background-color: ${exampleTokens.backgroundColor};
      border-radius: 3px;
    }
  }
`;

const examples = {
  'https://simple-list/01': BitbucketPullRequest,
  'https://simple-list/02': BitbucketRepository,
  'https://simple-list/03': ConfluencePage,
  'https://simple-list/04': AsanaTask,
};

class CustomClient extends Client {
  fetchData(url: string) {
    const response = getJsonLdResponse(
      url,
      undefined,
      examples[url as keyof typeof examples],
    );
    return Promise.resolve(response);
  }
}

const renderSimpleListItem = (url: string) => (
  <Card
    appearance="inline"
    ui={{
      hideBackground: true,
      hideElevation: true,
      hidePadding: true,
      size: SmartLinkSize.Large,
      theme: SmartLinkTheme.Black,
    }}
    url={url}
  >
    <TitleBlock
      actions={[
        {
          hideContent: true,
          name: ActionName.DeleteAction,
          onClick: () => console.log('Delete action!'),
          size: SmartLinkSize.XLarge,
        },
      ]}
      showActionOnHover={true}
      position={SmartLinkPosition.Center}
      maxLines={1}
    />
  </Card>
);

export default () => (
  <VRTestWrapper title="Flexible UI: Composition">
    <IntlProvider locale="en">
      <h5>Simple list view with actions</h5>
      <Provider client={new CustomClient('staging')}>
        <ul css={listStyles}>
          {Object.keys(examples).map((key) => (
            <li>{renderSimpleListItem(key)}</li>
          ))}
        </ul>
      </Provider>
    </IntlProvider>
  </VRTestWrapper>
);
