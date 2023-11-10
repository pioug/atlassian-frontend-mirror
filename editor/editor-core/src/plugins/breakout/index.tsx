import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  Node as PMNode,
  Mark as PMMark,
} from '@atlaskit/editor-prosemirror/model';
import type { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import { breakout } from '@atlaskit/adf-schema';
import { calcBreakoutWidthPx } from '@atlaskit/editor-common/utils';
import type {
  NextEditorPlugin,
  ExtractInjectionAPI,
  PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type {
  WidthPluginState,
  WidthPlugin,
} from '@atlaskit/editor-plugin-width';
import type { Props as LayoutButtonProps } from './ui/LayoutButton';
import LayoutButton from './ui/LayoutButton';
import { pluginKey } from './plugin-key';
import { findSupportedNodeForBreakout } from './utils/find-breakout-node';
import type { BreakoutPluginState } from './types';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

type BreakoutPMMark = Omit<PMMark, 'attrs'> & { attrs: BreakoutMarkAttrs };

class BreakoutView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  view: EditorView;
  mark: BreakoutPMMark;
  unsubscribe: (() => void) | undefined;

  constructor(
    /**
     * Note: this is actually a PMMark -- however our version
     * of the prosemirror and prosemirror types mean using PMNode
     * is not problematic.
     */
    mark: PMNode,
    view: EditorView,
    pluginInjectionApi: ExtractInjectionAPI<typeof breakoutPlugin> | undefined,
  ) {
    const contentDOM = document.createElement('div');
    contentDOM.className = BreakoutCssClassName.BREAKOUT_MARK_DOM;

    const dom = document.createElement('div');
    dom.className = BreakoutCssClassName.BREAKOUT_MARK;
    dom.setAttribute('data-layout', mark.attrs.mode);
    dom.appendChild(contentDOM);

    this.dom = dom;
    this.mark = mark as any as BreakoutPMMark;
    this.view = view;
    this.contentDOM = contentDOM;
    this.unsubscribe = pluginInjectionApi?.width.sharedState.onChange(
      ({ nextSharedState }) => this.updateWidth(nextSharedState),
    );
    this.updateWidth(pluginInjectionApi?.width.sharedState.currentState());
  }

  private updateWidth = (widthState: WidthPluginState | undefined) => {
    // we skip updating the width of breakout nodes if the editorView dom
    // element was hidden (to avoid breakout width and button thrashing
    // when an editor is hidden, re-rendered and unhidden).
    if (widthState === undefined || widthState.width === 0) {
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
    this.unsubscribe?.();
  }
}

function shouldPluginStateUpdate(
  newBreakoutNode?: ContentNodeWithPos,
  currentBreakoutNode?: ContentNodeWithPos,
): boolean {
  if (newBreakoutNode && currentBreakoutNode) {
    return newBreakoutNode !== currentBreakoutNode;
  }
  return newBreakoutNode || currentBreakoutNode ? true : false;
}

function createPlugin(
  pluginInjectionApi: ExtractInjectionAPI<typeof breakoutPlugin> | undefined,
  { dispatch }: PMPluginFactoryParams,
) {
  return new SafePlugin({
    state: {
      init() {
        return {
          breakoutNode: undefined,
        };
      },
      apply(tr, pluginState: BreakoutPluginState) {
        const breakoutNode = findSupportedNodeForBreakout(tr.selection);

        if (shouldPluginStateUpdate(breakoutNode, pluginState.breakoutNode)) {
          const nextPluginState = {
            ...pluginState,
            breakoutNode,
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
          return new BreakoutView(mark, view, pluginInjectionApi);
        },
      },
    },
  });
}

interface LayoutButtonWrapperProps extends Omit<LayoutButtonProps, 'node'> {
  api: ExtractInjectionAPI<typeof breakoutPlugin> | undefined;
}

const LayoutButtonWrapper = ({
  api,
  editorView,
  boundariesElement,
  scrollableElement,
  mountPoint,
}: LayoutButtonWrapperProps) => {
  // Re-render with `width` (but don't use state) due to https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/24272
  const { breakoutState } = useSharedPluginState(api, ['width', 'breakout']);

  return (
    <LayoutButton
      editorView={editorView}
      mountPoint={mountPoint}
      boundariesElement={boundariesElement}
      scrollableElement={scrollableElement}
      node={breakoutState?.breakoutNode?.node ?? null}
    />
  );
};

interface BreakoutPluginOptions {
  allowBreakoutButton?: boolean;
}

const breakoutPlugin: NextEditorPlugin<
  'breakout',
  {
    pluginConfiguration: BreakoutPluginOptions | undefined;
    dependencies: [WidthPlugin];
    sharedState: Partial<BreakoutPluginState>;
  }
> = ({ config: options, api }) => ({
  name: 'breakout',

  pmPlugins() {
    return [
      {
        name: 'breakout',
        plugin: (props) => createPlugin(api, props),
      },
    ];
  },
  marks() {
    return [{ name: 'breakout', mark: breakout }];
  },

  getSharedState(editorState) {
    if (!editorState) {
      return {
        breakoutNode: undefined,
      };
    }

    const pluginState = pluginKey.getState(editorState);

    if (!pluginState) {
      return {
        breakoutNode: undefined,
      };
    }

    return pluginState;
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
      <LayoutButtonWrapper
        api={api}
        mountPoint={popupsMountPoint}
        editorView={editorView}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
      />
    );
  },
});

export default breakoutPlugin;
