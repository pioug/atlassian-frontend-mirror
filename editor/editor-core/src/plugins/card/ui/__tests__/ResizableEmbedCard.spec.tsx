import React from 'react';
import { mount } from 'enzyme';
import { doc, embedCard } from '@atlaskit/editor-test-helpers';
import { CardOptions } from '@atlaskit/editor-common';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import ResizableEmbedCard, {
  Props as ResizableEmbedCardProps,
} from '../ResizableEmbedCard';

describe('ResizableEmbedCard', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any, cardProps?: Partial<CardOptions>) => {
    return createEditor({
      doc,
      editorProps: {
        UNSAFE_cards: {
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
      expect(heightDefinerStyle.paddingBottom).toEqual('70.588%');
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
