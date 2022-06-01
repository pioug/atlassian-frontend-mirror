import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl-next';
import * as fs from 'fs';
import * as path from 'path';
import { EditorView } from 'prosemirror-view';

import patchEditorViewForJSDOM from '@atlaskit/editor-test-helpers/jsdom-fixtures';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';

import { Editor } from '../../index';

function mountEditorWithAdfDoc({ adfDoc }: { adfDoc: any }) {
  let editorView: EditorView<any>;

  const taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());
  const mentionProvider = new Promise<any>((resolve) =>
    resolve(mentionResourceProvider),
  );
  const emojiProvider = getEmojiProvider();
  const mediaProvider = storyMediaProviderFactory();
  const smartCardProvider = Promise.resolve(cardProvider);

  // This prop set is the minimum required in order to parse the reference "valid" documents
  // we have.
  const wrapper = mount(
    <IntlProvider locale="en">
      <Editor
        defaultValue={adfDoc}
        appearance="chromeless"
        onEditorReady={(editorActions) => {
          editorView = editorActions._privateGetEditorView()!;
        }}
        taskDecisionProvider={taskDecisionProvider}
        mentionProvider={mentionProvider}
        allowTables={true}
        emojiProvider={emojiProvider}
        allowRule={true}
        allowPanel={true}
        allowExpand={true}
        allowTextColor={true}
        allowTextAlignment={true}
        media={{
          provider: mediaProvider,
          allowMediaSingle: true,
          featureFlags: { captions: true, mediaInline: true },
          allowMediaGroup: true,
        }}
        smartLinks={{
          provider: smartCardProvider,
          allowEmbeds: true,
        }}
        allowExtension={true}
        allowStatus={true}
        allowTemplatePlaceholders={true}
        allowDate={true}
        allowLayouts={true}
      />
    </IntlProvider>,
  );

  // Work around JSDOM/Node not supporting DOM Selection API
  if (!('getSelection' in window)) {
    // TODO JEST-23
    patchEditorViewForJSDOM(editorView!);
  }

  return { wrapper, editorView: editorView! };
}

function getAdfReferenceFileNameAndContents(group: 'valid' | 'invalid') {
  const folderPath = path.join(
    __dirname,
    '../../../../adf-schema/src/__tests__/unit/json-schema/v1-reference/full/',
    group,
  );
  return fs.readdirSync(folderPath).reduce((acc, name) => {
    if (name.match(/\.json$/)) {
      acc.push({
        name: `${group}/${name}`,
        adfDoc: JSON.parse(fs.readFileSync(`${folderPath}/${name}`, 'utf-8')),
      });
    }

    return acc;
  }, [] as { name: string; adfDoc: any }[]);
}

