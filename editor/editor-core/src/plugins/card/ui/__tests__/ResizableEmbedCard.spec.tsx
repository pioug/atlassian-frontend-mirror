import React from 'react';
import { mount } from 'enzyme';
import {
  doc,
  embedCard,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { CardOptions } from '@atlaskit/editor-common';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
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

    const component = mount(
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
      </ResizableEmbedCard>,
    );

    const heightDefiner = component.find(
      '[data-testid="resizable-embed-card-height-definer"]',
    );
    const heightDefinerStyle = heightDefiner.props().style || {};
    return {
      component,
      heightDefiner,
      heightDefinerStyle,
    };
  };

  describe('height definer', () => {
    it('should render', () => {
      const { heightDefiner } = setup();
      expect(heightDefiner).toHaveLength(1);
    });

    it('should have paddingBottom defined with default aspect ratio in %', () => {
      const { heightDefinerStyle } = setup();
      expect(heightDefinerStyle.height).not.toBeDefined();
      expect(heightDefinerStyle.paddingBottom).toEqual('calc(70.588% + 32px)');
    });

    it('should have paddingBottom defined with given aspect ratio in %', () => {
      const { heightDefinerStyle } = setup({
        aspectRatio: 1.7,
      });
      expect(heightDefinerStyle.height).not.toBeDefined();
      expect(heightDefinerStyle.paddingBottom).toEqual('calc(58.824% + 32px)');
    });

    it('should have height defined when explicit height is given', () => {
      const { heightDefinerStyle } = setup({
        height: 42,
      });
      expect(heightDefinerStyle.height).toEqual('42px');
      expect(heightDefinerStyle.paddingBottom).not.toBeDefined();
    });
  });
});
