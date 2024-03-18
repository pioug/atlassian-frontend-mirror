import React from 'react';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render } from '@testing-library/react';
import ContentContainer from '../components/ContentContainer';
import { hoverCardClassName } from '../components/HoverCardContent';
import type { ContentContainerProps } from '../types';
import { useAISummary } from '../../../state/hooks/use-ai-summary';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';

jest.mock('../../../state/hooks/use-ai-summary', () => ({
  useAISummary: jest.fn().mockReturnValue({ state: { status: 'ready' } }),
}));

describe('ContentContainer', () => {
  const content = 'test content';
  const testId = 'test-id';
  const url = 'https://some.url';

  const setup = (props: Partial<ContentContainerProps> = {}) =>
    render(
      <SmartCardProvider
        storeOptions={{
          initialState: {
            [url]: {
              status: 'resolved',
              details: {
                data: { url: url },
              } as any,
            },
          },
        }}
      >
        <ContentContainer testId={testId} url={url} {...props}>
          {content}
        </ContentContainer>
      </SmartCardProvider>,
    );

  describe('returns hover card content container', () => {
    ffTest(
      'platform.linking-platform.smart-card.hover-card-ai-summaries',
      async () => {
        const { findByTestId } = setup();

        const contentContainer = await findByTestId(testId);

        expect(contentContainer).toBeInTheDocument();
        expect(contentContainer.textContent).toBe(content);
        expect(contentContainer.classList.contains(hoverCardClassName)).toBe(
          true,
        );
      },
    );
  });

  describe('when AI summary is enabled', () => {
    describe('wraps container in AI prism', () => {
      ffTest(
        'platform.linking-platform.smart-card.hover-card-ai-summaries',
        async () => {
          const { findByTestId } = setup({ isAIEnabled: true });
          const prism = await findByTestId(`${testId}-prism`);
          const svg = prism.querySelector('svg');

          expect(prism).toBeInTheDocument();
          expect(svg).toHaveStyleDeclaration('opacity', '0');
        },
        async () => {
          const { queryByTestId } = setup({ isAIEnabled: true });
          const prism = await queryByTestId(`${testId}-prism`);
          expect(prism).not.toBeInTheDocument();
        },
      );
    });

    describe('shows AI prism', () => {
      ffTest(
        'platform.linking-platform.smart-card.hover-card-ai-summaries',
        async () => {
          (useAISummary as jest.Mock).mockReturnValue({
            state: { status: 'loading', content: '' },
            summariseUrl: jest.fn(),
          });

          const { findByTestId } = setup({
            isAIEnabled: true,
          });

          const prism = await findByTestId(`${testId}-prism`);
          const svg = prism.querySelector('svg');
          expect(svg).toHaveStyleDeclaration('opacity', '1');
        },
        async () => {
          const { queryByTestId } = setup({ isAIEnabled: true });
          const prism = await queryByTestId(`${testId}-prism`);
          expect(prism).not.toBeInTheDocument();
        },
      );
    });
  });
});
