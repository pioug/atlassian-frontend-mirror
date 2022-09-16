import { table } from '@atlaskit/adf-schema';

import { insertProseMirrorContent } from '../../insert-node-helpers';
jest.mock('../../insert-node-helpers', () => ({
  insertProseMirrorContent: jest.fn(),
}));

import {
  findCreateNodeHandler,
  handleInsertContent,
} from '../../insert-content-handlers';
import { EditorPlugin } from '../../../types/editor-plugin';

describe('#insert-content-handlers', () => {
  const node = 'table';
  let editorPlugins: EditorPlugin[] = [];

  beforeEach(() => {
    editorPlugins = [];
  });

  describe('findCreateNodeHandler', () => {
    describe('when there is a plugin overriding the default node creation', () => {
      const fakeCreateNodeHandler = jest.fn();

      beforeEach(() => {
        const fakeEditorPlugin: EditorPlugin = {
          name: 'fakeTablePlugin',
          nodes: () => [{ name: 'table', node: table }],
          pluginsOptions: {
            createNodeHandler: fakeCreateNodeHandler,
          },
        };

        editorPlugins.push(fakeEditorPlugin);
      });

      it('should return the create node handler', () => {
        const result = findCreateNodeHandler({ node, editorPlugins });
        expect(result).toBe(fakeCreateNodeHandler);
      });
    });

    describe('when there are multiple plugins overriding the default node creation', () => {
      const firstFakeCreateNodeHandler = jest.fn();
      const secondFakeCreateNodeHandler = jest.fn();

      beforeEach(() => {
        editorPlugins.push({
          name: 'fakeTablePlugin',
          nodes: () => [{ name: 'table', node: table }],
          pluginsOptions: {
            createNodeHandler: firstFakeCreateNodeHandler,
          },
        });

        editorPlugins.push({
          name: 'anotherFakeTablePlugin',
          nodes: () => [{ name: 'table', node: table }],
          pluginsOptions: {
            createNodeHandler: secondFakeCreateNodeHandler,
          },
        });
      });

      it('should return the create node handler', () => {
        const result = findCreateNodeHandler({ node, editorPlugins });
        expect(result).toBe(firstFakeCreateNodeHandler);
      });
    });

    describe('when there is no custom handler', () => {
      beforeEach(() => {
        editorPlugins.push({
          name: 'fakeTablePlugin',
          nodes: () => [{ name: 'table', node: table }],
        });
      });

      it('should return null', () => {
        const result = findCreateNodeHandler({ node, editorPlugins });
        expect(result).toBeNull();
      });
    });

    describe('when there are no plugins', () => {
      it('should return null', () => {
        const result = findCreateNodeHandler({ node, editorPlugins });
        expect(result).toBeNull();
      });
    });
  });

  describe('#handleInsertContent', () => {
    const fakeDefaultTableNode = jest.fn();
    const fakeTableNodeType = {
      createAndFill: () => fakeDefaultTableNode,
    };
    const fakeNodeOverride = jest.fn();
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
        const fakeEditorPlugin: EditorPlugin = {
          name: 'fakeTablePlugin',
          nodes: () => [{ name: 'table', node: table }],
          pluginsOptions: {
            createNodeHandler: () => {
              return fakeNodeOverride;
            },
          },
        };

        editorPlugins.push(fakeEditorPlugin);

        result = handleInsertContent({
          node: 'table',
          options: {
            selectNodeInserted: false,
          },
          editorPlugins,
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
          node: 'table',
          options: {
            selectNodeInserted: false,
          },
          editorPlugins,
        })(fakeTransaction as any);
      });

      it('should call the insertProseMirrorContent with the default createAndFill from the schema', () => {
        expect(insertProseMirrorContent).toHaveBeenCalledWith(
          expect.objectContaining({
            node: fakeDefaultTableNode,
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
          editorPlugins,
        })(fakeTransaction as any);

        expect(result).toBeFalsy();
      });
    });
  });
});
