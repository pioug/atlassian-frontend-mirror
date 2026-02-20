import type { MediaDefinition as Media } from './media';
import { mediaGroup as mediaGroupFactory } from '../../next-schema/generated/nodeTypes';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name mediaGroup_node
 */
export interface MediaGroupDefinition {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 *  @allowUnsupportedBlock true
	 */
	content: Array<Media>;
	type: 'mediaGroup';
}

// Temporary due to an existing issue in validator below:
// https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-1429
// TODO: ED-29537 - Remove border and link marks from white list
export const mediaGroup: NodeSpec = mediaGroupFactory({
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
