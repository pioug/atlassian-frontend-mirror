import {
  doc,
  p,
  h1,
  ol,
  ul,
  li,
  panel,
  table,
  th,
  tr,
  td,
  decisionItem,
  decisionList,
  layoutColumn,
  layoutSection,
  expand,
  blockquote,
  taskList,
  taskItem,
  bodiedExtension,
  hr,
  nestedExpand,
  code_block,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import pastePlugin from '../../index';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import expandPlugin from '../../../expand';
import layoutPlugin from '../../../layout';
import panelPlugin from '../../../panel';
import blockTypePlugin from '../../../block-type';
import listPlugin from '../../../list';
import extensionPlugin from '../../../extension';
import codeBlockPlugin from '../../../code-block';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import rulePlugin from '../../../rule';
import betterTypeHistoryPlugin from '../../../better-type-history';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { uuid } from '@atlaskit/adf-schema';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';

// Starting docs
const docWithEndOfListItemSelection = doc(
  ol({ order: 1 })(li(p('One')), li(p('Two{<>}')), li(p('Three'))),
);
const docWithStartOfListItemSelection = doc(
  ol({ order: 1 })(li(p('One')), li(p('{<>}Two')), li(p('Three'))),
);
const docWithMiddleOfListItemSelection = doc(
  ol({ order: 1 })(li(p('One')), li(p('T{<>}wo')), li(p('Three'))),
);
const docWithEndOfListItemContainingNestedlistSelection = doc(
  ol()(
    li(p('One')),
    li(p('Two{<>}'), ol()(li(p('nested')), li(p('list')))),
    li(p('Three')),
  ),
);
const docWithStartOfListItemContainingNestedlistSelection = doc(
  ol()(
    li(p('One')),
    li(p('{<>}Two'), ol()(li(p('nested')), li(p('list')))),
    li(p('Three')),
  ),
);
const docWithMiddleOfListItemContainingNestedlistSelection = doc(
  ol()(
    li(p('One')),
    li(p('T{<>}wo'), ol()(li(p('nested')), li(p('list')))),
    li(p('Three')),
  ),
);
const docWithEndOfLastListItemSelection = doc(
  ol()(li(p('One')), li(p('Two')), li(p('Three{<>}'))),
);
const docWithStartOfFirstListItemSelection = doc(
  ol()(li(p('{<>}One')), li(p('Two')), li(p('Three'))),
);
const docWithTwoListItemsSelected = doc(
  ol()(li(p('{<}One')), li(p('Two{>}')), li(p('Three'))),
);
const docWithEndOfListItemSelectedAndNestedWithinATable = doc(
  table({
    isNumberColumnEnabled: false,
    layout: 'default',
    localId: 'local-uuid',
  })(tr(td({})(ol()(li(p('One')), li(p('Two{<>}')), li(p('Three')))))),
);
const docWithEndOfListItemFollowedBySingleCharacterListItemContainingNestedListSelection =
  doc(
    ol()(
      li(p('One{<>}')),
      li(p('T'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
  );

// Variations of nodes to paste in + expected doc
const panelHTML = {
  name: 'panel',
  html: `<meta charset='utf-8'><div data-panel-type="info" data-pm-slice="0 0 []"><div data-panel-content="true"><p>Hello</p></div></div>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    panel({ panelType: 'info' })(p('Hello')),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    panel({ panelType: 'info' })(p('Hello')),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    panel({ panelType: 'info' })(p('Hello')),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    panel({ panelType: 'info' })(p('Hello')),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    panel({ panelType: 'info' })(p('Hello')),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    panel({ panelType: 'info' })(p('Hello')),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    panel({ panelType: 'info' })(p('Hello')),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'))),
          panel({ panelType: 'info' })(p('Hello')),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      panel({ panelType: 'info' })(p('Hello')),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const expandHTML = {
  name: 'expand',
  html: `<meta charset='utf-8'><div data-node-type="expand" data-title="" data-expanded="true" data-pm-slice="0 0 []"><p>Hello</p></div>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    expand({ title: '' })(p('Hello')),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    expand({ title: '' })(p('Hello')),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    expand({ title: '' })(p('Hello')),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    expand({ title: '' })(p('Hello')),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    expand({ title: '' })(p('Hello')),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    expand({ title: '' })(p('Hello')),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    expand({ title: '' })(p('Hello')),
    ol({ order: 2 })(li(p('Three'))),
  ),
  // TODO: This is current behaviour but it should split the list
  // https://product-fabric.atlassian.net/browse/ED-16843
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two')), li(p('Three'))),
          nestedExpand({ title: '' })(p('Hello')),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      expand({ title: '' })(p('Hello')),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const decisionHTML = {
  name: 'decision',
  html: `<meta charset='utf-8'><li data-decision-local-id="" data-decision-state="DECIDED" data-pm-slice="0 0 []">Hello</li>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('Hello'),
    ),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('Hello'),
    ),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'))),
          decisionList({ localId: 'local-uuid' })(
            decisionItem({ localId: 'local-uuid' })('Hello'),
          ),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      decisionList({ localId: 'local-uuid' })(
        decisionItem({ localId: 'local-uuid' })('Hello'),
      ),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const actionHTML = {
  name: 'action/task',
  html: `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="d6b647e3-dd86-4b68-b814-4e4ecabe07e7" style="list-style: none; padding-left: 0" data-pm-slice="0 0 []"><div data-task-local-id="ee86b381-7175-4f1b-baa7-9b2e26d5bc60" data-task-state="TODO">Hello</div></div>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('Hello'),
    ),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('Hello'),
    ),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('Hello'),
    ),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'))),
          taskList({ localId: 'local-uuid' })(
            taskItem({ localId: 'local-uuid' })('Hello'),
          ),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      taskList({ localId: 'local-uuid' })(
        taskItem({ localId: 'local-uuid' })('Hello'),
      ),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const quoteHTML = {
  name: 'blockQuote',
  html: `<meta charset='utf-8'><blockquote data-pm-slice="0 0 []"><p>Hello</p></blockquote>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    blockquote(p('Hello')),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    blockquote(p('Hello')),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    blockquote(p('Hello')),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    blockquote(p('Hello')),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    blockquote(p('Hello')),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    blockquote(p('Hello')),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    blockquote(p('Hello')),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'))),
          blockquote(p('Hello')),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      blockquote(p('Hello')),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const dividerHTML = {
  name: 'divider',
  html: `<meta charset='utf-8'><hr data-pm-slice="0 0 []">`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    hr(),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    hr(),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    hr(),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    hr(),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    hr(),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    hr(),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    hr(),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'))),
          hr(),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      hr(),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const headingHTML = {
  name: 'heading',
  html: `<meta charset='utf-8'><h1 data-pm-slice="0 0 []">Hello</h1>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    h1('Hello'),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    h1('Hello'),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    h1('Hello'),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    h1('Hello'),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    h1('Hello'),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    h1('Hello'),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    h1('Hello'),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'))),
          h1('Hello'),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      h1('Hello'),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const tableHTML = {
  name: 'table',
  html: `<meta charset='utf-8'><table data-number-column="false" data-layout="default" data-autosize="false" data-table-local-id="" data-pm-slice="1 1 []"><tbody><tr><th class="pm-table-header-content-wrap"><p></p></th><th class="pm-table-header-content-wrap"><p></p></th><th class="pm-table-header-content-wrap"><p></p></th></tr><tr><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td></tr><tr><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td></tr></tbody></table>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(th({})(p()), th({})(p()), th({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p(''))),
    ),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(th({})(p()), th({})(p()), th({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
    ),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(th({})(p()), th({})(p()), th({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p(''))),
    ),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(th({})(p()), th({})(p()), th({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
    ),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(th({})(p()), th({})(p()), th({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
    ),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(th({})(p()), th({})(p()), th({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
    ),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(th({})(p()), th({})(p()), th({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p(''))),
    ),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p())),
      tr(td({})(p()), td({})(p()), td({})(p(''))),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      table({
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'local-uuid',
      })(
        tr(th({})(p()), th({})(p()), th({})(p())),
        tr(td({})(p()), td({})(p()), td({})(p())),
        tr(td({})(p()), td({})(p()), td({})(p(''))),
      ),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const layoutHTML = {
  name: 'layoutSection',
  html: `<meta charset='utf-8'><div data-layout-section="true" data-pm-slice="0 0 []"><div data-layout-column="true" style="flex-basis: 50%" data-column-width="50"><div data-layout-content="true"><p></p></div></div><div data-layout-column="true" style="flex-basis: 50%" data-column-width="50"><div data-layout-content="true"><p></p></div></div></div>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    layoutSection(
      layoutColumn({ width: 50 })(p()),
      layoutColumn({ width: 50 })(p('')),
    ),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    layoutSection(
      layoutColumn({ width: 50 })(p()),
      layoutColumn({ width: 50 })(p()),
    ),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    layoutSection(
      layoutColumn({ width: 50 })(p()),
      layoutColumn({ width: 50 })(p()),
    ),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    layoutSection(
      layoutColumn({ width: 50 })(p()),
      layoutColumn({ width: 50 })(p()),
    ),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    layoutSection(
      layoutColumn({ width: 50 })(p()),
      layoutColumn({ width: 50 })(p()),
    ),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    layoutSection(
      layoutColumn({ width: 50 })(p()),
      layoutColumn({ width: 50 })(p()),
    ),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    layoutSection(
      layoutColumn({ width: 50 })(p()),
      layoutColumn({ width: 50 })(p('')),
    ),
    ol({ order: 2 })(li(p('Three'))),
  ),
  // This is current behaviour but it shouldn't be
  // Layout should safeInsert below table instead of splitting
  // TODO in https://product-fabric.atlassian.net/browse/ED-16791
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(tr(td({})(ol()(li(p('One')), li(p('Two')))))),
    layoutSection(
      layoutColumn({ width: 50 })(p()),
      layoutColumn({ width: 50 })(p('')),
    ),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(tr(td({})(ol({ order: 3 })(li(p('Three')))))),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      layoutSection(
        layoutColumn({ width: 50 })(p()),
        layoutColumn({ width: 50 })(p('')),
      ),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};
const bodiedExtensionHTML = {
  name: 'bodied extension',
  html: `<meta charset='utf-8'><div data-node-type="bodied-extension" data-extension-type="com.atlassian.confluence.macro.core" data-extension-key="bodied-eh" data-parameters="{&quot;macroParams&quot;:{},&quot;macroMetadata&quot;:{&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;&quot;},&quot;type&quot;:&quot;icon&quot;}]}}" data-layout="default" data-local-id:="testId" data-pm-slice="0 0 []"><p></p></div>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
      },
      layout: 'default',
      localId: 'local-uuid',
    })(p('')),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
      },
      layout: 'default',
      localId: 'local-uuid',
    })(p()),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
      },
      layout: 'default',
      localId: 'local-uuid',
    })(p()),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
      },
      layout: 'default',
      localId: 'local-uuid',
    })(p()),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
      },
      layout: 'default',
      localId: 'local-uuid',
    })(p()),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
      },
      layout: 'default',
      localId: 'local-uuid',
    })(p()),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
      },
      layout: 'default',
      localId: 'local-uuid',
    })(p('')),
    ol({ order: 2 })(li(p('Three'))),
  ),
  // This is current behaviour but it shouldn't be
  // Bodied extension should safeInsert below table instead of splitting
  // TODO in https://product-fabric.atlassian.net/browse/ED-16791
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(tr(td({})(ol()(li(p('One')), li(p('Two')))))),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: {
          placeholder: [{ data: { url: '' }, type: 'icon' }],
        },
      },
      layout: 'default',
      localId: 'local-uuid',
    })(p()),
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(tr(td({})(ol({ order: 3 })(li(p('Three')))))),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      bodiedExtension({
        extensionKey: 'bodied-eh',
        extensionType: 'com.atlassian.confluence.macro.core',
        parameters: {
          macroParams: {},
          macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
        },
        layout: 'default',
        localId: 'local-uuid',
      })(p()),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};

const multipleBlockNodesHTML = {
  name: 'multiple block nodes',
  html: `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="b1c98fb2-4758-4901-b410-9d90bebc6e5e" style="list-style: none; padding-left: 0" data-pm-slice="2 2 []"><div data-task-local-id="b38eedae-80d3-4e54-8151-8c1ab9818e8a" data-task-state="TODO">task</div></div><div data-panel-type="info"><div data-panel-content="true"><p>Panel</p></div></div><ol data-node-type="decisionList" data-decision-list-local-id="a7645482-d899-4b33-8889-998aaebd671b" style="list-style: none; padding-left: 0"><li data-decision-local-id="3b6878b3-85e8-4df8-b8a7-c7564af38e44" data-decision-state="DECIDED">decision</li></ol><blockquote><p>quote</p></blockquote>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('task'),
    ),
    panel({ panelType: 'info' })(p('Panel')),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('decision'),
    ),
    blockquote(p('quote')),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('task'),
    ),
    panel({ panelType: 'info' })(p('Panel')),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('decision'),
    ),
    blockquote(p('quote')),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('task'),
    ),
    panel({ panelType: 'info' })(p('Panel')),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('decision'),
    ),
    blockquote(p('quote')),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('task'),
    ),
    panel({ panelType: 'info' })(p('Panel')),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('decision'),
    ),
    blockquote(p('quote')),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('task'),
    ),
    panel({ panelType: 'info' })(p('Panel')),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('decision'),
    ),
    blockquote(p('quote')),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('task'),
    ),
    panel({ panelType: 'info' })(p('Panel')),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('decision'),
    ),
    blockquote(p('quote')),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    taskList({ localId: 'local-uuid' })(
      taskItem({ localId: 'local-uuid' })('task'),
    ),
    panel({ panelType: 'info' })(p('Panel')),
    decisionList({ localId: 'local-uuid' })(
      decisionItem({ localId: 'local-uuid' })('decision'),
    ),
    blockquote(p('quote')),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'))),
          taskList({ localId: 'local-uuid' })(
            taskItem({ localId: 'local-uuid' })('task'),
          ),
          panel({ panelType: 'info' })(p('Panel')),
          decisionList({ localId: 'local-uuid' })(
            decisionItem({ localId: 'local-uuid' })('decision'),
          ),
          blockquote(p('quote')),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      taskList({ localId: 'local-uuid' })(
        taskItem({ localId: 'local-uuid' })('task'),
      ),
      panel({ panelType: 'info' })(p('Panel')),
      decisionList({ localId: 'local-uuid' })(
        decisionItem({ localId: 'local-uuid' })('decision'),
      ),
      blockquote(p('quote')),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};

