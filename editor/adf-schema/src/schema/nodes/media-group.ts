import type { MediaDefinition as Media } from './media';
import { mediaGroup as mediaGroupFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name mediaGroup_node
 */
export interface MediaGroupDefinition {
	/**
	 * @minItems 1
	 *  @allowUnsupportedBlock true
	 */
	content: Array<Media>;
	type: 'mediaGroup';
}

// Temporary due to an existing issue in validator below:
// https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-1429
// TODO: ED-29537 - Remove border and link marks from white list
export const mediaGroup = mediaGroupFactory({
	parseDOM: [
		{
			tag: 'div[data-node-type="mediaGroup"]',
		},
		{
			tag: 'div[class="MediaGroup"]',
		},
	],

	toDOM() {
		return [
			'div',
			{
				'data-node-type': 'mediaGroup',
			},
			0,
		];
	},
});
