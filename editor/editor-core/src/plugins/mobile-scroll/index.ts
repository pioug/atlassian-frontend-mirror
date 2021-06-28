import { Plugin, PluginSpec } from 'prosemirror-state';
import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin } from '../../types';
import { MobileScrollActionTypes } from './actions';
import { setHeightDiff, setWindowHeight } from './commands';
import { MobileScrollPluginState, ScrollValue } from './types';
import {
  createPluginState,
  getPluginState,
  mobileScrollPluginKey,
} from './plugin-factory';

// 44 pixels squared is the minimum size for a tap target as per Apple's UX design guidelines
export const MIN_TAP_SIZE_PX = 44;

const getInitialState = (): MobileScrollPluginState => ({
  keyboardHeight: -1,
  heightDiff: -1,
  mobilePaddingTop: 0,
  windowHeight: window.innerHeight,
});

/**
 * Plugin to help fix behaviour of scrolling on mobile devices:
 *
 * 1. Ensures selection is scrolled into view when keyboards are shown
 * 2. On iOS devices it ensures the user does not end up typing behind the on-screen keyboard
 *    The viewport height on iOS does not change if the keyboard is showing or not,
 *    it is always the full height. There is a bridge method which informs us of
 *    the current height taken up by the keyboard which works with this plugin to
 *    set the scroll margin/threshold to match
 *
 */

const createPlugin = (dispatch: Dispatch) => {
  let rafId: number | undefined;

  return new Plugin({
    state: createPluginState(dispatch, getInitialState),
    key: mobileScrollPluginKey,
    props: {
      scrollThreshold: undefined,
      scrollMargin: undefined,
      handleScrollToSelection(editorView) {
        // document.scrollingElement not supported in IE11, but as this is a plugin for iOS
        // only, we don't care
        // eslint-disable-next-line compat/compat
        const scrollElement = document.scrollingElement;
        if (!scrollElement) {
          return false;
        }

        const { keyboardHeight, heightDiff } = getPluginState(editorView.state);
        const newHeightDiff = scrollElement.clientHeight - window.innerHeight;

        if (heightDiff !== newHeightDiff) {
          setHeightDiff(newHeightDiff)(editorView.state, editorView.dispatch);
          updateScrollValues.call(
            this as PluginSpec,
            keyboardHeight,
            newHeightDiff,
          );
        }

        return false;
      },
    },
    appendTransaction(transactions, oldState, newState) {
      const scrollTr = transactions.find((tr) => {
        const mobileScrollAction = tr.getMeta(mobileScrollPluginKey);
        return (
          mobileScrollAction &&
          (mobileScrollAction.type ===
            MobileScrollActionTypes.SET_KEYBOARD_HEIGHT ||
            mobileScrollAction.type ===
              MobileScrollActionTypes.SET_WINDOW_HEIGHT)
        );
      });
      if (scrollTr) {
        const { keyboardHeight, windowHeight } = getPluginState(oldState);
        const {
          keyboardHeight: newKeyboardHeight,
          heightDiff,
          windowHeight: newWindowHeight,
        } = getPluginState(newState);
        if (keyboardHeight !== newKeyboardHeight) {
          updateScrollValues.call(this, newKeyboardHeight, heightDiff);
        }

        // scroll selection into view if viewport is now smaller
        if (newWindowHeight < windowHeight) {
          return newState.tr.scrollIntoView();
        }
      }
    },

    view(editorView) {
      const handleResize = () => {
        let windowInnerHeight = window.innerHeight;
        let count = 0;

        const checkWindowHeight = () => {
          // wait for height to stabilise before we commit to set it
          // this helps handle menu transitions in Android which we don't want to scroll for
          if (window.innerHeight === windowInnerHeight) {
            count++;
            if (count >= 5) {
              rafId = undefined;
              setWindowHeight(window.innerHeight)(
                editorView.state,
                editorView.dispatch,
              );
            } else {
              rafId = requestAnimationFrame(checkWindowHeight);
            }
          }
        };
        rafId = requestAnimationFrame(checkWindowHeight);
      };
      // the window will resize on Android when the keyboard shows/hides
      window.addEventListener('resize', handleResize);

      return {
        destroy() {
          window.removeEventListener('resize', handleResize);
          if (rafId) {
            window.cancelAnimationFrame(rafId);
          }
        },
      };
    },
  });
};

/**
 * Update the scroll values on the plugin props
 * These are used by ProseMirror to determine when and how far it should scroll
 */
const updateScrollValues = function (
  this: PluginSpec,
  keyboardHeight: number,
  heightDiff: number,
) {
  if (keyboardHeight === -1 || heightDiff === -1) {
    return;
  }

  const { scrollThreshold, scrollMargin } = calculateScrollValues(
    keyboardHeight,
    heightDiff,
  );
  if (this.props) {
    this.props.scrollThreshold = scrollThreshold;
    this.props.scrollMargin = scrollMargin;
  }
};

const calculateScrollValues = (
  keyboardHeight: number,
  heightDiff: number,
): { scrollThreshold: ScrollValue; scrollMargin: ScrollValue } => ({
  scrollThreshold: {
    top: 0,
    bottom: keyboardHeight + MIN_TAP_SIZE_PX - heightDiff,
    left: 0,
    right: 0,
  },
  scrollMargin: {
    top: 5,
    bottom: keyboardHeight - heightDiff + MIN_TAP_SIZE_PX,
    left: 0,
    right: 0,
  },
});

const mobileScrollPlugin = (): EditorPlugin => ({
  name: 'mobileScroll',
  pmPlugins() {
    return [
      {
        name: 'mobileScroll',
        plugin: ({ dispatch }) => createPlugin(dispatch),
      },
    ];
  },
});

export default mobileScrollPlugin;
