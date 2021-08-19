import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';

import { ADFEntity } from '@atlaskit/adf-utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  thEmpty,
  tdEmpty,
  bodiedExtension,
  p,
  RefsNode,
  inlineExtension,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { Schema } from '@atlaskit/editor-test-helpers/schema';
import { flushPromises } from '../../../../__tests__/__helpers/utils';
import { ExtensionsPlaceholder } from '../../ui/ExtensionsPlaceholder';
import { createTestExtensionProvider } from '../_helpers';

describe('ExtensionsPlaceholder', () => {
  const createEditor = createEditorFactory();
  const testItemProps = {
    key: 'item-1',
    icon: () => import('@atlaskit/icon/glyph/editor/success'),
    label: 'item label',
    tooltip: 'item tooltip',
  };

  const testItemSelectors: { [key: string]: any } = {
    button: `button[aria-label="${testItemProps.label}"]`,
    icon: `button[aria-label="${testItemProps.label}"] span[role="img"]`,
    tooltip: `[tooltipContent="${testItemProps.tooltip}"]`,
  };

  describe('renders buttons on floating toolbar for different nodes', () => {
    const extension1Attrs = {
      extensionKey: 'fake.extension1',
      extensionType: 'atlassian.com.editor',
    };
    const extension2Attrs = {
      extensionKey: 'fake.extension2',
      extensionType: 'atlassian.com.editor',
    };

    it.each<[string, (schema: Schema) => RefsNode, any, boolean]>([
      [
        'bodiedExtension',
        doc('{extension1Start}', bodiedExtension(extension1Attrs)(p('{<>}'))),
        {
          type: 'extension',
          nodeType: 'bodiedExtension',
          extensionKey: extension1Attrs.extensionKey,
        },
        true,
      ],
      [
        'inlineExtension',
        doc(p('{extension1Start}', inlineExtension(extension1Attrs)())),
        {
          type: 'extension',
          nodeType: 'inlineExtension',
          extensionKey: extension1Attrs.extensionKey,
        },
        true,
      ],
      [
        'standard node',
        doc('{extension1Start}', table()(tr(thEmpty, thEmpty, thEmpty))),
        {
          type: 'node',
          nodeType: 'table',
        },
        true,
      ],
      [
        'does not render if extensionType does not match',
        doc('{extension1Start}', bodiedExtension(extension1Attrs)(p('{<>}'))),
        {
          type: 'extension',
          nodeType: 'bodiedExtension',
          extensionKey: extension1Attrs.extensionKey,
          extensionType: 'random extension type',
        },
        false,
      ],
      [
        'does not render if extensionKey does not match',
        doc('{extension1Start}', bodiedExtension(extension1Attrs)(p('{<>}'))),
        {
          type: 'extension',
          nodeType: 'bodiedExtension',
          extensionKey: 'random extension key',
        },
        false,
      ],
    ])('%s', async (_, testDoc, testContext, shouldRender) => {
      const { editorView, refs, action } = setupEditor(testDoc);
      const node = editorView.state.doc.nodeAt(refs['extension1Start']);
      const wrapper = setupExtensionPlaceholder(
        node!,
        editorView,
        action,
        testContext,
      );
      await flushPromises();
      wrapper.update();

      Object.keys(testItemSelectors).forEach((key) => {
        expect(wrapper.find(testItemSelectors[key]).length === 1).toBe(
          shouldRender,
        );
      });
    });

    it('renders buttons in multiple extension nodes when multiple extension keys provided', async () => {
      const testDoc = doc(
        p('{extension1Start}', inlineExtension(extension1Attrs)()),
        p('{extension2Start}', inlineExtension(extension2Attrs)()),
      );
      const testContext = {
        type: 'extension',
        nodeType: 'inlineExtension',
        extensionKey: [
          extension1Attrs.extensionKey,
          extension2Attrs.extensionKey,
        ],
      };
      const { editorView, refs, action } = setupEditor(testDoc);
      const node1 = editorView.state.doc.nodeAt(refs['extension1Start']);
      const node2 = editorView.state.doc.nodeAt(refs['extension2Start']);
      const wrapper1 = setupExtensionPlaceholder(
        node1!,
        editorView,
        action,
        testContext,
      );
      const wrapper2 = setupExtensionPlaceholder(
        node2!,
        editorView,
        action,
        testContext,
      );
      await flushPromises();
      wrapper1.update();
      wrapper2.update();
      expect(wrapper1?.find(testItemSelectors.button).length).toBe(1);
      expect(wrapper2?.find(testItemSelectors.button).length).toBe(1);
    });
  });

  it('should execute action on click toolbar item', async () => {
    const { editorView, action } = setupEditor();
    const wrapper = setupExtensionPlaceholder(
      editorView.state.doc.firstChild!,
      editorView,
      action,
    );

    await flushPromises();
    wrapper.update();

    const buttonSelector = `button[aria-label="${testItemProps.label}"]`;
    expect(wrapper.find(buttonSelector).length).toBe(1);
    wrapper.find(buttonSelector).simulate('click');

    expect(action).toHaveBeenCalledWith(
      // ADFEntity
      expect.objectContaining({
        attrs: {
          isNumberColumnEnabled: false,
          layout: 'full-width',
          localId: expect.stringMatching(/.*/),
        },
        content: expect.any(Array),
        type: 'table',
      }),
      // ExtensionAPI
      expect.objectContaining({
        editInContextPanel: expect.any(Function),
        _editInLegacyMacroBrowser: expect.any(Function),
        doc: expect.objectContaining({
          insertAfter: expect.any(Function),
        }),
      }),
    );
  });

  function setupEditor(docNode?: (schema: Schema<any, any>) => RefsNode) {
    const defaultDocNode = doc(
      table({ layout: 'full-width' })(
        tr(thEmpty, thEmpty, thEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
      ),
    );

    const { editorView, refs } = createEditor({
      doc: docNode || defaultDocNode,
      editorProps: {
        allowTables: true,
        allowExtension: true,
      },
    });

    const action = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          ((editorView.state.doc.firstChild as unknown) as ADFEntity) ||
            undefined,
        ),
      );

    return { editorView, refs, action };
  }

  function setupExtensionPlaceholder(
    node: PMNode,
    editorView: EditorView,
    action: any,
    testContext?: any,
  ): ReactWrapper {
    const defaultContext = {
      type: 'node',
      nodeType: 'table',
    };
    return mount(
      <ExtensionsPlaceholder
        node={node!}
        editorView={editorView}
        extensionProvider={createTestExtensionProvider(action, [
          {
            context: testContext || defaultContext,
            toolbarItems: [
              {
                action,
                ...testItemProps,
              },
            ],
          },
        ])}
      />,
    );
  }
});
