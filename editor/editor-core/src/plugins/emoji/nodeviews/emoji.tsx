import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';
import Emoji from '../ui/Emoji';
import { ReactNodeView, getPosHandler } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { EmojiPluginOptions } from '../types';
import { EventDispatcher } from '../../../event-dispatcher';

export interface Props {
  providerFactory: ProviderFactory;
  options?: EmojiPluginOptions;
}

export class EmojiNodeView extends ReactNodeView<Props> {
  createDomRef() {
    return super.createDomRef();
  }

  render(props: Props) {
    const { providerFactory, options } = props;
    const { shortName, id, text } = this.node.attrs;

    return (
      <>
        <Emoji
          providers={providerFactory}
          id={id}
          shortName={shortName}
          fallback={text}
        />
        {options && options.allowZeroWidthSpaceAfter && ZERO_WIDTH_SPACE}
      </>
    );
  }
}

export default function emojiNodeView(
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  options?: EmojiPluginOptions,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new EmojiNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      providerFactory,
      options,
    }).init();
}