// These reference "invalid" docs do not result in an unsupported block or inline node
// being added to the document, in some cases the editor "silently handles" the invalid
// attributes, and in others, it will drop them.
const invalidReferenceAdfLoadableWithoutUnsupported = [
  'invalid/blockQuote-with-attrs.json',
  'invalid/bodied-extension-without-extensionKey.json',
  'invalid/bodied-extension-without-extensionType.json',
  'invalid/code-and-em.json',
  'invalid/code-and-strike.json',
  'invalid/code-and-strong.json',
  'invalid/code-and-subsup.json',
  'invalid/code-and-underline.json',
  'invalid/code-with-attrs.json',
  'invalid/codeBlock-with-strong.json',
  'invalid/codeBlock-with-unknown-attribute.json',
  'invalid/codeBlock-with-unsupported-marks.json',
  'invalid/decisionList-with-empty-decision.json',
  'invalid/doc-with-attrs.json',
  'invalid/doc-with-marks.json',
  'invalid/em-with-attrs.json',
  'invalid/emoji-with-empty-attrs.json',
  'invalid/emoji-with-marks.json',
  'invalid/emoji-with-unknown-attr.json',
  'invalid/expand-nested-with-marks.json',
  'invalid/expand-with-breakout-inside-of-layout.json',
  'invalid/extension-with-empty-local-id.json',
  'invalid/extension-without-extensionKey.json',
  'invalid/extension-without-extensionType.json',
  'invalid/hardBreak-with-wrong-text.json',
  'invalid/heading-with-invalid-level-attr.json',
  'invalid/heading-with-unknown-attrs.json',
  'invalid/heading-with-unsupported-mark.json',
  'invalid/inlineExtension-without-extensionKey.json',
  'invalid/inlineExtension-without-extensionType.json',
  'invalid/layoutSection-with-one-column.json',
  'invalid/layoutSection-with-overflow-width.json',
  'invalid/layoutSection-with-two-columns-and-breakout-code-block.json',
  'invalid/link-with-empty-attrs.json',
  'invalid/link-with-unknown-attr.json',
  'invalid/link-without-attrs.json',
  'invalid/listItem-with-attrs.json',
  'invalid/listItem-with-marks.json',
  'invalid/media-with-empty-attrs.json',
  'invalid/media-with-invalid-alt-text.json',
  'invalid/media-with-invalid-occurrence-key-attr.json',
  'invalid/media-with-marks.json',
  'invalid/media-with-unknown-attr.json',
  'invalid/media-without-attrs.json',
  'invalid/media-without-id-attr.json',
  'invalid/media-without-type-attr.json',
  'invalid/mediaGroup-with-attrs.json',
  'invalid/mediaInline-with-subsup-mark.json',
  'invalid/mediaSingle-with-invalid-layout-attr.json',
  'invalid/mediaSingle-with-negative-width.json',
  'invalid/mediaSingle-with-overflow-width.json',
  'invalid/mediaSingle-with-zero-width.json',
  'invalid/mention-with-extra-attrs.json',
  'invalid/mention-with-invalid-user-type.json',
  'invalid/mono-with-attrs.json',
  'invalid/orderedList-with-extra-attrs.json',
  'invalid/panel-with-empty-attrs.json',
  'invalid/panel-with-unknown-attr.json',
  'invalid/paragraph-with-text-with-unknown-mark.json',
  'invalid/paragraph-with-unsupported-marks.json',
  'invalid/placeholder-with-empty-attrs.json',
  'invalid/rule-with-attrs.json',
  'invalid/status-with-extra-attr.json',
  'invalid/status-without-color-attr.json',
  'invalid/status-without-text-attr.json',
  'invalid/strike-with-attrs.json',
  'invalid/strong-with-attrs.json',
  'invalid/subsup-with-extra-attrs.json',
  'invalid/subsup-with-invalid-type-attr.json',
  'invalid/subsup-without-attrs.json',
  'invalid/subsup-without-type-attr.json',
  'invalid/table-with-breakout-code-block.json',
  'invalid/table-with-fragment-mark-with-empty-local-id.json',
  'invalid/table-with-fragment-mark-without-local-id.json',
  'invalid/task-with-invalid-state.json',
  'invalid/taskList-with-empty-task.json',
  'invalid/textColor-with-extra-attrs.json',
  'invalid/textColor-with-invalid-color-attr.json',
  'invalid/textColor-without-attrs.json',
  'invalid/textColor-without-color-attr.json',
  'invalid/underline-with-attrs.json',
  'invalid/bulletList-with-attrs.json',
  'invalid/bulletList-with-not-listItem-content.json',
  'invalid/listItem-with-empty-content.json',
  'invalid/orderedList-without-content.json',
];

const invalidReferenceAdfUnloadable = [
  'invalid/doc-without-content.json',
  'invalid/list-with-blockquote.json',
  'invalid/listItem-with-list-as-first-child.json',
  'invalid/table-with-nested-table.json',
  'invalid/table-without-cells.json',
];

const invalidReferenceAdfEmptyDocument = ['invalid/doc-without-version.json'];

const completelyInvalidDocumentInnerHtml = mountEditorWithAdfDoc({
  adfDoc: 'completely invalid',
}).editorView.dom.innerHTML;

const emptyDocumentInnerHtml = mountEditorWithAdfDoc({
  adfDoc: {
    version: 1,
    type: 'doc',
    content: [],
  },
}).editorView.dom.innerHTML;

