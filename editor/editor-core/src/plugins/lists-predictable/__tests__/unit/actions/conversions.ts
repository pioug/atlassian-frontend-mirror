import { EditorState } from 'prosemirror-state';
import { Schema, NodeType } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';
import {
  doc,
  p,
  ul,
  li,
  ol,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { convertListType } from '../../../actions/conversions';

/**
 * The lists specified for testing here use letters to denote sequential list items and
 * suffixed numbers to denote the level of indentation. For example, The top-level
 * list would be labelled A, B, C; first-level indents labelled A-1, B-1, C-1;
 * second-level indents labelled A-1-1, B-1-1, C-1-1 and so on. Additional letters like
 * AAA do not have special meaning and are simply used to test selection edge cases.
 */

describe('list conversion', () => {
  function createEditorState(documentNode: RefsNode) {
    const myState = EditorState.create({
      doc: documentNode,
    });
    const { tr } = myState;
    setSelectionTransform(documentNode, tr);
    return myState.apply(tr);
  }

  const {
    nodes: { bulletList: bulletListNodeType, orderedList: orderedListNodeType },
  } = sampleSchema;

  type DocToRefsNodeType = (schema: Schema<any, any>) => RefsNode;
  const testConversions = (
    originalDoc: DocToRefsNodeType,
    convertedDoc: DocToRefsNodeType,
    nodeType: NodeType,
  ) => {
    const editorState = createEditorState(originalDoc(sampleSchema));
    const tr = editorState.tr;
    convertListType({ tr, nextListNodeType: nodeType });
    expect(tr.doc).toEqualDocument(convertedDoc(sampleSchema));
  };
  const testOrderedToBullet = (
    originalDoc: DocToRefsNodeType,
    convertedDoc: DocToRefsNodeType,
  ) => {
    testConversions(originalDoc, convertedDoc, bulletListNodeType);
  };
  const testBulletToOrdered = (
    originalDoc: DocToRefsNodeType,
    convertedDoc: DocToRefsNodeType,
  ) => {
    testConversions(originalDoc, convertedDoc, orderedListNodeType);
  };

  describe('in caret selection', () => {
    it('converts all siblings', () => {
      const originalDoc = doc(ol(li(p('A')), li(p('{<>}B'))));
      const convertedDoc = doc(ul(li(p('A')), li(p('{<>}B'))));
      testOrderedToBullet(originalDoc, convertedDoc);
      testBulletToOrdered(convertedDoc, originalDoc);
    });

    it('converts siblings but leaves cousins alone', () => {
      const originalDoc = doc(
        ul(
          li(p('A')),
          li(p('B'), ol(li(p('B1{<>}')))),
          li(p('C'), ul(li(p('C-1')))),
        ),
      );
      const convertedDoc = doc(
        ul(
          li(p('A')),
          li(p('B'), ul(li(p('B1{<>}')))),
          li(p('C'), ul(li(p('C-1')))),
        ),
      );
      testOrderedToBullet(originalDoc, convertedDoc);
      testBulletToOrdered(convertedDoc, originalDoc);
    });

    it('converts siblings but leaves children alone', () => {
      const originalDoc = doc(
        ol(li(p('A{<>}'), ol(li(p('A-1'), ol(li(p('A-1-1')))))), li(p('B'))),
      );
      const convertedDoc = doc(
        ul(li(p('A{<>}'), ol(li(p('A-1'), ol(li(p('A-1-1')))))), li(p('B'))),
      );
      testOrderedToBullet(originalDoc, convertedDoc);
      testBulletToOrdered(convertedDoc, originalDoc);
    });
  });

  describe('in range selection', () => {
    it('converts all siblings even if selection only covers some of them', () => {
      const originalDoc = doc(
        ol(li(p('AAA')), li(p('B{<}BB')), li(p('CC{>}C')), li(p('DDD'))),
      );
      const convertedDoc = doc(
        ul(li(p('AAA')), li(p('B{<}BB')), li(p('CC{>}C')), li(p('DDD'))),
      );
      testOrderedToBullet(originalDoc, convertedDoc);
      testBulletToOrdered(convertedDoc, originalDoc);
    });

    describe('in a nested list, only converts siblings at the levels that are selected', () => {
      it('scenario 1', () => {
        const originalDoc = doc(
          ol(
            li(
              p('{<}AAA'),
              ol(
                li(p('AAA-1{>}'), ol(li(p('AAA-1-1'), ol(li(p('AAA-1-1-1')))))),
              ),
            ),
          ),
        );
        const convertedDoc = doc(
          ul(
            li(
              p('{<}AAA'),
              ul(
                li(p('AAA-1{>}'), ol(li(p('AAA-1-1'), ol(li(p('AAA-1-1-1')))))),
              ),
            ),
          ),
        );
        testOrderedToBullet(originalDoc, convertedDoc);
        testBulletToOrdered(convertedDoc, originalDoc);
      });

      it('scenario 2', () => {
        const originalDoc = doc(
          ol(
            li(
              p('{<}AAA'),
              ol(
                li(p('AAA-1{>}'), ol(li(p('AAA-1-1'), ol(li(p('AAA-1-1-1')))))),
                li(p('AAA-2')),
              ),
            ),
            li(p('BBB')),
          ),
        );
        const convertedDoc = doc(
          ul(
            li(
              p('{<}AAA'),
              ul(
                li(p('AAA-1{>}'), ol(li(p('AAA-1-1'), ol(li(p('AAA-1-1-1')))))),
                li(p('AAA-2')),
              ),
            ),
            li(p('BBB')),
          ),
        );
        testOrderedToBullet(originalDoc, convertedDoc);
        testBulletToOrdered(convertedDoc, originalDoc);
      });

      it('scenario 3', () => {
        const originalDoc = doc(
          ol(
            li(
              p('AAA'),
              ol(
                li(
                  p('AAA-1'),
                  ol(li(p('AA{<}A-1-1'), ol(li(p('AAA-1{>}-1-1'))))),
                ),
                li(p('AAA-2')),
              ),
            ),
            li(p('BBB')),
          ),
        );
        const convertedDoc = doc(
          ol(
            li(
              p('AAA'),
              ol(
                li(
                  p('AAA-1'),
                  ul(li(p('AA{<}A-1-1'), ul(li(p('AAA-1{>}-1-1'))))),
                ),
                li(p('AAA-2')),
              ),
            ),
            li(p('BBB')),
          ),
        );
        testOrderedToBullet(originalDoc, convertedDoc);
        testBulletToOrdered(convertedDoc, originalDoc);
      });

      it('scenario 4', () => {
        const originalDoc = doc(
          ol(
            li(p('AAA'), ol(li(p('AAA-1')), li(p('AA{<}A-2')))),
            li(p('BBB{>}')),
          ),
        );
        const convertedDoc = doc(
          ul(
            li(p('AAA'), ul(li(p('AAA-1')), li(p('AA{<}A-2')))),
            li(p('BBB{>}')),
          ),
        );
        testOrderedToBullet(originalDoc, convertedDoc);
        testBulletToOrdered(convertedDoc, originalDoc);
      });

      it('scenario 5', () => {
        const originalDoc = doc(
          ol(
            li(p('AAA'), ol(li(p('AAA-1')), li(p('{<}AA{>}A-2')))),
            li(p('BBB')),
          ),
        );
        const convertedDoc = doc(
          ol(
            li(p('AAA'), ul(li(p('AAA-1')), li(p('{<}AA{>}A-2')))),
            li(p('BBB{>}')),
          ),
        );
        testOrderedToBullet(originalDoc, convertedDoc);
        testBulletToOrdered(convertedDoc, originalDoc);
      });
    });

    describe('in a nested list, converts the entire list if it is covered by the selection', () => {
      it('scenario 1', () => {
        const originalDoc = doc(
          ol(
            li(
              p('{<}AAA'),
              ol(
                li(p('AAA-1'), ol(li(p('AAA-1-1'), ol(li(p('AAA-1-1-1{>}')))))),
              ),
            ),
          ),
        );
        const convertedDoc = doc(
          ul(
            li(
              p('{<}AAA'),
              ul(
                li(p('AAA-1'), ul(li(p('AAA-1-1'), ul(li(p('AAA-1-1-1{>}')))))),
              ),
            ),
          ),
        );
        testOrderedToBullet(originalDoc, convertedDoc);
        testBulletToOrdered(convertedDoc, originalDoc);
      });

      it('scenario 2', () => {
        const originalDoc = doc(
          ol(
            li(p('{<}AAA'), ol(li(p('AAA-1')), li(p('AAA-2')), li(p('AAA-3')))),
            li(p('BBB'), ol(li(p('BBB-1')), li(p('BBB-2')))),
            li(p('CCC')),
            li(p('DDD{>}')),
          ),
        );
        const convertedDoc = doc(
          ul(
            li(p('{<}AAA'), ul(li(p('AAA-1')), li(p('AAA-2')), li(p('AAA-3')))),
            li(p('BBB'), ul(li(p('BBB-1')), li(p('BBB-2')))),
            li(p('CCC')),
            li(p('DDD{>}')),
          ),
        );
        testOrderedToBullet(originalDoc, convertedDoc);
        testBulletToOrdered(convertedDoc, originalDoc);
      });
    });
  });
});
