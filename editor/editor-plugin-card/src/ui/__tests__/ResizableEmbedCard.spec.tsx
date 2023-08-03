import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { CardOptions } from '@atlaskit/editor-common/card';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  DocBuilder,
  embedCard,
} from '@atlaskit/editor-test-helpers/doc-builder';

import ResizableEmbedCard, {
  Props as ResizableEmbedCardProps,
} from '../ResizableEmbedCard';

describe('ResizableEmbedCard', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder, cardProps?: Partial<CardOptions>) => {
    return createEditor({
      doc,
      editorProps: {
        smartLinks: {
          allowEmbeds: true,
          ...cardProps,
        },
      },
    });
  };

  const setup = (props: Partial<ResizableEmbedCardProps> = {}) => {
    const getPos = jest.fn(() => 0);
    const updateSize = jest.fn();
    const displayGrid = jest.fn();

    const mockInlinePmNode = embedCard({
      url: 'https://some/url',
      layout: 'center',
    })();
    const { editorView } = editor(doc(mockInlinePmNode));

    const { getAllByTestId } = render(
      <IntlProvider locale="en">
        <ResizableEmbedCard
          getPos={getPos}
          view={editorView}
          layout={'center'}
          lineLength={420}
          gridSize={12}
          containerWidth={550}
          updateSize={updateSize}
          displayGrid={displayGrid}
          {...props}
        >
          <div>some content</div>
        </ResizableEmbedCard>
      </IntlProvider>,
    );

    const heightDefiner = getAllByTestId(
      'resizable-embed-card-height-definer',
    )[1];
    return {
      heightDefiner,
    };
  };

  describe('height definer', () => {
    it('should render', () => {
      const { heightDefiner } = setup();
      expect(heightDefiner).toBeInTheDocument();
    });

    it('should have paddingBottom defined with default aspect ratio in %', () => {
      const { heightDefiner } = setup();
      expect(heightDefiner).toHaveStyle('height: undefined');
      expect(heightDefiner).toHaveStyle('padding-bottom: calc(70.588% + 32px)');
    });

    it('should have paddingBottom defined with given aspect ratio in %', () => {
      const { heightDefiner } = setup({
        aspectRatio: 1.7,
      });
      expect(heightDefiner).toHaveStyle('height: undefined');
      expect(heightDefiner).toHaveStyle('padding-bottom: calc(58.824% + 32px)');
    });

    it('should have height defined when explicit height is given', () => {
      const { heightDefiner } = setup({
        height: 42,
      });
      expect(heightDefiner).toHaveStyle('height: 42px');
      expect(heightDefiner).toHaveStyle('padding-bottom: undefined');
    });
  });
});
