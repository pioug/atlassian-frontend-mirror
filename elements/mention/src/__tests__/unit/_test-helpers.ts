import { MentionResource } from '../../api/MentionResource';
import { type MentionDescription } from '../../types';
/* Component structure:
  ak-mention-picker
   > ak-popup (optional)
     > ak-resourced-mention-list
       > ak-mention-list
         > ak-scrollable
           > ak-mention-item (0..n)
 */

export const mockMentionData = {
	id: 'ABCD-ABCD-ABCD',
	text: '@Oscar Wallhult',
};

export const mentionResource = (): MentionResource =>
	new MentionResource({
		url: 'dummyurl',

		shouldHighlightMention(mention) {
			return mention.id === 'oscar';
		},
	});
export const mockMentionProvider = (): Promise<MentionResource> =>
	Promise.resolve(mentionResource());

export function checkOrder(expected: MentionDescription[][], actual: MentionDescription[][]): void {
	expect(actual).toHaveLength(expected.length);

	for (let i = 0; i < expected.length; i++) {
		expect(actual[i]).toHaveLength(expected[i].length);

		if (expected[i].length) {
			for (let j = 0; j < expected[i].length; j++) {
				expect(actual[i][j].id).toEqual(expected[i][j].id);
			}
		}
	}
}

// eslint-disable-next-line @atlaskit/platform/no-set-immediate
export const flushPromises = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));
