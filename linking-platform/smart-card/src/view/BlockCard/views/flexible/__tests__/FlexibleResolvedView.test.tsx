import React from 'react';
import { CardState } from '@atlaskit/linking-common';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import FlexibleResolvedView from '../FlexibleResolvedView';
import { mockAnalytics } from '../../../../../utils/mocks';
import { mockConfluenceResponse } from './__mocks__/blockCardMocks';
import { ffTest } from '@atlassian/feature-flags-test-utils';

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
    expect(footerBlock.children[1]?.textContent?.trim()).toBe(
      'Full screen view',
    );
    expect(previewBlock).toBeDefined();
  });
  describe('elements like Comments & reactions rendered in top block or bottom metadata block, depending on the FF  ', () => {
    ffTest(
      'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
      async () => {
        const { findAllByTestId } = renderComponent();
        const metadataElements = await findAllByTestId(
          'smart-block-metadata-resolved-view',
        );

        const bottomMetadataElements = await findAllByTestId(
          'smart-element-badge',
        );
        const reactCount = bottomMetadataElements[0];
        const commentCount = bottomMetadataElements[1];
        expect(metadataElements.length).toEqual(2);
        expect(metadataElements[1].children).toContain(
          reactCount.parentElement,
        );
        expect(metadataElements[1].children).toContain(
          commentCount.parentElement,
        );
      },
      async () => {
        const { findAllByTestId } = renderComponent();
        const metadataElements = await findAllByTestId(
          'smart-block-metadata-resolved-view',
        );
        const topMetadataElements = await findAllByTestId(
          'smart-element-badge',
        );
        const reactCount = topMetadataElements[0];
        const commentCount = topMetadataElements[1];
        expect(metadataElements.length).toEqual(1);
        expect(metadataElements[0]).toContainElement(
          commentCount.parentElement,
        );
        expect(metadataElements[0]).toContainElement(reactCount.parentElement);
      },
    );
  });
});
