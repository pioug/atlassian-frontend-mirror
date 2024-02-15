import React from 'react';
import { CardState } from '@atlaskit/linking-common';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import FlexibleResolvedView from '../FlexibleResolvedView';
import { mockAnalytics } from '../../../../../utils/mocks';
import { mockConfluenceResponse } from './__mocks__/blockCardMocks';
import MockAtlasProject from '../../../../../__fixtures__/atlas-project';

describe('FlexibleResolvedView', () => {
  const url = 'https://some.url';

  const renderComponent = (
    props?: Partial<React.ComponentProps<typeof FlexibleResolvedView>>,
  ) =>
    renderWithIntl(
      <SmartCardProvider>
        <FlexibleResolvedView
          analytics={mockAnalytics}
          cardState={
            {
              status: 'resolved',
              details: mockConfluenceResponse,
            } as CardState
          }
          url={url}
          {...props}
        />
      </SmartCardProvider>,
    );

  it('renders resolved view', async () => {
    const { findByTestId } = renderComponent();

    const titleBlock = await findByTestId('smart-block-title-resolved-view');
    const footerBlock = await findByTestId('smart-footer-block-resolved-view');
    const snippetBlock = await findByTestId(
      'smart-block-snippet-resolved-view',
    );
    const previewBlock = await findByTestId(
      'smart-block-preview-resolved-view',
    );

    expect(titleBlock.textContent?.trim()).toBe('I love cheese');
    expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
    expect(footerBlock.firstElementChild?.textContent?.trim()).toBe(
      'Confluence',
    );
    expect(footerBlock.children[1]?.textContent?.trim()).toBe('Open preview');
    expect(previewBlock).toBeDefined();
  });

  it('elements like Comments & reactions rendered in top block or bottom metadata block', async () => {
    const { findAllByTestId } = renderComponent();
    const metadataElements = await findAllByTestId(
      'smart-block-metadata-resolved-view',
    );

    const bottomMetadataElements = await findAllByTestId('smart-element-badge');
    const reactCount = bottomMetadataElements[0];
    const commentCount = bottomMetadataElements[1];
    expect(metadataElements.length).toEqual(2);
    expect(metadataElements[1].children).toContain(reactCount.parentElement);
    expect(metadataElements[1].children).toContain(commentCount.parentElement);
  });

  it('renders server actions', async () => {
    const { findByTestId } = renderComponent({
      cardState: {
        status: 'resolved',
        details: MockAtlasProject,
      } as CardState,
      actionOptions: { hide: false },
    });
    await findByTestId('smart-footer-block-resolved-view');

    const followAction = await findByTestId('smart-action-follow-action');
    expect(followAction).toBeInTheDocument();
    expect(followAction.textContent).toEqual('Follow');
  });
});
