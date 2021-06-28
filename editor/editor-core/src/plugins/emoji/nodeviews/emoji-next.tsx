import {
  DOMOutputSpec,
  DOMSerializer,
  Node as PMNode,
} from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory, ZERO_WIDTH_SPACE } from '@atlaskit/editor-common';
import type {
  EmojiDescription,
  EmojiProvider,
  EmojiRepresentation,
  ImageRepresentation,
  MediaApiRepresentation,
  SpriteRepresentation,
} from '@atlaskit/emoji';
import { EmojiPluginOptions } from '../types';
import { createMobileInlineDomRef } from '../../../ui/InlineNodeWrapper';

export interface Props {
  providerFactory: ProviderFactory;
  options?: EmojiPluginOptions;
}
export class EmojiNodeView implements NodeView {
  private node: PMNode;
  private options?: EmojiPluginOptions;
  private providers: ProviderFactory;
  private emojiProvider: Promise<EmojiProvider | undefined> | undefined;
  private hasProvider = false;
  private emoji: EmojiDescription | undefined;

  private el: HTMLElement;
  public dom: HTMLElement;

  constructor(node: PMNode, _: EditorView, context: Props) {
    this.node = node;
    this.providers = context.providerFactory;
    this.options = context.options;
    this.dom = EmojiNodeView.toDom(node);

    if (this.options?.useInlineWrapper) {
      const dom = createMobileInlineDomRef();
      dom.appendChild(this.dom);
      this.dom = dom;
    }

    this.el = this.options?.useInlineWrapper
      ? (this.dom.firstElementChild! as HTMLElement)
      : this.dom;

    this.providers.subscribe('emojiProvider', this.subscribe);

    if (this.options?.allowZeroWidthSpaceAfter) {
      this.el.after(document.createTextNode(ZERO_WIDTH_SPACE));
    }

    this.update(this.node, null);
  }

  private static toDomSpec(node: PMNode): DOMOutputSpec {
    return [
      'span',
      {
        'aria-label': node.attrs.shortName,
        'data-emoji-id': node.attrs.id,
        'data-emoji-shortname': node.attrs.shortName,
        class: 'editor-emoji',
      },
      node.attrs.shortName,
    ];
  }

  private static toDom(node: PMNode): HTMLElement {
    return DOMSerializer.renderSpec(document, EmojiNodeView.toDomSpec(node))
      .dom as HTMLElement;
  }

  private static isSprite(
    representation: EmojiRepresentation,
  ): representation is SpriteRepresentation {
    return representation?.hasOwnProperty('sprite') ?? false;
  }

  private static isImage(
    representation: EmojiRepresentation,
  ): representation is ImageRepresentation {
    return representation?.hasOwnProperty('imagePath') ?? false;
  }

  private static isMedia(
    representation: EmojiRepresentation,
  ): representation is MediaApiRepresentation {
    return representation?.hasOwnProperty('mediaPath') ?? false;
  }

  private subscribe = (
    _: unknown,
    provider?: Promise<EmojiProvider | undefined>,
  ) => {
    this.hasProvider = false;
    this.emojiProvider = provider;

    provider
      ?.then(() => (this.hasProvider = true))
      .then(() => this.findEmoji())
      .then((emoji) => this.update(this.node, null, emoji));
  };

  private async findEmoji(
    node = this.node,
  ): Promise<EmojiDescription | undefined> {
    const emojiProvider = await this.emojiProvider;
    if (emojiProvider) {
      return emojiProvider.findByEmojiId({
        id: node.attrs.id,
        shortName: node.attrs.shortName,
        fallback: node.attrs.text,
      });
    }
  }

  public destroy() {
    this.providers.unsubscribe('emojiProvider', this.subscribe);
  }

  public update(node: PMNode, _: unknown, emoji = this.emoji) {
    if (this.node.type !== node.type) {
      this.node = node;
      return false;
    }

    const prev = this.node.attrs;
    const next = node.attrs;
    let changed = false;

    if (prev.id !== next.id) {
      changed = true;
      this.el.dataset.emojiId = next.id;
    }

    if (prev.shortName !== next.shortName) {
      changed = true;
      this.el.dataset.emojiShortname = next.shortName;
    }

    if (changed) {
      this.emoji = undefined;
      this.node = node;
      this.findEmoji().then((emoji) => this.update(this.node, _, emoji));
      return true;
    }

    if (!this.hasProvider) {
      this.el.classList.add('editor-emoji-loading');
      this.el.style.backgroundSize = '';
      this.el.style.backgroundPosition = '';
      this.el.style.backgroundImage = '';
      this.node = node;
      this.emoji = emoji;
      return true;
    } else {
      this.el.classList.remove('editor-emoji-loading');
    }

    if (!emoji) {
      this.el.classList.add('editor-emoji-fallback');
      this.el.style.backgroundSize = '';
      this.el.style.backgroundPosition = '';
      this.el.style.backgroundImage = '';
      this.node = node;
      this.emoji = emoji;
      return true;
    } else {
      this.el.classList.remove('editor-emoji-fallback');
    }

    if (this.emoji === emoji) {
      return true;
    }

    const representation = emoji?.representation;

    if (EmojiNodeView.isSprite(representation)) {
      const { sprite, xIndex, yIndex } = representation;
      const { row, column, url } = sprite;

      const xPosition = (100 / (column - 1)) * (xIndex - 0);
      const yPosition = (100 / (row - 1)) * (yIndex - 0);

      this.el.style.backgroundSize = `${column * 100}% ${row * 100}%`;
      this.el.style.backgroundPosition = `${xPosition}% ${yPosition}%`;
      this.el.style.backgroundImage = `url(${url})`;
    }

    if (
      EmojiNodeView.isImage(representation) ||
      EmojiNodeView.isMedia(representation)
    ) {
      const path = EmojiNodeView.isImage(representation)
        ? representation.imagePath
        : representation.mediaPath;

      const { width: rawWidth, height: rawHeight } = representation;

      const width = rawWidth / (rawHeight / 20);
      this.el.style.width = `${width}px`;
      this.el.style.backgroundImage = `url(${path})`;
    }

    this.emoji = emoji;
    return true;
  }

  public ignoreMutation(_: unknown) {
    return true;
  }
}

export default function emojiNodeView(
  providerFactory: ProviderFactory,
  options?: EmojiPluginOptions,
) {
  return (node: PMNode, view: EditorView): NodeView =>
    new EmojiNodeView(node, view, {
      providerFactory,
      options,
    });
}
