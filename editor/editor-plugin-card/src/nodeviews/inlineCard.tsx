import type { EventHandler, KeyboardEvent, MouseEvent } from 'react';
import React from 'react';

import PropTypes from 'prop-types';
import rafSchedule from 'raf-schd';

import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import {
  findOverflowScrollParent,
  UnsupportedInline,
} from '@atlaskit/editor-common/ui';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Card as SmartCard } from '@atlaskit/smart-card';

import { registerCard } from '../pm-plugins/actions';
import {
  isBlockSupportedAtPosition,
  isEmbedSupportedAtPosition,
} from '../utils';

import type { SmartCardProps } from './genericCard';
import { Card } from './genericCard';
import { InlineCardWithAwareness } from './inlineCardWithAwareness';

// eslint-disable-next-line @repo/internal/react/no-class-components
export class InlineCardComponent extends React.PureComponent<SmartCardProps> {
  private scrollContainer?: HTMLElement;
  private onClick: EventHandler<MouseEvent | KeyboardEvent> = () => {};

  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    const { view } = this.props;
    const scrollContainer = findOverflowScrollParent(view.dom as HTMLElement);
    this.scrollContainer = scrollContainer || undefined;
  }

  onResolve = (data: { url?: string; title?: string }) => {
    const { getPos, view } = this.props;
    if (!getPos || typeof getPos === 'boolean') {
      return;
    }

    const { title, url } = data;
    // don't dispatch immediately since we might be in the middle of
    // rendering a nodeview
    rafSchedule(() => {
      // prosemirror-bump-fix
      const pos = getPos();

      if (typeof pos !== 'number') {
        return;
      }

      const tr = view.state.tr;
      registerCard({
        title,
        url,
        pos,
      })(tr);
      view.dispatch(tr);
    })();
  };

  onError = (data: { url?: string; err?: Error }) => {
    const { url, err } = data;
    if (err) {
      throw err;
    }
    this.onResolve({ url });
  };

  render() {
    const {
      node,
      cardContext,
      actionOptions,
      showServerActions,
      useAlternativePreloader,
    } = this.props;

    const { url, data } = node.attrs;
    const card = (
      <span className="card">
        <SmartCard
          key={url}
          url={url}
          data={data}
          appearance="inline"
          onClick={this.onClick}
          container={this.scrollContainer}
          onResolve={this.onResolve}
          onError={this.onError}
          inlinePreloaderStyle={
            useAlternativePreloader ? 'on-right-without-skeleton' : undefined
          }
          actionOptions={actionOptions}
          showServerActions={showServerActions}
        />
      </span>
    );
    // [WS-2307]: we only render card wrapped into a Provider when the value is ready,
    // otherwise if we got data, we can render the card directly since it doesn't need the Provider
    return cardContext && cardContext.value ? (
      <cardContext.Provider value={cardContext.value}>
        {card}
      </cardContext.Provider>
    ) : data ? (
      card
    ) : null;
  }
}

const WrappedInlineCard = Card(InlineCardComponent, UnsupportedInline);
const WrappedInlineCardWithAwareness = Card(
  InlineCardWithAwareness,
  UnsupportedInline,
);

export type InlineCardNodeViewProps = Pick<
  SmartCardProps,
  | 'useAlternativePreloader'
  | 'actionOptions'
  | 'showServerActions'
  | 'allowEmbeds'
  | 'allowBlockCards'
  | 'enableInlineUpgradeFeatures'
  | 'pluginInjectionApi'
>;

type InlineCardWithAwarenessProps = {
  allowEmbeds?: boolean;
  allowBlockCards?: boolean;
  enableInlineUpgradeFeatures: boolean;
};

export function InlineCardNodeView(
  props: InlineNodeViewComponentProps &
    InlineCardNodeViewProps &
    InlineCardWithAwarenessProps,
) {
  const {
    useAlternativePreloader,
    node,
    view,
    getPos,
    actionOptions,
    showServerActions,
    allowEmbeds,
    allowBlockCards,
    enableInlineUpgradeFeatures,
    pluginInjectionApi,
  } = props;

  if (!getBooleanFF('platform.linking-platform.smart-card.inline-switcher')) {
    return (
      <WrappedInlineCard
        node={node}
        view={view}
        getPos={getPos}
        actionOptions={actionOptions}
        showServerActions={showServerActions}
        useAlternativePreloader={useAlternativePreloader}
      />
    );
  }

  return (
    <WrappedInlineCardWithAwareness
      node={node}
      view={view}
      getPos={getPos}
      actionOptions={actionOptions}
      showServerActions={showServerActions}
      useAlternativePreloader={useAlternativePreloader}
      pluginInjectionApi={pluginInjectionApi}
      {...(enableInlineUpgradeFeatures &&
        getAwarenessProps(view.state, getPos, allowEmbeds, allowBlockCards))}
    />
  );
}

const getAwarenessProps = (
  editorState: EditorState,
  getPos: () => number | undefined,
  allowEmbeds?: boolean,
  allowBlockCards?: boolean,
) => {
  const linkPosition =
    getPos && typeof getPos() === 'number' ? getPos() : undefined;

  const canBeUpgradedToEmbed =
    !!linkPosition && allowEmbeds
      ? isEmbedSupportedAtPosition(linkPosition, editorState, 'inline')
      : false;

  const canBeUpgradedToBlock =
    !!linkPosition && allowBlockCards
      ? isBlockSupportedAtPosition(linkPosition, editorState, 'inline')
      : false;

  const isSelected =
    editorState.selection instanceof NodeSelection &&
    editorState.selection?.node?.type === editorState.schema.nodes.inlineCard &&
    editorState.selection?.from === getPos();

  return {
    isPulseEnabled: canBeUpgradedToEmbed,
    isOverlayEnabled: canBeUpgradedToEmbed || canBeUpgradedToBlock,
    isSelected,
  };
};
