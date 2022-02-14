import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';
import Mention from '../ui/Mention';
import { ReactNodeView, getPosHandler } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { MentionPluginOptions } from '../types';
import { EventDispatcher } from '../../../event-dispatcher';

export interface Props {
  providerFactory: ProviderFactory;
  options?: MentionPluginOptions;
}

export class MentionNodeView extends ReactNodeView<Props> {
  createDomRef() {
    return super.createDomRef();
  }

  render(props: Props) {
    const { providerFactory, options } = props;
    const { id, text, accessLevel } = this.node.attrs;

    return (
      <>
        <Mention
          id={id}
          text={text}
          accessLevel={accessLevel}
          providers={providerFactory}
        />
        {options && options.allowZeroWidthSpaceAfter && ZERO_WIDTH_SPACE}
      </>
    );
  }
}

export default function mentionNodeView(
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  options?: MentionPluginOptions,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
    const hasIntlContext = true;
    return new MentionNodeView(
      node,
      view,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      {
        providerFactory,
        options,
      },
      undefined,
      undefined,
      undefined,
      hasIntlContext,
    ).init();
  };
}
