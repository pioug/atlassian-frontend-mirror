import type { ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { InsertAEP } from './utils';

export type SmartLinkNodeContext =
	| 'doc'
	| 'blockquote'
	| 'tableCell'
	| 'tableHeader'
	| 'decisionList'
	| 'listItem'
	| 'bodiedExtension'
	| 'multiBodiedExtension'
	| 'panel'
	| 'taskList'
	| 'mixed';

export const SmartLinkNodeContexts: { [P in SmartLinkNodeContext]: P } = {
	doc: 'doc',
	blockquote: 'blockquote',
	tableCell: 'tableCell',
	tableHeader: 'tableHeader',
	decisionList: 'decisionList',
	taskList: 'taskList',
	bodiedExtension: 'bodiedExtension',
	multiBodiedExtension: 'multiBodiedExtension',
	listItem: 'listItem',
	panel: 'panel',
	mixed: 'mixed',
};

export type InsertSmartLinkAEP = InsertAEP<
	ACTION_SUBJECT_ID.SMART_LINK,
	{
		inputMethod:
			| INPUT_METHOD.CLIPBOARD
			| INPUT_METHOD.AUTO_DETECT
			| INPUT_METHOD.TYPEAHEAD
			| INPUT_METHOD.MANUAL
			| INPUT_METHOD.FORMATTING
			| INPUT_METHOD.FLOATING_TB;
		nodeType: 'inlineCard' | 'blockCard' | 'embedCard';
		nodeContext: SmartLinkNodeContext;
		fromCurrentDomain: boolean;
	},
	{
		domainName: string;
	}
>;
