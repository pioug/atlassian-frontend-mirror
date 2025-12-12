import { acNameToEmoji, acShortcutToEmoji } from '../../utils/confluence/emoji';
import type { AnnotationMarkDefinition } from '../marks/annotation';
import { emoji as emojiFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';

/**
 * @name emoji_node
 */
export interface EmojiDefinition {
	attrs: EmojiAttributes;
	/**
	 * @stage 0
	 */
	marks?: Array<AnnotationMarkDefinition>;
	type: 'emoji';
}

export interface EmojiAttributes {
	id?: string; // Optional to support legacy formats
	localId?: string;
	shortName: string;
	text?: string;
}

export const emoji = emojiFactory({
	parseDOM: [
		// Handle copy/paste beautiful panel from renderer />
		{
			tag: 'div.ak-editor-panel__icon span',
			ignore: true,
		},
		{
			tag: 'span[data-emoji-short-name]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					shortName: dom.getAttribute('data-emoji-short-name') || emoji.attrs!.shortName.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					id: dom.getAttribute('data-emoji-id') || emoji.attrs!.id.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: dom.getAttribute('data-emoji-text') || emoji.attrs!.text.default,
				};
			},
		},
		// Handle copy/paste from old <ac:emoticon />
		{
			tag: 'img[data-emoticon-name]',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			getAttrs: (dom) => acNameToEmoji((dom as Element).getAttribute('data-emoticon-name') as any),
		},
		// Handle copy/paste from old <ac:hipchat-emoticons />
		{
			tag: 'img[data-hipchat-emoticon]',
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			getAttrs: (dom) => acShortcutToEmoji((dom as Element).getAttribute('data-hipchat-emoticon')!),
		},
		// Handle copy/paste from bitbucket's <img class="emoji" />
		{
			tag: 'img.emoji[data-emoji-short-name]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					shortName: dom.getAttribute('data-emoji-short-name') || emoji.attrs!.shortName.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					id: dom.getAttribute('data-emoji-id') || emoji.attrs!.id.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: dom.getAttribute('data-emoji-text') || emoji.attrs!.text.default,
				};
			},
		},
	],
	toDOM(node) {
		const { shortName, id, text } = node.attrs;
		const attrs = {
			'data-emoji-short-name': shortName,
			'data-emoji-id': id,
			'data-emoji-text': text,
			contenteditable: 'false',
		};
		return ['span', attrs, text];
	},
});

export const emojiWithLocalId = emojiFactory({
	parseDOM: [
		// Handle copy/paste beautiful panel from renderer />
		{
			tag: 'div.ak-editor-panel__icon span',
			ignore: true,
		},
		{
			tag: 'span[data-emoji-short-name]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					shortName: dom.getAttribute('data-emoji-short-name') || emoji.attrs!.shortName.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					id: dom.getAttribute('data-emoji-id') || emoji.attrs!.id.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: dom.getAttribute('data-emoji-text') || emoji.attrs!.text.default,
					localId: uuid.generate(),
				};
			},
		},
		// Handle copy/paste from old <ac:emoticon />
		{
			tag: 'img[data-emoticon-name]',
			getAttrs: (dom) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const attrs = acNameToEmoji((dom as Element).getAttribute('data-emoticon-name') as any);
				return {
					...attrs,
					localId: uuid.generate(),
				};
			},
		},
		// Handle copy/paste from old <ac:hipchat-emoticons />
		{
			tag: 'img[data-hipchat-emoticon]',
			getAttrs: (dom) => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const attrs = acShortcutToEmoji((dom as Element).getAttribute('data-hipchat-emoticon')!);
				return {
					...attrs,
					localId: uuid.generate(),
				};
			},
		},
		// Handle copy/paste from bitbucket's <img class="emoji" />
		{
			tag: 'img.emoji[data-emoji-short-name]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					shortName: dom.getAttribute('data-emoji-short-name') || emoji.attrs!.shortName.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					id: dom.getAttribute('data-emoji-id') || emoji.attrs!.id.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: dom.getAttribute('data-emoji-text') || emoji.attrs!.text.default,
					localId: uuid.generate(),
				};
			},
		},
	],
	toDOM(node) {
		const { shortName, id, text } = node.attrs;
		const attrs = {
			'data-emoji-short-name': shortName,
			'data-emoji-id': id,
			'data-emoji-text': text,
			contenteditable: 'false',
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['span', attrs, text];
	},
});
