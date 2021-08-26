import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { useLoadItems } from '../../../../ui/hooks/use-load-items';
import type { TypeAheadHandler } from '../../../../types';
import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import { renderHook } from '@testing-library/react-hooks';

describe('Hooks: useLoadItems', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset,
    });

  const items: TypeAheadItem[] = [
    {
      title: 'Earth',
    },
    {
      title: 'Mars',
    },
    {
      title: 'Jupiter',
    },
  ];
  let triggerHandler: TypeAheadHandler;
  beforeEach(() => {
    triggerHandler = {
      id: TypeAheadAvailableNodes.QUICK_INSERT,
      trigger: '/',
      getItems: jest.fn(() => {
        return Promise.resolve(items);
      }),
      selectItem: jest.fn(),
    };
  });

  describe('when useLoadItems is initialised', () => {
    it('should return an empty array until triggerHandler.getItems() is resolved', () => {
      const { editorView } = editor(doc(p('Hello {<>}')));

      const { result } = renderHook(() =>
        useLoadItems(triggerHandler, editorView, ''),
      );

      expect(result.current).toEqual([]);
    });

    it('should return items when triggerHandler.getItems() is resolved', async () => {
      const { editorView } = editor(doc(p('Hello {<>}')));

      const { result, waitForNextUpdate } = renderHook(() =>
        useLoadItems(triggerHandler, editorView, ''),
      );

      await waitForNextUpdate();
      expect(result.current).toEqual(items);
    });
  });
  describe('when the query has changed', () => {
    it('should call triggerHandler.getItems() again', async () => {
      const { editorView } = editor(doc(p('Hello {<>}')));

      const { waitForNextUpdate, rerender } = renderHook(
        ({ query }) => useLoadItems(triggerHandler, editorView, query),
        {
          initialProps: {
            query: '',
          },
        },
      );

      await waitForNextUpdate();
      rerender({ query: 'new' });
      expect(triggerHandler.getItems).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the query has not changed', () => {
    it('should not call triggerHandler.getItems() again', async () => {
      const { editorView } = editor(doc(p('Hello {<>}')));

      const { waitForNextUpdate, rerender } = renderHook(
        ({ query }) => useLoadItems(triggerHandler, editorView, query),
        {
          initialProps: {
            query: '',
          },
        },
      );

      await waitForNextUpdate();
      rerender({ query: '' });
      expect(triggerHandler.getItems).toHaveBeenCalledTimes(1);
    });
  });
});
