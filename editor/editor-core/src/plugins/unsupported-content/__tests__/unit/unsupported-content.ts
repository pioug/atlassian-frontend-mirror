import {
  LightEditorPlugin,
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  unsupportedInline,
  unsupportedBlock,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { unsupportedContentPlugin, tablesPlugin } from '../../../';

describe('unsupported content', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(unsupportedContentPlugin)
      .add(tablesPlugin);
    return createEditor({ doc, preset });
  };

  it('should NOT fire analytics when document is valid', () => {
    const { dispatchAnalyticsEvent } = editor(doc(p('Totally valid')));

    // Deliberately not including all subset properties to ensure it
    // generically covers both inline and block events.
    expect(dispatchAnalyticsEvent).not.toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
      }),
    );
  });

  it('should fire analytics when document contains an unsupported inline node', () => {
    const { dispatchAnalyticsEvent } = editor(
      doc(
        p('Valid!'),
        p(
          ' ',
          unsupportedInline({
            originalValue: {
              attrs: { url: 'https://atlassian.net' },
              type: 'FooBarNode',
            },
          })(),
        ),
      ),
    );
    // Proving subset property matching works
    expect(dispatchAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({ action: 'unsupportedContentEncountered' }),
    );

    // Validating the full event
    expect(dispatchAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedInline',
        attributes: {
          unsupportedNode: {
            type: 'FooBarNode',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
          },
        },
        eventType: 'track',
      }),
    );
  });

  it('should fire analytics when document contains an unsupported block node', () => {
    const { dispatchAnalyticsEvent } = editor(
      doc(
        p('Hello World'),
        table()(
          tr(
            td({})(p('Table cell')),
            td({})(
              p('Valid!'),
              unsupportedBlock({
                originalValue: {
                  attrs: {},
                  type: 'FooBarNode',
                },
              })(),
              p('Also valid!'),
            ),
          ),
        ),
      ),
    );

    // Proving subset property matching works
    expect(dispatchAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({ action: 'unsupportedContentEncountered' }),
    );
    // Validating the full event
    expect(dispatchAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedBlock',
        attributes: {
          unsupportedNode: {
            type: 'FooBarNode',
            parentType: 'tableCell',
            ancestry: 'doc table tableRow tableCell',
          },
        },
        eventType: 'track',
      }),
    );
  });
});