const paragraphBlockNodeAndParagraphHTML = {
  name: 'paragraph, block node and another paragraph',
  html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">paragraph</p><div data-panel-type="info"><div data-panel-content="true"><p>test</p></div></div><p>paragraph</p>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'), p('paragraph'))),
    panel({ panelType: 'info' })(p('test')),
    p('paragraph'),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p('paragraph'))),
    panel({ panelType: 'info' })(p('test')),
    p('paragraphTwo'),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('Tparagraph'))),
    panel({ panelType: 'info' })(p('test')),
    p('paragraphwo'),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    p('paragraph'),
    panel({ panelType: 'info' })(p('test')),
    p('paragraph'),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p('paragraph'))),
    panel({ panelType: 'info' })(p('test')),
    p('paragraphOne'),
    ol({ order: 2 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Threeparagraph'))),
    panel({ panelType: 'info' })(p('test')),
    p('paragraph'),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''), p('paragraph'))),
    panel({ panelType: 'info' })(p('test')),
    p('paragraph'),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'), p('paragraph'))),
          panel({ panelType: 'info' })(p('test')),
          p('paragraph'),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'), p('paragraph'))),
      panel({ panelType: 'info' })(p('test')),
      p('paragraph'),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};

const panelContentHTML = {
  name: 'panel content',
  html: `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;panel&quot;,{&quot;panelType&quot;:&quot;info&quot;,&quot;panelIcon&quot;:null,&quot;panelIconId&quot;:null,&quot;panelIconText&quot;:null,&quot;panelColor&quot;:null}]">hello</p>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Twohello')), li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p('helloTwo')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('Thellowo')), li(p('Three'))),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p('helloOne')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Threehello'))),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p('hello')), li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(tr(td({})(ol()(li(p('One')), li(p('Twohello')), li(p('Three')))))),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(
        li(p('Onehello')),
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};

const multipleParagraphsHTML = {
  name: 'multiple paragraphs',
  html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">beep</p><p>boop</p><p>whoop</p>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Twobeep'), p('boop'), p('whoop')), li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p('beep'), p('boop'), p('whoopTwo')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('Tbeep'), p('boop'), p('whoopwo')), li(p('Three'))),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p('beep'), p('boop'), p('whoopOne')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Threebeep'), p('boop'), p('whoop'))),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p('beep'), p('boop'), p('whoop')), li(p('Three'))),
  ),

  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(
            li(p('One')),
            li(p('Twobeep'), p('boop'), p('whoop')),
            li(p('Three')),
          ),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(
        li(p('Onebeep'), p('boop'), p('whoop')),
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};

const multipleParagraphsAndAListHTML = {
  name: 'multiple paragraphs and a list',
  html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">paragraph</p><ul class="ak-ul"><li><p>bullet list</p></li></ul><p>paragraph</p>`,
  expectedDocumentEndOfListItem: doc(
    ol()(
      li(p('One')),
      li(p('Twoparagraph'), ul(li(p('bullet list'))), p('paragraph')),
      li(p('Three')),
    ),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(
      li(p('One')),
      li(p('paragraph'), ul(li(p('bullet list'))), p('paragraphTwo')),
      li(p('Three')),
    ),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(
      li(p('One')),
      li(p('Tparagraph'), ul(li(p('bullet list'))), p('paragraphwo')),
      li(p('Three')),
    ),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(
      li(p('paragraph'), ul(li(p('bullet list'))), p('paragraphOne')),
      li(p('Two')),
      li(p('Three')),
    ),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(
      li(p('One')),
      li(p('Two')),
      li(p('Threeparagraph'), ul(li(p('bullet list'))), p('paragraph')),
    ),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(
      li(p('paragraph'), ul(li(p('bullet list'))), p('paragraph')),
      li(p('Three')),
    ),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(
            li(p('One')),
            li(p('Twoparagraph'), ul(li(p('bullet list'))), p('paragraph')),
            li(p('Three')),
          ),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(
        li(p('Oneparagraph'), ul(li(p('bullet list'))), p('paragraph')),
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};

const codeBlockHTML = {
  name: 'code block',
  html: `<meta charset='utf-8'><pre data-pm-slice="0 0 []"><code>code</code></pre>`,
  expectedDocumentEndOfListItem: doc(
    ol()(
      li(p('One')),
      li(p('Two'), code_block({})('code'), p('')),
      li(p('Three')),
    ),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(code_block({})('code'), p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(
      li(p('One')),
      li(p('T'), code_block({})('code'), p('wo')),
      li(p('Three')),
    ),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(code_block({})('code'), p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(
      li(p('One')),
      li(p('Two')),
      li(p('Three'), code_block({})('code'), p('')),
    ),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(code_block({})('code'), p('')), li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(
            li(p('One')),
            li(p('Two'), code_block({})('code'), p('')),

            li(p('Three')),
          ),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(
        li(p('One'), code_block({})('code'), p('')),
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};

const panelAndParagraphHTML = {
  name: 'panel and a paragraph',
  html: `<meta charset='utf-8'><div data-panel-type="info" data-pm-slice="2 1 []"><div data-panel-content="true"><p>Hello</p></div></div><p>world</p>`,
  expectedDocumentEndOfListItem: doc(
    ol()(li(p('One')), li(p('Two'))),
    panel({ panelType: 'info' })(p('Hello')),
    p('world'),
    ol({ order: 3 })(li(p('Three'))),
  ),
  expectedDocumentStartOfListItem: doc(
    ol()(li(p('One')), li(p(''))),
    panel({ panelType: 'info' })(p('Hello')),
    p('world'),
    ol({ order: 3 })(li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentMiddleOfListItem: doc(
    ol()(li(p('One')), li(p('T'))),
    panel({ panelType: 'info' })(p('Hello')),
    p('world'),
    ol({ order: 3 })(li(p('wo')), li(p('Three'))),
  ),
  expectedDocumentWithNestedList: doc(
    ol()(
      li(p('One')),
      li(p('Two'), ol()(li(p('nested')), li(p('list')))),
      li(p('Three')),
    ),
    panel({ panelType: 'info' })(p('Hello')),
    p('world'),
  ),
  expectedDocumentStartOfFirstListItem: doc(
    ol()(li(p())),
    panel({ panelType: 'info' })(p('Hello')),
    p('world'),
    ol({ order: 2 })(li(p('One')), li(p('Two')), li(p('Three'))),
  ),
  expectedDocumentEndOfLastListItem: doc(
    ol()(li(p('One')), li(p('Two')), li(p('Three'))),
    panel({ panelType: 'info' })(p('Hello')),
    p('world'),
  ),
  expectedDocumentTwoListItemsSelected: doc(
    ol()(li(p(''))),
    panel({ panelType: 'info' })(p('Hello')),
    p('world'),
    ol({ order: 2 })(li(p('Three'))),
  ),
  expectedDocumentEndOfListItemInsideTable: doc(
    table({
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: 'local-uuid',
    })(
      tr(
        td({})(
          ol()(li(p('One')), li(p('Two'))),
          panel({ panelType: 'info' })(p('Hello')),
          p('world'),
          ol({ order: 3 })(li(p('Three'))),
        ),
      ),
    ),
  ),
  expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList:
    doc(
      ol()(li(p('One'))),
      panel({ panelType: 'info' })(p('Hello')),
      p('world'),
      ol({ order: 2 })(
        li(p('T'), ol()(li(p('nested')), li(p('list')))),
        li(p('Three')),
      ),
    ),
};

const nodesToInsertTopLevel = [
  panelHTML,
  expandHTML,
  decisionHTML,
  actionHTML,
  quoteHTML,
  dividerHTML,
  headingHTML,
  tableHTML,
  layoutHTML,
  bodiedExtensionHTML,
  multipleBlockNodesHTML,
  paragraphBlockNodeAndParagraphHTML,
  panelAndParagraphHTML,
];

const nodesToInsertInNestedListsToo = [
  panelContentHTML,
  multipleParagraphsHTML,
  multipleParagraphsAndAListHTML,
  codeBlockHTML,
];

// The actual tests
describe('pasting into an ordered list when restartNumberedLists FF is true', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, { restartNumberedLists: true }])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(decorationsPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(betterTypeHistoryPlugin)
      .add([listPlugin, { restartNumberedLists: true }])
      .add([pastePlugin, {}])
      .add(panelPlugin)
      .add(hyperlinkPlugin)
      .add(blockTypePlugin)
      .add(tasksAndDecisionsPlugin)
      .add(expandPlugin)
      .add(contextPanelPlugin)
      .add(extensionPlugin)
      .add(tablesPlugin)
      .add(layoutPlugin)
      .add(compositionPlugin)
      .add([codeBlockPlugin, { appearance: 'full-page' }])
      .add(rulePlugin);

    return createEditor({
      doc,
      preset,
    });
  };
  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  describe('and cursor is at the end of a list item', () => {
    [...nodesToInsertTopLevel, ...nodesToInsertInNestedListsToo].forEach(
      (blockNode) => {
        it(`should paste ${blockNode.name} node where selection is and split the list but continue list numbering`, () => {
          const { editorView } = editor(docWithEndOfListItemSelection);
          dispatchPasteEvent(editorView, { html: blockNode.html });

          expect(editorView.state).toEqualDocumentAndSelection(
            blockNode.expectedDocumentEndOfListItem,
          );
          expect(() => {
            editorView.state.tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });

  describe('and cursor is at the start of a list item', () => {
    [...nodesToInsertTopLevel, ...nodesToInsertInNestedListsToo].forEach(
      (blockNode) => {
        it(`should paste ${blockNode.name} node where selection is and split the list but continue list numbering`, () => {
          const { editorView } = editor(docWithStartOfListItemSelection);
          dispatchPasteEvent(editorView, { html: blockNode.html });

          expect(editorView.state).toEqualDocumentAndSelection(
            blockNode.expectedDocumentStartOfListItem,
          );
          expect(() => {
            editorView.state.tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });

  describe('and cursor is in the middle of a list item', () => {
    [...nodesToInsertTopLevel, ...nodesToInsertInNestedListsToo].forEach(
      (blockNode) => {
        it(`should paste ${blockNode.name} node where selection is and split the list but continue list numbering`, () => {
          const { editorView } = editor(docWithMiddleOfListItemSelection);
          dispatchPasteEvent(editorView, { html: blockNode.html });

          expect(editorView.state).toEqualDocumentAndSelection(
            blockNode.expectedDocumentMiddleOfListItem,
          );
          expect(() => {
            editorView.state.tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });

  describe('and cursor is at the end of a list item which contains a nested list', () => {
    nodesToInsertTopLevel.forEach((blockNode) => {
      it(`should safeInsert ${blockNode.name} node after the list`, () => {
        const { editorView } = editor(
          docWithEndOfListItemContainingNestedlistSelection,
        );
        dispatchPasteEvent(editorView, { html: blockNode.html });

        expect(editorView.state).toEqualDocumentAndSelection(
          blockNode.expectedDocumentWithNestedList,
        );
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
  });

  describe('and cursor is at the start of a list item which contains a nested list', () => {
    nodesToInsertTopLevel.forEach((blockNode) => {
      it(`should safeInsert ${blockNode.name} node after the list`, () => {
        const { editorView } = editor(
          docWithStartOfListItemContainingNestedlistSelection,
        );
        dispatchPasteEvent(editorView, { html: blockNode.html });

        expect(editorView.state).toEqualDocumentAndSelection(
          blockNode.expectedDocumentWithNestedList,
        );
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
  });

  describe('and cursor is in the middle of a list item which contains a nested list', () => {
    nodesToInsertTopLevel.forEach((blockNode) => {
      it(`should safeInsert ${blockNode.name} node after the list`, () => {
        const { editorView } = editor(
          docWithMiddleOfListItemContainingNestedlistSelection,
        );
        dispatchPasteEvent(editorView, { html: blockNode.html });

        expect(editorView.state).toEqualDocumentAndSelection(
          blockNode.expectedDocumentWithNestedList,
        );
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
  });

  describe('and cursor is in the end of the last list item', () => {
    [...nodesToInsertTopLevel, ...nodesToInsertInNestedListsToo].forEach(
      (blockNode) => {
        it(`should paste ${blockNode.name} node after the list`, () => {
          const { editorView } = editor(docWithEndOfLastListItemSelection);
          dispatchPasteEvent(editorView, { html: blockNode.html });

          expect(editorView.state).toEqualDocumentAndSelection(
            blockNode.expectedDocumentEndOfLastListItem,
          );
          expect(() => {
            editorView.state.tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });

  describe('and cursor is at the start of the first list item', () => {
    [...nodesToInsertTopLevel, ...nodesToInsertInNestedListsToo].forEach(
      (blockNode) => {
        it(`should insert ${blockNode.name} node where the cursor is and split the list`, () => {
          const { editorView } = editor(docWithStartOfFirstListItemSelection);
          dispatchPasteEvent(editorView, { html: blockNode.html });

          expect(editorView.state).toEqualDocumentAndSelection(
            blockNode.expectedDocumentStartOfFirstListItem,
          );
          expect(() => {
            editorView.state.tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });

  describe('and selection is over two list items', () => {
    [...nodesToInsertTopLevel, ...nodesToInsertInNestedListsToo].forEach(
      (blockNode) => {
        it(`should insert ${blockNode.name} node where the cursor is and split the list`, () => {
          const { editorView } = editor(docWithTwoListItemsSelected);
          dispatchPasteEvent(editorView, { html: blockNode.html });

          expect(editorView.state).toEqualDocumentAndSelection(
            blockNode.expectedDocumentTwoListItemsSelected,
          );
          expect(() => {
            editorView.state.tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });

  describe('and cursor is at the end of a list item but the list is inside a table', () => {
    [...nodesToInsertTopLevel, ...nodesToInsertInNestedListsToo].forEach(
      (blockNode) => {
        it(`should paste ${blockNode.name} node where selection is and split the list but continue list numbering`, () => {
          const { editorView } = editor(
            docWithEndOfListItemSelectedAndNestedWithinATable,
          );
          dispatchPasteEvent(editorView, { html: blockNode.html });

          expect(editorView.state).toEqualDocumentAndSelection(
            blockNode.expectedDocumentEndOfListItemInsideTable,
          );
          expect(() => {
            editorView.state.tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });

  describe('and cursor is at the end of a list item and the list item that follows is a single character and has a nested list', () => {
    [...nodesToInsertTopLevel, ...nodesToInsertInNestedListsToo].forEach(
      (blockNode) => {
        it(`should paste ${blockNode.name} node where selection is and split the list but continue list numbering`, () => {
          const { editorView } = editor(
            docWithEndOfListItemFollowedBySingleCharacterListItemContainingNestedListSelection,
          );
          dispatchPasteEvent(editorView, { html: blockNode.html });

          expect(editorView.state).toEqualDocumentAndSelection(
            blockNode.expectedDocumentEndOfListItemFollowedBySingleCharacterListItemAndNestedList,
          );
          expect(() => {
            editorView.state.tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });
});
