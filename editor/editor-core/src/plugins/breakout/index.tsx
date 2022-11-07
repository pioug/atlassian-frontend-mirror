import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode, Mark as PMMark } from 'prosemirror-model';
import { breakout, BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import { calcBreakoutWidthPx } from '@atlaskit/editor-common/utils';
import { EditorPlugin, PMPluginFactoryParams } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { pluginKey as widthPluginKey, WidthPluginState } from '../width';
import LayoutButton from './ui/LayoutButton';
import { BreakoutCssClassName } from './constants';
import { EventDispatcher } from '../../';
import { pluginKey } from './plugin-key';
import { findSupportedNodeForBreakout } from './utils/find-breakout-node';
import { BreakoutPluginState } from './types';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';

type BreakoutPMMark = Omit<PMMark, 'attrs'> & { attrs: BreakoutMarkAttrs };

class BreakoutView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  view: EditorView;
  mark: BreakoutPMMark;
  eventDispatcher: EventDispatcher;

  constructor(
    /**
     * Note: this is actually a PMMark -- however our version
     * of the prosemirror and prosemirror types mean using PMNode
     * is not problematic.
     */
    mark: PMNode,
    view: EditorView,
    eventDispatcher: EventDispatcher,
  ) {
    const contentDOM = document.createElement('div');
    contentDOM.className = BreakoutCssClassName.BREAKOUT_MARK_DOM;

    const dom = document.createElement('div');
    dom.className = BreakoutCssClassName.BREAKOUT_MARK;
    dom.setAttribute('data-layout', mark.attrs.mode);
    dom.appendChild(contentDOM);

    this.dom = dom;
    this.mark = (mark as any) as BreakoutPMMark;
    this.view = view;
    this.contentDOM = contentDOM;
    this.eventDispatcher = eventDispatcher;

    eventDispatcher.on((widthPluginKey as any).key, this.updateWidth);
    this.updateWidth(widthPluginKey.getState(this.view.state));
  }

  private updateWidth = (widthState: WidthPluginState) => {
    // we skip updating the width of breakout nodes if the editorView dom
    // element was hidden (to avoid breakout width and button thrashing
    // when an editor is hidden, re-rendered and unhidden).
    if (widthState.width === 0) {
      return;
    }

    let containerStyle = ``;
    let contentStyle = ``;
    let breakoutWidthPx = calcBreakoutWidthPx(
      this.mark.attrs.mode,
      widthState.width,
    );

    if (widthState.lineLength) {
      if (breakoutWidthPx < widthState.lineLength) {
        breakoutWidthPx = widthState.lineLength;
      }
      containerStyle += `
        transform: none;
        display: flex;
        justify-content: center;
        `;

      // There is a delay in the animation because widthState is delayed.
      // When the editor goes full width the animation for the editor
      // begins and finishes before widthState can update the new dimensions.
      contentStyle += `
        min-width: ${breakoutWidthPx}px;
        transition: min-width 0.5s ${akEditorSwoopCubicBezier};
      `;
    } else {
      // fallback method
      // (lineLength is not normally undefined, but might be in e.g. SSR or initial render)
      //
      // this approach doesn't work well with position: fixed, so
      // it breaks things like sticky headers
      containerStyle += `width: ${breakoutWidthPx}px; transform: translateX(-50%); margin-left: 50%;`;
    }

    // NOTE: This is a hack to ignore mutation since mark NodeView doesn't support
    // `ignoreMutation` life-cycle event. @see ED-9947
    const viewDomObserver = (this.view as any).domObserver;
    if (viewDomObserver && this.view.dom) {
      viewDomObserver.stop();
      setTimeout(() => {
        viewDomObserver.start();
      }, 0);
    }

    if (typeof this.dom.style.cssText !== 'undefined') {
      this.dom.style.cssText = containerStyle;
      this.contentDOM.style.cssText = contentStyle;
    } else {
      this.dom.setAttribute('style', containerStyle);
      this.contentDOM.setAttribute('style', contentStyle);
    }
  };

  // NOTE: Lifecycle events doesn't work for mark NodeView. So currently this is a no-op.
  // @see https://github.com/ProseMirror/prosemirror/issues/1082
  destroy() {
    this.eventDispatcher.off((widthPluginKey as any).key, this.updateWidth);
  }
}

function shouldPluginStateUpdate(
  newBreakoutNode: PMNode<any> | null,
  currentBreakoutNode: PMNode<any> | null,
): boolean {
  if (newBreakoutNode && currentBreakoutNode) {
    return !newBreakoutNode.eq(currentBreakoutNode);
  }
  return newBreakoutNode || currentBreakoutNode ? true : false;
}

function createPlugin({ dispatch, eventDispatcher }: PMPluginFactoryParams) {
  return new SafePlugin({
    state: {
      init() {
        return {
          breakoutNode: null,
        };
      },
      apply(tr, pluginState: BreakoutPluginState) {
        const breakoutNode = findSupportedNodeForBreakout(tr.selection);
        const node = breakoutNode ? breakoutNode.node : null;

        if (shouldPluginStateUpdate(node, pluginState.breakoutNode)) {
          const nextPluginState = {
            ...pluginState,
            breakoutNode: node,
          };
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }
        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        // Note: When we upgrade to prosemirror 1.27.2 -- we should
        // move this to markViews.
        // See the following link for more details:
        // https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews.
        breakout: (mark, view) => {
          return new BreakoutView(mark, view, eventDispatcher);
        },
      },
    },
  });
}

interface BreakoutPluginOptions {
  allowBreakoutButton?: boolean;
}

const breakoutPlugin = (options?: BreakoutPluginOptions): EditorPlugin => ({
  name: 'breakout',

  pmPlugins() {
    return [
      {
        name: 'breakout',
        plugin: createPlugin,
      },
    ];
  },
  marks() {
    return [{ name: 'breakout', mark: breakout }];
  },

  contentComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
  }) {
    // This is a bit crappy, but should be resolved once we move to a static schema.
    if (options && !options.allowBreakoutButton) {
      return null;
    }

    return (
      <WithPluginState
        plugins={{
          breakoutPluginState: pluginKey,
          widthPluginState: widthPluginKey,
        }}
        render={({ breakoutPluginState }) => (
          <LayoutButton
            editorView={editorView}
            mountPoint={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            node={breakoutPluginState?.breakoutNode ?? null}
          />
        )}
      />
    );
  },
});

export default breakoutPlugin;
