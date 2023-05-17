jest.mock('../../plugin/insert-node-helpers', () => ({
  insertProseMirrorContent: jest.fn(),
}));
import { Node as PMNode } from 'prosemirror-model';

import { text } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { handleInsertContent } from '../../plugin/insert-content-handlers';
import { insertProseMirrorContent } from '../../plugin/insert-node-helpers';

describe('#insert-content-handlers', () => {
  describe('#handleInsertContent', () => {
    const fakeDefaultTableNode = jest.fn();
    const fakeTableNodeType = {
      createAndFill: () => fakeDefaultTableNode,
    };
    const fakeNodeOverride = text('some text', defaultSchema);
    const fakeTransaction = {
      doc: { type: { schema: { nodes: { table: fakeTableNodeType } } } },
      scrollIntoView: jest.fn(),
    };

    beforeEach(() => {
      (insertProseMirrorContent as jest.Mock).mockClear();
      fakeTransaction.scrollIntoView.mockClear();
    });

    describe('when there is a create node handler', () => {
      let result = false;
      beforeEach(() => {
        result = handleInsertContent({
          node: fakeNodeOverride as PMNode,
          options: {
            selectNodeInserted: false,
          },
        })(fakeTransaction as any);
      });

      it('should call the insertProseMirrorContent with the handler result', () => {
        expect(insertProseMirrorContent).toHaveBeenCalledWith(
          expect.objectContaining({
            node: fakeNodeOverride,
          }),
        );
      });

      it('should call the scrollIntoView', () => {
        expect(fakeTransaction.scrollIntoView).toHaveBeenCalledTimes(1);
      });

      it('should return true', () => {
        expect(result).toBeTruthy();
      });
    });

    describe('when there is no custom handler', () => {
      let result = false;

      beforeEach(() => {
        result = handleInsertContent({
          node: fakeNodeOverride as PMNode,
          options: {
            selectNodeInserted: false,
          },
        })(fakeTransaction as any);
      });

      it('should call the insertProseMirrorContent with the default createAndFill from the schema', () => {
        expect(insertProseMirrorContent).toHaveBeenCalledWith(
          expect.objectContaining({
            node: fakeNodeOverride,
          }),
        );
      });

      it('should call the scrollIntoView', () => {
        expect(fakeTransaction.scrollIntoView).toHaveBeenCalledTimes(1);
      });

      it('should return true', () => {
        expect(result).toBeTruthy();
      });
    });

    describe('when node is not a valid', () => {
      it('should return false', () => {
        const result = handleInsertContent({
          // @ts-ignore fail-safe check for runtime
          node: 'notAValid',
          options: {
            selectNodeInserted: false,
          },
        })(fakeTransaction as any);

        expect(result).toBeFalsy();
      });
    });
  });
});
