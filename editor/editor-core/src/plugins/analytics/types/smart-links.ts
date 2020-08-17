import { ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import { InsertAEP } from './utils';

export type SmartLinkNodeContext =
  | 'doc'
  | 'blockquote'
  | 'tableCell'
  | 'tableHeader'
  | 'decisionList'
  | 'listItem'
  | 'bodiedExtension'
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
      | INPUT_METHOD.FORMATTING;
    nodeType: 'inlineCard' | 'blockCard' | 'embedCard';
    nodeContext: SmartLinkNodeContext;
    domainName: string;
    fromCurrentDomain: boolean;
  },
  undefined
>;
