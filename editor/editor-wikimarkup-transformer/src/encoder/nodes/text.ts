import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder, NodeEncoderOpts } from '..';
import { macroKeywordTokenMap } from '../../parser/tokenize/keyword';

import { code } from '../marks/code';
import { textColor } from '../marks/color';
import { em } from '../marks/em';
import { link } from '../marks/link';
import { strike } from '../marks/strike';
import { strong } from '../marks/strong';
import { subsup } from '../marks/subsup';
import { underline } from '../marks/underline';

/**
 * The order of the mapping matters.
 * For example, textColor will be a macro {color} so
 * we want to process other marks before it.
 */
const markEncoderMapping = new Map([
  ['em', em],
  ['strike', strike],
  ['strong', strong],
  ['subsup', subsup],
  ['underline', underline],
  ['textColor', textColor],
  ['link', link],
  ['code', code],
]);

/**
 * ADFEXP-131: Improved logic for escaping metacharacters "[" and "!"
 * Before this change, any instance of "[" and "!" was being escaped
 * "[" is used for mentions
 * "!" is used for media
 */
const MENTION_ESCAPE_PATTERN = '(\\[~)'; // Matches pattern like [~
const MEDIA_ESCAPE_PATTERN = '(![^ !]+)(!)'; // Matches non space content between two consecutive "!" e.g. !filename.txt!

/**
 * Checks if the node's content needs to be escaped before continuing processing.
 * Currently, the `code` mark and `codeBlock` nodes handle their own escaping, and
 * therefore, should not be escaped here.
 *
 * @param node the current node to encode
 * @param parent the parent node, if exist
 * @returns true if the node should have its text escaped when encoding to wikimarkup.
 */
const isEscapeNeeded = (node: PMNode, parent?: PMNode) => {
  return !(
    (parent && parent.type.name === 'codeBlock') ||
    node.marks.find((m) => m.type.name === 'code') !== undefined
  );
};
/**
 * ESS-2569: Removing the backsalshes from the regex
 * ADFEXP-131: Improved logic for escaping metacharacters "[" and "!"
 */
function escapingWikiFormatter(text: string) {
  const pattern = [
    MENTION_ESCAPE_PATTERN,
    ...macroKeywordTokenMap.map(
      (macro) => `(${macro.regex.source.replace('^', '')})`,
    ),
  ].join('|');
  return text
    .replace(new RegExp(pattern, 'g'), '\\$&')
    .replace(new RegExp(MEDIA_ESCAPE_PATTERN, 'g'), '\\$1\\$2'); // Extra step required for media as currently both ends need to be escaped e.q. !filename.txt!
}

export const text: NodeEncoder = (
  node: PMNode,
  { parent }: NodeEncoderOpts = {},
): string => {
  let result = isEscapeNeeded(node, parent)
    ? escapingWikiFormatter(node.text!)
    : node.text!;
  markEncoderMapping.forEach((encoder, markName) => {
    const mark = node.marks.find((m) => m.type.name === markName);
    if (mark) {
      result = encoder(result, mark.attrs);
    }
  });

  return result;
};
