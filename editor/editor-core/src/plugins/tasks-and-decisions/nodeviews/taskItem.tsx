import React from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
  Decoration,
  EditorView,
  NodeView,
} from '@atlaskit/editor-prosemirror/view';

import type {
  AnalyticsEventPayload,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';

import ReactNodeView from '@atlaskit/editor-common/react-node-view';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';

import { useShowPlaceholder } from './hooks/use-show-placeholder';
import TaskItem from '../ui/Task';
import type { TaskAndDecisionsPlugin } from '../types';

type ForwardRef = (node: HTMLElement | null) => void;
type getPosHandler = getPosHandlerNode | boolean;
type getPosHandlerNode = () => number | undefined;
export interface Props {
  providerFactory: ProviderFactory;
}

type TaskItemWrapperProps = {
  localId: string;
  forwardRef: ForwardRef;
  isContentNodeEmpty: boolean;
  providerFactory: ProviderFactory;
  isDone: boolean;
  api: ExtractInjectionAPI<TaskAndDecisionsPlugin> | undefined;
  getPos: () => number | undefined;
  onChange: (taskId: string, isChecked: boolean) => false | undefined;
  editorView: EditorView;
};
const TaskItemWrapper = ({
  localId,
  forwardRef,
  isDone,
  onChange,
  providerFactory,
  isContentNodeEmpty,
  api,
  getPos,
  editorView,
}: TaskItemWrapperProps) => {
  const { taskDecisionState } = useSharedPluginState(api, ['taskDecision']);
  const isFocused = Boolean(
    taskDecisionState?.focusedTaskItemLocalId === localId,
  );

  const showPlaceholder = useShowPlaceholder({
    editorView,
    isContentNodeEmpty,
    getPos,
    api,
  });

  return (
    <TaskItem
      taskId={localId}
      contentRef={forwardRef}
      isDone={isDone}
      onChange={onChange}
      isFocused={isFocused}
      showPlaceholder={showPlaceholder}
      providers={providerFactory}
    />
  );
};

class Task extends ReactNodeView<Props> {
  private api: ExtractInjectionAPI<TaskAndDecisionsPlugin> | undefined;

  initWithAPI(api: ExtractInjectionAPI<TaskAndDecisionsPlugin> | undefined) {
    this.api = api;
    this.init();
    return this;
  }

  private isContentEmpty(node: PMNode) {
    return node.content.childCount === 0;
  }

  private handleOnChange = (taskId: string, isChecked: boolean) => {
    const { tr } = this.view.state;
    const nodePos = (this.getPos as getPosHandlerNode)();

    if (typeof nodePos !== 'number') {
      return false;
    }

    // SetAttrsStep should be used to prevent task updates from being dropped when mapping task ticks
    // from a previous version of the document, such as a published page.
    tr.step(
      new SetAttrsStep(nodePos, {
        state: isChecked ? 'DONE' : 'TODO',
        localId: taskId,
      }),
    );
    tr.setMeta('scrollIntoView', false);

    this.view.dispatch(tr);
  };

  /**
   * Dynamically generates analytics data relating to the parent list.
   *
   * Required to be dynamic, as list (in prosemirror model) may have
   * changed (e.g. item movements, or additional items in list).
   * This node view will have not rerendered for those changes, so
   * cannot render the position and listSize into the
   * AnalyticsContext at initial render time.
   */
  private addListAnalyticsData = (event: UIAnalyticsEvent) => {
    try {
      const nodePos = (this.getPos as getPosHandlerNode)();
      if (typeof nodePos !== 'number') {
        return false;
      }

      const resolvedPos = this.view.state.doc.resolve(nodePos);
      const position = resolvedPos.index();
      const listSize = resolvedPos.parent.childCount;
      const listLocalId = resolvedPos.parent.attrs.localId;

      event.update((payload: AnalyticsEventPayload) => {
        const { attributes = {}, actionSubject } = payload;
        if (actionSubject !== 'action') {
          // Not action related, ignore
          return payload;
        }
        return {
          ...payload,
          attributes: {
            ...attributes,
            position,
            listSize,
            listLocalId,
          },
        };
      });
    } catch (e) {
      // This can occur if pos is NaN (seen it in some test cases)
      // Act defensively here, and lose some analytics data rather than
      // cause any user facing error.
    }
  };

  createDomRef() {
    const domRef = document.createElement('div');
    domRef.style['list-style-type' as any] = 'none';
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    // setting a className prevents PM/Chrome mutation observer from
    // incorrectly deleting nodes
    dom.className = 'task-item';
    return { dom };
  }

  render(props: Props, forwardRef: ForwardRef) {
    const { localId, state } = this.node.attrs;
    const isContentNodeEmpty = this.isContentEmpty(this.node);
    return (
      <AnalyticsListener
        channel="fabric-elements"
        onEvent={this.addListAnalyticsData}
      >
        <TaskItemWrapper
          localId={localId}
          forwardRef={forwardRef}
          isDone={state === 'DONE'}
          onChange={this.handleOnChange}
          isContentNodeEmpty={isContentNodeEmpty}
          providerFactory={props.providerFactory}
          // The getPosHandler type is wrong, there is no `boolean` in the real implementation
          // @ts-expect-error 2322: Type 'getPosHandler' is not assignable to type '() => number | undefined'.
          getPos={this.getPos}
          editorView={this.view}
          api={this.api}
        />
      </AnalyticsListener>
    );
  }

  viewShouldUpdate(nextNode: PMNode) {
    /**
     * To ensure the placeholder is correctly toggled we need to allow react to re-render
     * on first character insertion.
     * Note: last character deletion is handled externally and automatically re-renders.
     */
    return this.isContentEmpty(this.node) && !!nextNode.content.childCount;
  }

  update(node: PMNode, decorations: readonly Decoration[]) {
    return super.update(
      node,
      decorations,
      undefined,
      (currentNode: PMNode, newNode: PMNode) =>
        // Toggle the placeholder based on whether user input exists
        !this.isContentEmpty(newNode) &&
        !!(currentNode.attrs.state === newNode.attrs.state),
    );
  }
}

export function taskItemNodeViewFactory(
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  api: ExtractInjectionAPI<TaskAndDecisionsPlugin> | undefined,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
    const hasIntlContext = true;
    return new Task(
      node,
      view,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      {
        providerFactory,
      },
      undefined,
      undefined,
      undefined,
      hasIntlContext,
    ).initWithAPI(api);
  };
}
