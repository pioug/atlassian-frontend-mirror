import React from 'react';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { breakout } from '@atlaskit/adf-schema';
import { calcBreakoutWidth } from '@atlaskit/editor-common';
import { EditorPlugin, PMPluginFactoryParams } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { pluginKey as widthPluginKey, WidthPluginState } from '../width';
import LayoutButton from './ui/LayoutButton';
import { BreakoutCssClassName } from './constants';
import { EventDispatcher } from '../../';
import { pluginKey } from './plugin-key';
import { parsePx } from '../../utils/dom';
import { findSupportedNodeForBreakout } from './utils/find-breakout-node';
import { BreakoutPluginState } from './types';

class BreakoutView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  view: EditorView;
  node: PMNode;
  eventDispatcher: EventDispatcher;

  constructor(
    node: PMNode,
    view: EditorView,
    eventDispatcher: EventDispatcher,
  ) {
    const contentDOM = document.createElement('div');
    contentDOM.className = BreakoutCssClassName.BREAKOUT_MARK_DOM;

    const dom = document.createElement('div');
    dom.className = BreakoutCssClassName.BREAKOUT_MARK;
    dom.setAttribute('data-layout', node.attrs.mode);
    dom.appendChild(contentDOM);

    this.dom = dom;
    this.node = node;
    this.view = view;
    this.contentDOM = contentDOM;
    this.eventDispatcher = eventDispatcher;

    eventDispatcher.on((widthPluginKey as any).key, this.updateWidth);
    this.updateWidth(widthPluginKey.getState(this.view.state));
  }

  private updateWidth = (widthState: WidthPluginState) => {
    const width = calcBreakoutWidth(this.node.attrs.mode, widthState.width);
    let newStyle = `width: ${width}; `;

    const lineLength = widthState.lineLength;
    const widthPx = parsePx(width);

    if (lineLength && widthPx) {
      const marginLeftPx = -(widthPx - lineLength) / 2;
      newStyle += `transform: none; margin-left: ${marginLeftPx}px;`;
    } else {
      // fallback method
      // (lineLength is not normally undefined, but might be in e.g. SSR or initial render)
      //
      // this approach doesn't work well with position: fixed, so
      // it breaks things like sticky headers
      newStyle += `transform: translateX(-50%); margin-left: 50%;`;
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
      this.dom.style.cssText = newStyle;
    } else {
      this.dom.setAttribute('style', newStyle);
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
  return new Plugin({
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
        breakout: (node, view) => {
          return new BreakoutView(node, view, eventDispatcher);
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
          pluginState: pluginKey,
        }}
        render={({ pluginState }) => (
          <LayoutButton
            editorView={editorView}
            mountPoint={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            node={pluginState?.breakoutNode ?? null}
          />
        )}
      />
    );
  },
});

export default breakoutPlugin;
