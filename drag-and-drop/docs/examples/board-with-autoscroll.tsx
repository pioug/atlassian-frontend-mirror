import React, { useEffect } from 'react';

import { autoScroller } from '@atlaskit/drag-and-drop-autoscroll';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';

import BoardExample from './board';

export default function AutoScrollExample() {
  useEffect(() => {
    combine(
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.type === 'card' || source.data.type === 'column',
        onDragStart: ({ location }) => {
          autoScroller.start({ input: location.current.input });
        },
        onDrop: () => {
          autoScroller.stop();
        },
        onDrag: ({ location }) => {
          autoScroller.updateInput({
            input: location.current.input,
          });
        },
      }),
      () => autoScroller.stop(),
    );
  }, []);

  return <BoardExample />;
}
