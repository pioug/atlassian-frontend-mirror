import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { addLinkMetadata } from '@atlaskit/editor-common/card';
import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  a,
  blockquote,
  datasourceBlockCard,
  doc,
  inlineCard,
  p,
  panel,
  table,
  tr as tableRow,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { DatasourceAdf } from '@atlaskit/linking-common';

import { queueCardsFromChangedTr } from '../../../pm-plugins/doc';
import { findChanged } from '../../events-from-tr';

const datasourceNoUrlAdfAttrs: DatasourceAdf['attrs'] = {
  datasource: {
    id: 'datasource-id',
    parameters: { jql: 'EDM=jql', cloudId: 'cloud-id' },
    views: [
      {
        type: 'table',
        properties: { columns: [{ key: 'col1' }, { key: 'col2' }] },
      },
    ],
  },
};

describe('findChanged', () => {
  it('should find 1 inserted link when inserting into the document into a position that is not already a link', () => {
    const href = 'https://atlassian.com';
    const state = createEditorState(doc(p('{}')));

    const tr = state.tr;
    const linkFragment = Fragment.from(a({ href })(href)(state.schema));
    tr.insert(0, linkFragment);

    const { inserted, removed, updated } = findChanged(tr, state);

    expect(inserted).toHaveLength(1);
    expect(removed).toHaveLength(0);
    expect(updated).toHaveLength(0);
  });

  it('should find 1 removed link when replacing a range that includes a an entire link', () => {
    const href = 'https://atlassian.com';
    const state = createEditorState(doc(p(a({ href })(href))));

    const tr = state.tr;
    const slice = new Slice(
      Fragment.from(p('Hello world')(state.schema)),
      0,
      0,
    );
    tr.replaceRange(0, state.doc.content.size, slice);

    const { inserted, removed, updated } = findChanged(tr, state);

    expect(inserted).toHaveLength(0);
    expect(removed).toHaveLength(1);
    expect(updated).toHaveLength(0);
  });

  it('should consider any links to be created/updated/deleted when part of the link is modified', () => {
    const href = 'https://atlassian.com';
    const state = createEditorState(doc(p(a({ href })(href))));

    const tr = state.tr;
    const slice = new Slice(
      Fragment.from(p('Hello world')(state.schema)),
      0,
      0,
    );
    tr.replaceRange(5, state.doc.content.size, slice);

    const { inserted, removed, updated } = findChanged(tr, state);

    expect(inserted).toHaveLength(0);
    expect(removed).toHaveLength(0);
    expect(updated).toHaveLength(0);
  });

  it('should find 1 inserted link and 1 deleted link when replacing a range that includes an entire link, with another link', () => {
    const href = 'https://atlassian.com';
    const nextHref = 'https://example.com';
    const state = createEditorState(doc(p(a({ href })(href))));

    const tr = state.tr;
    const slice = new Slice(
      Fragment.from(p(a({ href: nextHref })(nextHref))(state.schema)),
      0,
      0,
    );

    tr.replaceRange(0, state.doc.content.size, slice);

    const { inserted, removed, updated } = findChanged(tr, state);

    expect(inserted).toHaveLength(1);
    expect(removed).toHaveLength(1);
    expect(updated).toHaveLength(0);
  });

  it('should find 1 inserted link and 2 deleted links when replacing a range that includes 2 entire links, with another link', () => {
    const href = 'https://atlassian.com';
    const state = createEditorState(
      doc(p(a({ href })(href), ' some more text ', a({ href })(href))),
    );

    const tr = state.tr;
    const slice = new Slice(
      Fragment.from(p(a({ href })(href))(state.schema)),
      0,
      0,
    );
    tr.replaceRange(0, state.doc.content.size, slice);

    const { inserted, removed, updated } = findChanged(tr, state);

    expect(inserted).toHaveLength(1);
    expect(removed).toHaveLength(2);
    expect(updated).toHaveLength(0);
  });

  it('should find 2 inserted links and 2 deleted links when replacing a range that includes 2 entire links, with a slice that contains 2 links', () => {
    const href = 'https://atlassian.com';
    const state = createEditorState(
      doc(p(a({ href })(href), ' some more text ', a({ href })(href))),
    );

    const tr = state.tr;
    const slice = new Slice(
      Fragment.from(
        p(
          inlineCard({ url: href })(),
          ' some more text ',
          inlineCard({ url: href })(),
        )(state.schema),
      ),
      0,
      0,
    );
    tr.replaceRange(0, state.doc.content.size, slice);

    const { inserted, removed, updated } = findChanged(tr, state);

    expect(inserted).toHaveLength(2);
    expect(removed).toHaveLength(2);
    expect(updated).toHaveLength(0);
  });

  it('should find no changes if there are an equal number of links created and deleted that appear to be the same links', () => {
    const href = 'https://atlassian.com';

    const builder = p(
      a({ href })(href),
      ' some more text ',
      inlineCard({ url: href })(),
    );

    const state = createEditorState(doc(builder));

    const tr = state.tr;

    const slice = new Slice(
      Fragment.from(panel()(builder)(state.schema)),
      0,
      0,
    );

    tr.replaceRange(0, state.doc.content.size, slice);

    const { inserted, removed, updated } = findChanged(tr, state);

    expect(inserted).toHaveLength(0);
    expect(removed).toHaveLength(0);
    expect(updated).toHaveLength(0);
  });

  it('should find 1 inserted and 1 deleted when downgrading from datasource to a link', () => {
    const href = 'https://atlassian.com';
    const state = createEditorState(
      doc(datasourceBlockCard(datasourceNoUrlAdfAttrs)()),
    );
    const historyKey = {
      key: pmHistoryPluginKey,
    } as unknown as PluginKey;

    const undoTransaction = state.tr;
    const linkSlice = new Slice(
      Fragment.from(p(a({ href })(href))(state.schema)),
      0,
      0,
    );

    undoTransaction.replaceRange(0, state.doc.content.size, linkSlice);
    undoTransaction.setMeta(historyKey, { redo: false });
    addLinkMetadata(state.selection, undoTransaction, {
      cardAction: 'RESOLVE',
      inputMethod: INPUT_METHOD.CLIPBOARD,
    });

    const { inserted, removed, updated } = findChanged(undoTransaction, state);

    expect(inserted).toHaveLength(1);
    expect(removed).toHaveLength(1);
    expect(updated).toHaveLength(0);
  });

  it('should find 1 inserted and 1 deleted when upgrading from link to a datasource', () => {
    const href = 'https://atlassian.com';
    const state = createEditorState(doc(p(a({ href })(href))));
    const historyKey = {
      key: pmHistoryPluginKey,
    } as unknown as PluginKey;

    const redoTransaction = state.tr;
    const datasource = datasourceBlockCard(datasourceNoUrlAdfAttrs)();
    const slice = new Slice(
      Fragment.from(doc('{<node>}', datasource)(state.schema)),
      0,
      0,
    );
    redoTransaction.replaceRange(0, state.doc.content.size, slice);
    redoTransaction.setMeta(historyKey, { redo: true });
    addLinkMetadata(state.selection, redoTransaction, {
      cardAction: 'RESOLVE',
      inputMethod: INPUT_METHOD.CLIPBOARD,
    });

    const { inserted, removed, updated } = findChanged(redoTransaction, state);

    expect(inserted).toHaveLength(1);
    expect(removed).toHaveLength(1);
    expect(updated).toHaveLength(0);
  });

  describe('updates', () => {
    it('should find 2 updated links when replacing a range that includes 2 entire links, with a slice that contains 2 links and is marked as an update', () => {
      const href = 'https://atlassian.com';
      const state = createEditorState(
        doc(p(a({ href })(href), ' some more text ', a({ href })(href))),
      );

      const tr = state.tr;
      const slice = new Slice(
        Fragment.from(
          p(
            inlineCard({ url: href })(),
            ' some more text ',
            inlineCard({ url: href })(),
          )(state.schema),
        ),
        0,
        0,
      );

      tr.replaceRange(0, state.doc.content.size, slice);

      addLinkMetadata(state.selection, tr, {
        action: ACTION.UPDATED,
      });

      const { inserted, removed, updated } = findChanged(tr, state);

      expect(inserted).toHaveLength(0);
      expect(removed).toHaveLength(0);
      expect(updated).toHaveLength(2);
    });

    it('should find no changes if inserted link positions are queued for upgrade', () => {
      const href = 'https://atlassian.com';
      const state = createEditorState(
        doc(p(a({ href })(href), ' some more text ', a({ href })(href))),
      );

      const tr = state.tr;

      const slice = new Slice(
        Fragment.from(
          p(
            a({ href })(href),
            ' some more text ',
            a({ href })(href),
          )(state.schema),
        ),
        0,
        0,
      );

      tr.replaceRange(0, state.doc.content.size, slice);

      queueCardsFromChangedTr(
        state,
        tr,
        INPUT_METHOD.FLOATING_TB,
        ACTION.UPDATED,
      );

      const { inserted, removed, updated } = findChanged(tr, state);

      expect(inserted).toHaveLength(0);
      expect(removed).toHaveLength(0);
      expect(updated).toHaveLength(0);
    });
  });

  describe('nodeContext', () => {
    it('should display `doc` as nodeContext when inserting into document', () => {
      const href = 'https://atlassian.com';
      const state = createEditorState(doc(p('{}')));

      const tr = state.tr;
      const fragment = Fragment.from(a({ href })(href)(state.schema));
      tr.insert(0, fragment);

      const { inserted } = findChanged(tr, state);

      expect(inserted[0]).toEqual(
        expect.objectContaining({ nodeContext: 'doc' }),
      );
    });

    it('should display `blockquote` as nodeContext when inserting into blockquote', () => {
      const href = 'https://atlassian.com';
      const state = createEditorState(doc(p('{}')));

      const tr = state.tr;
      const fragment = Fragment.from(
        blockquote(p(a({ href })(href)))(state.schema),
      );
      tr.insert(0, fragment);
      const { inserted } = findChanged(tr, state);

      expect(inserted[0]).toEqual(
        expect.objectContaining({ nodeContext: 'blockquote' }),
      );
    });

    it('should display `blockquote` as nodeContext when inserting into blockquote inside a table cell', () => {
      const href = 'https://atlassian.com';
      const state = createEditorState(doc(p('{}')));

      const tr = state.tr;
      const rows = [tableRow(td()(blockquote(p(a({ href })(href)))))];
      const fragment = Fragment.from(table()(...rows)(state.schema));
      tr.insert(0, fragment);
      const { inserted } = findChanged(tr, state);

      expect(inserted[0]).toEqual(
        expect.objectContaining({ nodeContext: 'blockquote' }),
      );
    });

    it('should handle AddLinkMark', () => {
      const href = 'https://atlassian.com';
      const state = createEditorState(doc(p('Hello')));

      const tr = state.tr;
      const link = state.schema.marks.link;
      tr.addMark(0, 5, link.create({ href }));

      const { inserted } = findChanged(tr, state);

      expect(inserted[0]).toEqual(
        expect.objectContaining({ nodeContext: 'doc' }),
      );
    });

    it('should handle RemoveLinkMark', () => {
      const href = 'https://atlassian.com';
      const state = createEditorState(doc(p(a({ href })('Hello'))));

      const tr = state.tr;
      tr.removeMark(0, 5);

      const { removed } = findChanged(tr, state);

      expect(removed[0]).toEqual(
        expect.objectContaining({ nodeContext: 'doc' }),
      );
    });
  });
});
