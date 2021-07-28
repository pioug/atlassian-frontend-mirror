import { TextSelection, Selection } from 'prosemirror-state';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  p,
  ul,
  li,
  doc,
  code_block,
  RefsNode,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { normalizeListItemsSelection } from '../../../utils/selection';

type DocumentType = DocBuilder;
function createRefsDocNode(documentNode: DocumentType): RefsNode {
  return documentNode(sampleSchema);
}

function fixedSelectionFromRefs(doc: RefsNode): Selection | null {
  const refs = doc.refs;
  const { fixedStart, fixedEnd, '>': gt, '<': lt } = refs;
  const startIsInteger = Number.isInteger(fixedStart);
  const endIsInteger = Number.isInteger(fixedEnd);

  if (startIsInteger && endIsInteger) {
    return TextSelection.create(doc, fixedStart, fixedEnd);
  }

  if (startIsInteger && Number.isInteger(gt)) {
    return TextSelection.create(doc, fixedStart, gt);
  }

  if (Number.isInteger(lt) && endIsInteger) {
    return TextSelection.create(doc, lt, fixedEnd);
  }

  return null;
}

describe('utils/selection', () => {
  describe('#normalizeListItemsSelection', () => {
    const case0: [string, DocumentType] = [
      'is a cursor selection',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(p('A')),
          li(
            p('B'),
            ul(
              li(p('B1')),
              li(p('B2{<>}')),
              li(p('B3')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ];

    const case1: [string, DocumentType] = [
      'range selection starts in a non-visible position',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(p('A')),
          li(
            p('B'),
            ul(
              li(p('B1', '{<}')),
              li(p('{fixedStart}', 'B2{>}')),
              li(p('B3')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ];

    const case2: [string, DocumentType] = [
      'range selection ends in a non-visible position',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(p('A')),
          li(
            p('B'),
            ul(
              li(p('B1')),
              li(p('{<}B2{fixedEnd}')),
              li(p('{>}B3')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ];

    const case3: [string, DocumentType] = [
      'range selection starts and ends in a non-visible position',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(p('A')),
          li(
            p('B'),
            ul(
              li(p('B1{<}')),
              li(p('{fixedStart}B2{fixedEnd}')),
              li(p('{>}B3')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ];

    const case4: [string, DocumentType] = [
      'range selection starts in a non-visible sibling list item',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(p('A{<}')),
          li(
            p('{fixedStart}B'),
            ul(
              li(p('B1')),
              li(p('B2{fixedEnd}')),
              li(p('{>}B3')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ];

    const case5: [string, DocumentType] = [
      'range selection starts in a non-visible sibling list item with nested list',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(
            p('A'),
            ul(
              li(p('A1{<}')),
            ),
          ),
          li(
            p('{fixedStart}B'),
            ul(
              li(p('B1')),
              li(p('B2{fixedEnd}')),
              li(p('{>}B3')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ];

    const case6: [string, DocumentType] = [
      'range selection ends in a non-visible sibling list item',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(p('A')),
          li(
            p('{<}B'),
            ul(
              li(p('B1')),
              li(p('B2')),
              li(p('B3{fixedEnd}')),
            ),
          ),
          li(p('{>}C')),
        ),
      ),
    ];

    const case7: [string, DocumentType] = [
      'range selection stars and ends in a non-visible sibling list item',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(p('A{<}')),
          li(
            p('{fixedStart}B'),
            ul(
              li(p('B1')),
              li(p('B2')),
              li(p('B3{fixedEnd}')),
            ),
          ),
          li(p('{>}C')),
        ),
      ),
    ];

    const case8: [string, DocumentType] = [
      'range selection stars and ends in a non-visible sibling list item with nested list',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(
            p('A'),
            ul(
              li(p('A1{<}')),
            ),
          ),
          li(
            p('{fixedStart}B'),
            ul(
              li(p('B1')),
              li(p('B2')),
              li(p('B3{fixedEnd}')),
            ),
          ),
          li(p('{>}C')),
        ),
      ),
    ];

    const case9: [string, DocumentType] = [
      'range selection stars in a non-visible sibling list item and ends in a code block',
      // Scenario
      doc(
        // prettier-ignore
        ul(
          li(
            p('text{<}'),
            ul(
              li(code_block()('{fixedStart}', 'text{>}')),
            ),
          ),
          li(p('text')),
        ),
      ),
    ];

    describe.each<[string, DocumentType]>([
      // prettier-ignore
      case0,
      case1,
      case2,
      case3,
      case4,
      case5,
      case6,
      case7,
      case8,
      case9,
    ])('[case%#] when %s', (_scenario, scenario) => {
      it('should match the expected selection', () => {
        const docRefs = createRefsDocNode(scenario);
        const myState = createEditorState(scenario);
        const { selection, doc } = myState;
        const fixedSelection = fixedSelectionFromRefs(docRefs) || selection;

        const result = normalizeListItemsSelection({
          selection,
          doc,
        });

        expect(result.$from.pos).toBe(fixedSelection.$from.pos);
        expect(result.$to.pos).toBe(fixedSelection.$to.pos);
      });
    });
  });
});
