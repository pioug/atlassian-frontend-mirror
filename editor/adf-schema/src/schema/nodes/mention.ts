import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { AnnotationMarkDefinition } from '../marks/annotation';
import { uuid } from '../../utils';
import { mention as mentionFactory } from '../../next-schema/generated/nodeTypes';

export enum USER_TYPES {
	DEFAULT = 'DEFAULT',
	SPECIAL = 'SPECIAL',
	APP = 'APP',
}

export type UserType = keyof typeof USER_TYPES;

export interface MentionAttributes {
	accessLevel?: string;
	id: string;
	localId?: string;
	text?: string;
	userType?: UserType;
}

/**
 * @name mention_node
 */
export interface MentionDefinition {
	attrs: MentionAttributes;
	/**
	 * @stage 0
	 */
	marks?: Array<AnnotationMarkDefinition>;
	type: 'mention';
}

export const mention = mentionFactory({
	parseDOM: [
		{
			tag: 'span[data-mention-id]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				const attrs: MentionAttributes = {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					id: dom.getAttribute('data-mention-id') || mention.attrs!.id.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: dom.textContent || mention.attrs!.text.default,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					accessLevel: dom.getAttribute('data-access-level') || mention.attrs!.accessLevel.default,
					localId: uuid.generate(),
				};

				const userType = dom.getAttribute('data-user-type') as USER_TYPES;
				if (USER_TYPES[userType]) {
					attrs.userType = userType;
				}

				return attrs;
			},
		},
	],
	toDOM(node) {
		const { id, accessLevel, text, userType, localId } = node.attrs;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const attrs: any = {
			'data-mention-id': id,
			'data-access-level': accessLevel,
			contenteditable: 'false',
		};
		if (localId) {
			attrs['data-local-id'] = localId;
		}
		if (userType) {
			attrs['data-user-type'] = userType;
		}
		return ['span', attrs, text];
	},
});

const isOptional = (key: string) => {
	return ['userType', 'localId'].indexOf(key) > -1;
};

export const toJSON = (node: PMNode) => ({
	attrs: Object.keys(node.attrs).reduce<typeof node.attrs>((obj, key) => {
		if (isOptional(key) && !node.attrs[key]) {
			return obj;
		}
		return {
			...obj,
			[key]: node.attrs[key],
		};
	}, {}),
});
