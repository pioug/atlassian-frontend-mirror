import {
  AllDragTypes,
  BaseEventPayload,
  CleanupFn,
  MonitorArgs,
} from '@atlaskit/pragmatic-drag-and-drop/types';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';

type State<DragType extends AllDragTypes> =
  | {
      type: 'idle';
    }
  | {
      type: 'initializing';
      frameId: number;
      latestArgs: BaseEventPayload<DragType>;
    }
  | {
      type: 'running';
      frameId: number;
      timeOfLastFrame: DOMHighResTimeStamp;
      latestArgs: BaseEventPayload<DragType>;
    };

export function scheduler<DragType extends AllDragTypes>({
  monitor,
  onFrame,
  onReset,
}: {
  monitor: (args: MonitorArgs<DragType>) => CleanupFn;
  onFrame: ({
    latestArgs,
    timeSinceLastFrame,
  }: {
    latestArgs: BaseEventPayload<DragType>;
    timeSinceLastFrame: number;
  }) => void;
  onReset: () => void;
}): CleanupFn {
  let state: State<DragType> = { type: 'idle' };

  function loop(currentTime: DOMHighResTimeStamp) {
    if (state.type !== 'running') {
      return;
    }
    const timeSinceLastFrame = currentTime - state.timeOfLastFrame;
    onFrame({ latestArgs: state.latestArgs, timeSinceLastFrame });

    state.timeOfLastFrame = currentTime;
    state.frameId = requestAnimationFrame(loop);
  }

  function reset() {
    if (state.type === 'idle') {
      return;
    }
    cancelAnimationFrame(state.frameId);
    state = { type: 'idle' };
    onReset();
  }

  const cleanup = combine(
    monitor({
      onDragStart(args) {
        state = {
          type: 'initializing',
          latestArgs: args,
          frameId: requestAnimationFrame(time => {
            if (state.type !== 'initializing') {
              return;
            }
            state = {
              type: 'running',
              timeOfLastFrame: time,
              latestArgs: state.latestArgs,
              frameId: requestAnimationFrame(loop),
            };
          }),
        };
      },
      onDrag(args) {
        if (state.type !== 'idle') {
          state.latestArgs = args;
        }
      },
      onDrop: reset,
    }),
    reset,
  );

  return cleanup;
}
