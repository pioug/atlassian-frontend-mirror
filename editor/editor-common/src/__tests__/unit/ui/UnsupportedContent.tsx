import React from 'react';

import { mount } from 'enzyme';

import {
  createEditorFactory,
  doc,
  p,
  unsupportedBlock,
  unsupportedInline,
} from '@atlaskit/editor-test-helpers';

import * as Hooks from '../../../ui/hooks';
import UnsupportedBlockNode from '../../../ui/UnsupportedBlock';
import UnsupportedInlineNode from '../../../ui/UnsupportedInline';

describe('Unsupported Content', () => {
  describe('Block Node', () => {
    it('should return a node of type div', () => {
      const wrapper = mount(<UnsupportedBlockNode />);
      expect(wrapper.getDOMNode().tagName).toEqual('DIV');
      wrapper.unmount();
    });

    it('should have text content as string "Unsupported content"', () => {
      const wrapper = mount(<UnsupportedBlockNode />);
      expect(wrapper.text()).toEqual('Unsupported content');
      wrapper.unmount();
    });
    describe('content lozenge', () => {
      const createEditor = createEditorFactory();
      const editor = (doc: any) => {
        return createEditor({
          doc,
        });
      };
      let useNodeDataSpy: jest.SpyInstance<
        string,
        [(import('prosemirror-model').Node<any> | undefined)?]
      >;
      beforeEach(() => {
        useNodeDataSpy = jest.spyOn(Hooks, 'useNodeData');
      });

      afterEach(() => {
        useNodeDataSpy.mockRestore();
      });

      it('should render the text value as returned by the useNodeData hook', () => {
        useNodeDataSpy.mockReturnValue('Some text');
        const node = doc(
          '{<>}',
          unsupportedBlock({
            originalValue: {
              attrs: {},
              type: 'FooBarNode',
            },
          })(),
        );
        const { editorView: view, refs } = editor(node);

        const wrapper = mount(
          <UnsupportedBlockNode node={view.state.doc.nodeAt(refs['<>'])!} />,
        );
        expect(wrapper.text()).toEqual('Some text');
      });
    });
  });
  describe('Inline Node', () => {
    it('should return a node of type span', () => {
      const wrapper = mount(<UnsupportedInlineNode />);
      expect(wrapper.getDOMNode().tagName).toEqual('SPAN');
      wrapper.unmount();
    });

    it('should have text content as string "Unsupported content"', () => {
      const wrapper = mount(<UnsupportedInlineNode />);
      expect(wrapper.text()).toEqual(
        'Unsupported content' + String.fromCharCode(8203),
      );
      wrapper.unmount();
    });

    describe('content lozenge', () => {
      const createEditor = createEditorFactory();
      const editor = (doc: any) => {
        return createEditor({
          doc,
        });
      };
      let useNodeDataSpy: jest.SpyInstance<
        string,
        [(import('prosemirror-model').Node<any> | undefined)?]
      >;
      beforeEach(() => {
        useNodeDataSpy = jest.spyOn(Hooks, 'useNodeData');
      });

      afterEach(() => {
        useNodeDataSpy.mockRestore();
      });

      it('should render the text value as returned by the useNodeData hook', () => {
        useNodeDataSpy.mockReturnValue('Some text');
        const node = doc(
          p(
            '{<>}',
            unsupportedInline({
              originalValue: {
                attrs: { url: 'https://atlassian.net' },
                type: 'FooBarNode',
              },
            })(),
          ),
        );
        const { editorView: view, refs } = editor(node);
        const wrapper = mount(
          <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />,
        );
        expect(wrapper.text()).toEqual(`Some text${String.fromCharCode(8203)}`);
      });
    });
  });
});