describe('editor loading adf', () => {
  const validAdfFileTestCases = getAdfReferenceFileNameAndContents(
    'valid',
  ).map(({ name, adfDoc }) => [name, adfDoc]);

  it.each(validAdfFileTestCases)(
    `should load valid adf document: %s`,
    (name, adfDoc) => {
      const { editorView } = mountEditorWithAdfDoc({
        adfDoc,
      });

      expect(editorView!.dom.innerHTML).not.toContain('unsupported');

      // If a completely invalid document is loaded, the innerHtml will not contain an unsupported block view
      // instead it will have an "empty document".
      // So for valid documents (which don't otherwise result in an empty document), we test
      // to make sure the innerHTML dos not match the result of a known completly invalid
      // document.
      if (
        ![
          'valid/paragraph-with-empty-marks.json',
          'valid/paragraph-with-empty-content.json',
          'valid/paragraph-without-content.json',
          'valid/doc-with-empty-content.json',
        ].includes(name)
      ) {
        expect(editorView!.dom.innerHTML).not.toBe(
          completelyInvalidDocumentInnerHtml,
        );
      }
    },
  );

  const invalidAdfFileTestCasesLoadableWithUnsupported = getAdfReferenceFileNameAndContents(
    'invalid',
  )
    .filter(
      ({ name }) =>
        !invalidReferenceAdfLoadableWithoutUnsupported.includes(name) &&
        !invalidReferenceAdfUnloadable.includes(name) &&
        !invalidReferenceAdfEmptyDocument.includes(name),
    )
    .map(({ name, adfDoc }) => [name, adfDoc]);

  it.each(invalidAdfFileTestCasesLoadableWithUnsupported)(
    `should load some invalid adf document where it replaces unsupported nodes: %s`,
    (name, adfDoc) => {
      const { editorView } = mountEditorWithAdfDoc({
        adfDoc,
      });

      expect(editorView!.dom.innerHTML).toContain('unsupported');
    },
  );

  const invalidAdfFileTestCasesLoadableWithoutUnsupported = getAdfReferenceFileNameAndContents(
    'invalid',
  )
    .filter(({ name }) =>
      invalidReferenceAdfLoadableWithoutUnsupported.includes(name),
    )
    .map(({ name, adfDoc }) => [name, adfDoc]);

  it.each(invalidAdfFileTestCasesLoadableWithoutUnsupported)(
    `should load some invalid adf document where it does not replace unsupported nodes: %s`,

    (_name, adfDoc) => {
      const { editorView } = mountEditorWithAdfDoc({
        adfDoc,
      });

      expect(editorView!.dom.innerHTML).not.toContain('unsupported');

      // If a completely invalid document is loaded, the innerHtml will not contain an
      // unsupported block view instead it will have an "empty document".
      // So for invalid documents which don't result in unsupported nodes, but are still
      // loadable we test to make sure the innerHTML dos not match the result of a known
      // completly invalid document.
      expect(editorView!.dom.innerHTML).not.toBe(
        completelyInvalidDocumentInnerHtml,
      );
    },
  );

  const invalidAdfFileTestCasesUnloadable = getAdfReferenceFileNameAndContents(
    'invalid',
  )
    .filter(({ name }) => invalidReferenceAdfUnloadable.includes(name))
    .map(({ name, adfDoc }) => [name, adfDoc]);

  it.each(invalidAdfFileTestCasesUnloadable)(
    `should fail to load some invalid adf documents: %s`,

    (_name, adfDoc) => {
      expect(() => {
        mountEditorWithAdfDoc({
          adfDoc,
        });
      }).toThrow();
    },
  );

  const invalidAdfFileTestCasesEmptyDocument = getAdfReferenceFileNameAndContents(
    'invalid',
  )
    .filter(({ name }) => invalidReferenceAdfEmptyDocument.includes(name))
    .map(({ name, adfDoc }) => [name, adfDoc]);

  it.each(invalidAdfFileTestCasesEmptyDocument)(
    `should load invalid empty adf documents: %s`,

    (_name, adfDoc) => {
      const { editorView } = mountEditorWithAdfDoc({
        adfDoc,
      });

      expect(editorView!.dom.innerHTML).toBe(emptyDocumentInnerHtml);
    },
  );
});
