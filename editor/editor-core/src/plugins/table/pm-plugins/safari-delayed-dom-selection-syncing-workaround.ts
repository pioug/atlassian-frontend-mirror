import { PluginKey } from 'prosemirror-state';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

export const tableSafariDelayedDomSelectionSyncingWorkaroundKey = new PluginKey(
  'tableSafariDelayedDomSelectionSyncingWorkaround',
);
export const createPlugin = () => {
  // From a review of the prosemirror-view source code,
  // the only places where a view relies on the presence
  // of view.mouseDown are;
  //   - when checking it's presence in selectionToDOM
  //     to delay drag selections
  //   - to ensure it is cleaned up when the mouseup
  //     event is not fired in a previous mousedown event

  // Because we are manually wiping the view.mouseDown,
  // we manage this custom cleanup ourselves
  let prevMouseDownDone: null | (() => void) = null;

  return new SafePlugin({
    key: tableSafariDelayedDomSelectionSyncingWorkaroundKey,

    props: {
      handleDOMEvents: {
        mousedown: (view) => {
          // Workaround issue in safari where table selections
          //  do not work correctly since prosemirror delayed
          // DOM selection syncing during pointer drag.
          //
          // https://github.com/ProseMirror/prosemirror-view/commit/885258b80551ac87b81601d3ed25f552aeb22293

          // This fix removes the selectionToDOM from the view
          // prior to selectionToDOM being called.
          // selectionToDOM checks if there is an "active"
          // mouseDown, and if so, it delays running logic
          // which causes the table selections issue.

          // The handleDOMEvents are called before ProseMirror
          // events fired on the editable DOM element.
          // This means the view.mouseView will not yet be
          // created when the mousedown event starts.
          // https://prosemirror.net/docs/ref/#view.EditorProps.handleDOMEvents
          //
          // Because selectionToDOM is only added to the script
          // tasks queue following the mousedown event, we can
          // prepend a task which will clear the mouseDown from
          // the view. We do this using a setTimout with no
          // interval.

          if (prevMouseDownDone) {
            // avoid memory leaks when the mouseup event is not fired
            // in a previous mousedown event
            prevMouseDownDone();
          }

          setTimeout(() => {
            // the ts-ignores here are required due to the
            // view.mouseDown being an internal which is
            // not part of the views type signature

            // @ts-ignore
            if (view.mouseDown) {
              // @ts-ignore
              prevMouseDownDone = view.mouseDown.done.bind(view.mouseDown);
              // @ts-ignore
              view.mouseDown = null;
            }
          });

          return false;
        },
      },
    },
  });
};
