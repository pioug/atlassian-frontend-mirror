import { NodeSerializer } from './interfaces';

import blockquote from './nodes/blockquote';
import blockCard from './nodes/block-card';
import bulletList from './nodes/bullet-list';
import codeBlock from './nodes/code-block';
import decisionItem from './nodes/decision-item';
import decisionList from './nodes/decision-list';
import emoji from './nodes/emoji';
import hardBreak from './nodes/hard-break';
import heading from './nodes/heading';
import inlineCard from './nodes/inline-card';
import listItem from './nodes/list-item';
import mention from './nodes/mention';
import media from './nodes/media';
import mediaGroup from './nodes/media-group';
import mediaSingle from './nodes/media-single';
import orderedList from './nodes/ordered-list';
import panel from './nodes/panel';
import paragraph from './nodes/paragraph';
import rule from './nodes/rule';
import table from './nodes/table';
import tableCell from './nodes/table-cell';
import tableHeader from './nodes/table-header';
import tableRow from './nodes/table-row';
import taskList from './nodes/task-list';
import taskItem from './nodes/task-item';
import text from './nodes/text';
import unknownBlock from './nodes/unknown-block';
import status from './nodes/status';
import layoutColumn from './nodes/layoutColumn';
import layoutSection from './nodes/layoutSection';
import bodiedExtension from './nodes/bodiedExtension';
import inlineExtension from './nodes/inlineExtension';
import date from './nodes/date';
import expand from './nodes/expand';

const renderNothing = (): string => '';

export const nodeSerializers: { [key: string]: NodeSerializer } = {
  bodiedExtension: bodiedExtension,
  blockquote,
  blockCard,
  bulletList,
  codeBlock,
  decisionList,
  decisionItem,
  emoji,
  extension: bodiedExtension, // Old node, treated as bodied ext. for backwards compatibility
  image: renderNothing,
  inlineCard,
  embedCard: inlineCard,
  layoutColumn,
  layoutSection,
  inlineExtension,
  hardBreak,
  heading,
  listItem,
  media,
  mediaGroup,
  mediaSingle,
  mention,
  orderedList,
  panel,
  paragraph,
  placeholder: renderNothing,
  rule,
  table,
  tableCell,
  tableHeader,
  tableRow,
  taskItem,
  taskList,
  text,
  unknownBlock,
  status,
  date,
  expand,
  nestedExpand: expand,
};
