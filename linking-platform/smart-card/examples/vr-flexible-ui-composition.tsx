/** @jsx jsx */
import { IntlProvider } from 'react-intl-next';
import { JsonLd } from 'json-ld-types';
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { VRTestWrapper } from './utils/vr-test';
import {
  FooterBlock,
  MetadataBlock,
  SnippetBlock,
  TitleBlock,
} from '../src/view/FlexibleCard/components/blocks';
import { exampleTokens } from './utils/flexible-ui';
import {
  ActionName,
  Card,
  Client,
  ElementItem,
  ElementName,
  PreviewBlock,
  Provider,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
} from '../src/index';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { CustomActionItem } from '../src/view/FlexibleCard/components/blocks/types';
import {
  response1,
  response2,
  response3,
  response4,
} from './content/example-responses';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const listStyles = css`
  list-style: none;
  margin-top: 0;
  max-width: 300px;
  padding-left: 0;
  li {
    padding: ${token('space.050', '4px')} 10px ${token('space.050', '4px')}
      ${token('space.100', '8px')};
    &:hover {
      background-color: ${exampleTokens.backgroundColor};
      border-radius: 3px;
    }
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const previewStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  > div {
    max-width: 350px;
    min-width: 350px;
  }
`;

const examples = {
  'https://simple-list/01': response1,
  'https://simple-list/02': response2,
  'https://simple-list/03': response3,
  'https://simple-list/04': response4,
};

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(
      examples[url as keyof typeof examples] as JsonLd.Response,
    );
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

const renderPreview = (url: string) => {
  const primary = {
    'https://simple-list/01': [
      { name: ElementName.ModifiedOn },
      { name: ElementName.CreatedBy },
    ],
    'https://simple-list/02': [
      { name: ElementName.AuthorGroup },
      { name: ElementName.State },
      { name: ElementName.Priority },
    ],
    'https://simple-list/03': [
      { name: ElementName.AuthorGroup },
      { name: ElementName.CreatedBy },
      { name: ElementName.CommentCount },
      { name: ElementName.ReactCount },
    ],
    'https://simple-list/04': [
      { name: ElementName.ModifiedOn },
      { name: ElementName.CreatedBy },
    ],
  }[url] as ElementItem[];

  const body =
    url === 'https://simple-list/01' ? (
      <PreviewBlock />
    ) : (
      <SnippetBlock></SnippetBlock>
    );

  const titleActions = [
    {
      name: ActionName.CustomAction,
      icon: <ShortcutIcon label="open in new tab" size="medium" />,
      iconPosition: 'before',
      onClick: () => {},
      tooltipMessage: 'Go to',
    } as CustomActionItem,
  ];
  const footerActions = [
    {
      name: ActionName.CustomAction,
      content: 'Preview',
      onClick: () => {},
      tooltipMessage: 'Preview',
    } as CustomActionItem,
  ];
  return (
    <Card
      appearance="block"
      ui={{
        size: SmartLinkSize.Large,
        theme: SmartLinkTheme.Black,
      }}
      url={url}
    >
      <TitleBlock actions={titleActions} />
      <MetadataBlock primary={primary} size={SmartLinkSize.Small} />
      {body}
      <FooterBlock actions={footerActions} />
    </Card>
  );
};

export default () => (
  <VRTestWrapper title="Flexible UI: Composition">
    <IntlProvider locale="en">
      <Provider client={new CustomClient('staging')}>
        <h5>Simple list view with actions</h5>
        <ul css={listStyles}>
          {Object.keys(examples).map((key: string, idx: number) => (
            <li key={idx}>{renderSimpleListItem(key)}</li>
          ))}
        </ul>
        <h5>Link preview</h5>
        <div css={previewStyles}>
          {Object.keys(examples).map((key: string, idx: number) => (
            <div key={idx}>{renderPreview(key)}</div>
          ))}
        </div>
      </Provider>
    </IntlProvider>
  </VRTestWrapper>
);
