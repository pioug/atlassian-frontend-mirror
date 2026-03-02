import transformer from '../upgrade-pragmatic-drag-and-drop-to-stable';

import { check } from './_framework';

describe('shift offsetFromPointer() to pointerOutsideOfPreview()', () => {
	check({
		transformer,
		it: 'should transform imports and usage',
		original: `
      import {
        draggable
      } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
      import { offsetFromPointer } from '@atlaskit/pragmatic-drag-and-drop/util/offset-from-pointer';
      import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
      import { token } from '@atlaskit/tokens';

      draggable({
        element,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: offsetFromPointer({
              x: token('space.200', '16px'),
              y: token('space.100', '8px'),
            }),
            render({ container }) {
              setDraggableState({ type: 'preview', container });

              return () => setDraggableState(draggingState);
            },
          });
        },
      });
    `,
		expected: `
      import {
        draggable
      } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
      import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
      import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
      import { token } from '@atlaskit/tokens';

      draggable({
        element,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: token('space.200', '16px'),
              y: token('space.100', '8px'),
            }),
            render({ container }) {
              setDraggableState({ type: 'preview', container });

              return () => setDraggableState(draggingState);
            },
          });
        },
      });
  `,
	});
});
