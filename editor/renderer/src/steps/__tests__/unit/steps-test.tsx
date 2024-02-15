import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl-next';
import ReactSerializer from '../../../react/index';
import { getPosFromRange, resolvePos } from '../../index';
import { complexDocument as doc } from './__fixtures__/documents';

describe('steps', () => {
  const DOC_ROOT_OFFSET = 1;

  let container: HTMLElement | null = document.createElement('div');
  let docFromSchema: PMNode;
  let reactAdf: JSX.Element;
  let root: any; // Change to Root once we go full React 18
  let firstValidParagraphPosition: number;
  let firstValidParagraph: HTMLElement;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    docFromSchema = schema.nodeFromJSON(doc);
    const reactSerializer = new ReactSerializer({
      surroundTextNodesWithTextWrapper: true,
    });

    reactAdf = reactSerializer.serializeFragment(docFromSchema.content)!;

    docFromSchema.descendants((node, pos) => {
      if (node.type.name === 'paragraph' && !firstValidParagraphPosition) {
        firstValidParagraphPosition = pos + DOC_ROOT_OFFSET;
      }

      return false;
    });
    if (process.env.IS_REACT_18 === 'true') {
      // @ts-ignore react-dom/client only available in react 18
      // eslint-disable-next-line import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
      const { createRoot } = await import('react-dom/client');
      root = createRoot(container!);
      act(() => {
        root.render(<IntlProvider locale="en">{reactAdf}</IntlProvider>);
      });
    } else {
      render(<IntlProvider locale="en">{reactAdf}</IntlProvider>, container);
    }
    firstValidParagraph = container!.querySelector(
      `p[data-renderer-start-pos="${firstValidParagraphPosition}"]`,
    ) as HTMLElement;
  });

  afterEach(() => {
    if (process.env.IS_REACT_18 === 'true') {
      root.unmount();
    } else {
      unmountComponentAtNode(container!);
    }
  });

  describe('#getPosFromRange', () => {
    describe('when a paragraph is selected', () => {
      it('should calc the position', () => {
        const myRange = new Range();
        const PARENT_OFFSET = 1;
        myRange.setStart(firstValidParagraph, 0);
        myRange.setEnd(
          firstValidParagraph.nextElementSibling as HTMLElement,
          0,
        );
        const paragraphNode = docFromSchema.nodeAt(
          firstValidParagraphPosition - PARENT_OFFSET,
        )!;
        expect(getPosFromRange(myRange)).toEqual({
          from: firstValidParagraphPosition,
          to: firstValidParagraphPosition + paragraphNode.nodeSize,
        });
      });
    });

    describe('when a part of paragraph is selected', () => {
      it('should calc the position', () => {
        const myRange = new Range();
        const PARENT_OFFSET = 1;
        myRange.setStart(firstValidParagraph, 0);
        myRange.setEnd(firstValidParagraph.childNodes[1] as HTMLElement, 0);
        const paragraphNode = docFromSchema.nodeAt(
          firstValidParagraphPosition - PARENT_OFFSET,
        )!;
        const textNode = paragraphNode.nodeAt(0)!;
        expect(getPosFromRange(myRange)).toEqual({
          from: firstValidParagraphPosition,
          to: firstValidParagraphPosition + textNode.nodeSize,
        });
      });
    });
  });

  describe('#resolvePos', () => {
    describe('when the text node is inside code block', () => {
      it('should return false', () => {
        const codeBlockElements = container!.querySelectorAll('.code-block');
        const codeBlockNodes: {
          startPos: number;
          endPos: number;
          size: number;
        }[] = [];
        docFromSchema.nodesBetween(
          0,
          docFromSchema.nodeSize - 2,
          (node, pos) => {
            if (node.type.name === 'codeBlock') {
              codeBlockNodes.push({
                startPos: pos,
                endPos: pos + node.nodeSize,
                size: node.nodeSize,
              });
            }
          },
        );
        expect(codeBlockElements.length).toBe(codeBlockNodes.length);
        codeBlockElements.forEach((element, index) => {
          const node = codeBlockNodes[index];
          expect(resolvePos(element, 0)).toBe(false);
          expect(resolvePos(element, node.size)).toBe(false);
        });
      });
    });

    describe('when the node is a text element', () => {
      it('should return the same position as ProseMirror', () => {
        const firstChild = firstValidParagraph.childNodes[0];
        expect(firstChild).toBeInstanceOf(Text);
        expect(resolvePos(firstChild, 0)).toBe(firstValidParagraphPosition);
      });
    });

    describe('when the node is a HTML element', () => {
      it('should return the same position as ProseMirror', () => {
        expect(resolvePos(firstValidParagraph, 0)).toBe(
          firstValidParagraphPosition,
        );
      });
    });

    it('validate all ProseMirror nodes position', () => {
      const nodePositions: {
        element: HTMLElement;
        startPos: number;
        endPos: number;
        size: number;
      }[] = [];
      docFromSchema.nodesBetween(0, docFromSchema.nodeSize - 2, (node, pos) => {
        const element = container!.querySelector(
          `[data-renderer-start-pos="${pos + DOC_ROOT_OFFSET}"]`,
        ) as HTMLElement;

        if (element) {
          nodePositions.push({
            element,
            startPos: pos,
            endPos: pos + node.nodeSize,
            size: node.nodeSize,
          });
        }
      });

      expect(nodePositions.length).toBeGreaterThan(0);

      nodePositions.forEach(({ element, startPos, endPos, size }) => {
        expect(resolvePos(element, 0)).toBe(startPos + DOC_ROOT_OFFSET);
        expect(resolvePos(element, size)).toBe(endPos + DOC_ROOT_OFFSET);
      });
    });
  });
});
