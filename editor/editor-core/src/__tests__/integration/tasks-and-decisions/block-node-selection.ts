it.todo('Implement decision list selection tests');
export {};
// import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';
// runBlockNodeSelectionTestSuite({
//  nodeName: 'decisions',
//  selector: 'ol[data-node-type="decisionList"]',
//  editorOptions: { allowTasksAndDecisions: true },
//  adfNode: {
//    type: 'decisionList',
//    attrs: {
//      localId: 'ff57a749-8b4b-4f5e-87e2-c726d66b9ac5',
//    },
//    content: [
//      {
//        type: 'decisionItem',
//        attrs: {
//          localId: '3b8855ca-ac64-474f-9001-ebcad4968eaf',
//          state: 'DECIDED',
//        },
//      },
//    ],
//  },
//
//  skipTests: {
//    // DecisionItem has a weird a editable SVG
//    // And that shouldn't be editable
//    'Extend selection left two characters to select [block-node] from line below with shift + arrow left':
//      ['*'],
//    'Extend a selection from end of the document to the start when [block-node] is the first node':
//      ['*'],
//    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
//      ['*'],
//  },
//});
