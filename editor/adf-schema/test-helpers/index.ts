import { Mark, Node as PMNode } from 'prosemirror-model';
import * as fs from 'fs';

export const readFilesSync = (path: string) => {
  return fs.readdirSync(path).reduce((acc, name) => {
    if (name.match(/\.json$/)) {
      acc.push({
        name,
        data: JSON.parse(fs.readFileSync(`${path}/${name}`, 'utf-8')),
      });
    }

    return acc;
  }, [] as { name: string; data: any }[]);
};

export { fromHTML, toContext, toDOM, toHTML } from './html-helpers';

export const textWithMarks = (obj: PMNode, text: string, marks: Mark[]) => {
  let matched = false;
  obj.descendants((node) => {
    if (node.isText && node.text === text) {
      if (Mark.sameSet(node.marks, marks)) {
        matched = true;
      }
    }
  });

  return matched;
};

export { default as schema } from './schema';
export {
  RefsTracker,
  a,
  blockquote,
  br,
  code,
  code_block,
  coerce,
  confluenceJiraIssue,
  confluenceUnsupportedBlock,
  confluenceUnsupportedInline,
  createCell,
  createHeaderCell,
  decisionItem,
  decisionList,
  doc,
  em,
  emoji,
  extension,
  flatten,
  fragment,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hardBreak,
  hr,
  img,
  li,
  markFactory,
  media,
  mediaGroup,
  mediaSingle,
  mention,
  mentionQuery,
  nodeFactory,
  offsetRefs,
  ol,
  p,
  panel,
  panelNote,
  plain,
  sequence,
  slice,
  strike,
  strong,
  subsup,
  table,
  taskItem,
  taskList,
  td,
  td11,
  tdCursor,
  tdEmpty,
  text,
  textColor,
  th,
  th11,
  thCursor,
  thEmpty,
  tr,
  ul,
  underline,
  unsupportedBlock,
  unsupportedInline,
} from './schema-builder';
export type {
  BuilderContent,
  Refs,
  RefsContentItem,
  RefsNode,
  position,
} from './schema-builder';
