import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import {
  doc,
  p,
  ol,
  li,
  mediaSingle,
  media,
  code_block,
  //  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { ReplaceStep } from 'prosemirror-transform';
import randomId from '@atlaskit/editor-test-helpers/random-id';
import { moveTargetIntoList } from '../../../utils/replace-content';

describe('plugins/lists/backspace: move content inside lists', () => {
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;

  describe('when there is not leaf nodes inside the previous list item', () => {
    const case00 = doc(
      // prettier-ignore
      ol(
        li(p('')),
        li(
          p('nice', '{insertPosition}'),
        ),
      ),
      '{target}',
      p('hello'),
    )(defaultSchema);

    describe.each([case00])('[case%#]', (currentDoc) => {
      it('should return a valid step', () => {
        const $target = currentDoc.resolve(currentDoc.refs['target']);

        const step = moveTargetIntoList({
          insertPosition: currentDoc.refs['insertPosition'],
          $target,
        });

        const result = step.apply(currentDoc);
        expect(result.failed).toBeFalsy();
      });
    });
  });

  describe('when there is leaf block nodes inside the previous list item', () => {
    const case00 = doc(
      ol(
        li(p('')),
        li(
          p('nice{insertPosition}'),
          mediaSingle({ layout: 'wrap-left' })(
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            })(),
          ),
        ),
      ),
      '{target}',
      p('hello'),
    )(defaultSchema);
    const case01 = doc(
      // prettier-ignore
      ol(
        li(p('')),
        li(
          p('nice{insertPosition}'),
          code_block()('nothing'),
        ),
      ),
      '{target}',
      p('hello'),
    )(defaultSchema);

    describe.each([case00, case01])('[case%#]', (currentDoc) => {
      it('should return an invalid step', () => {
        const $target = currentDoc.resolve(currentDoc.refs['target']);

        const step = moveTargetIntoList({
          insertPosition: currentDoc.refs['insertPosition'],
          $target,
        });

        const result = step.apply(currentDoc);
        expect(result.failed).toBeTruthy();
      });
    });

    describe('and when the target is empty', () => {
      it('should return a replace step', () => {
        const currentDoc = doc(
          ol(
            li(p('')),
            li(
              p('nice{insertPosition}'),
              mediaSingle({ layout: 'wrap-left' })(
                media({
                  id: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                  __fileMimeType: 'image/png',
                })(),
              ),
            ),
          ),
          '{target}',
          p(''),
        )(defaultSchema);
        const $target = currentDoc.resolve(currentDoc.refs['target']);
        const step = moveTargetIntoList({
          insertPosition: currentDoc.refs['insertPosition'],
          $target,
        });

        expect(step).toBeInstanceOf(ReplaceStep);
      });
    });
  });
});
