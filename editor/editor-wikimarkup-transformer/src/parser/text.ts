import { Node as PMNode, Schema } from 'prosemirror-model';
import { createTextNode } from './nodes/text';
import {
  parseOtherKeyword,
  parseLeadingKeyword,
  parseMacroKeyword,
  parseIssueKeyword,
} from './tokenize/keyword';
import { parseToken, TokenType } from './tokenize';
import { Context } from '../interfaces';
import { parseWhitespaceOnly } from './tokenize/whitespace';
import { escapeHandler } from './utils/escape';
import { normalizePMNodes } from './utils/normalize';

const processState = {
  NEWLINE: 0,
  BUFFER: 1,
  TOKEN: 2,
  ESCAPE: 3,
};

export function parseString({
  input,
  schema,
  ignoreTokenTypes = [],
  context,
  includeLeadingSpace = false,
}: {
  input: string;
  schema: Schema;
  ignoreTokenTypes: TokenType[];
  context: Context;
  includeLeadingSpace?: boolean;
}): PMNode[] {
  let index = 0;
  let state = processState.NEWLINE;
  let buffer = [];
  let tokenType = TokenType.STRING;
  let newLines: PMNode[] = [];
  const output: PMNode[] = [];
  let inlineNodes: PMNode[] = [];

  while (index < input.length) {
    const char = input.charAt(index);

    switch (state) {
      case processState.NEWLINE: {
        /**
         * During this state, the parser will trim leading
         * spaces and looking for any leading keywords.
         */
        const substring = input.substring(index);
        const length = parseWhitespaceOnly(substring);
        if (length) {
          index += length;
          if (includeLeadingSpace) {
            buffer.push(char);
          }
          continue;
        }

        const match =
          parseLeadingKeyword(substring) ||
          parseMacroKeyword(substring) ||
          parseOtherKeyword(substring) ||
          parseIssueKeyword(substring, context.issueKeyRegex);

        if (match && ignoreTokenTypes.indexOf(match.type) === -1) {
          tokenType = match.type;
          state = processState.TOKEN;
          continue;
        } else {
          state = processState.BUFFER;
          continue;
        }
      }

      case processState.BUFFER: {
        /**
         * During this state, the parser will start
         * saving plaintext into the buffer until it hits
         * a keyword
         */
        const substring = input.substring(index);
        /**
         * If the previous char is not a alphanumeric, we will parse
         * format keywords.
         * If the previous char is '{', we need to skip parse macro
         * keyword
         */
        let match: { type: TokenType } | null = null;
        if (buffer.length > 0 && buffer[buffer.length - 1].endsWith('{')) {
          match = parseOtherKeyword(substring);
        } else {
          match =
            parseMacroKeyword(substring) ||
            parseOtherKeyword(substring) ||
            parseIssueKeyword(substring, context.issueKeyRegex);
        }

        if (match && ignoreTokenTypes.indexOf(match.type) === -1) {
          tokenType = match.type;
          state = processState.TOKEN;
          continue;
        }

        if (char === '\\') {
          state = processState.ESCAPE;
          continue;
        }

        buffer.push(char);
        break;
      }

      case processState.TOKEN: {
        const token = parseToken(input, tokenType, index, schema, context);
        if (token.type === 'text') {
          buffer.push(token.text);
        } else if (token.type === 'pmnode') {
          /*ESS-2539 We are keeping track of consecutive newLines in the newLines array
            Whenever more than two consecutive newLines are encountered, we start a new paragraph
          */
          if (
            newLines.length >= 2 &&
            (tokenType !== TokenType.HARD_BREAK || buffer.length > 0)
          ) {
            output.push(...normalizePMNodes(inlineNodes, schema));
            // push newLines to the buffer as a separator between media nodes
            inlineNodes = isConsecutiveMediaGroups(inlineNodes, token.nodes)
              ? [...newLines]
              : [];
            newLines = [];
          }
          if (inlineNodes.length === 0) {
            newLines = [];
          }
          if (
            newLines.length > 0 &&
            isNewLineRequiredBetweenNodes(inlineNodes, buffer, token.nodes)
          ) {
            inlineNodes.push(...newLines);
            newLines = [];
          }
          inlineNodes.push(...createTextNode(buffer.join(''), schema));
          if (tokenType === TokenType.HARD_BREAK) {
            newLines.push(...token.nodes);
          } else {
            inlineNodes.push(...token.nodes);
            if (token.nodes.length > 0) {
              newLines = [];
            }
          }
          buffer = []; // clear the buffer
        }
        index += token.length;
        if (tokenType === TokenType.HARD_BREAK) {
          state = processState.NEWLINE;
        } else {
          state = processState.BUFFER;
        }
        continue;
      }

      case processState.ESCAPE: {
        const token = escapeHandler(input, index);
        buffer.push(token.text);
        index += token.length;
        state = processState.BUFFER;
        continue;
      }
      default:
    }
    index++;
  }

  const bufferedStr = buffer.join('');
  if (bufferedStr.length > 0) {
    // Wrapping the rest of the buffer into a text node
    if (newLines.length >= 2) {
      // normalize the nodes already parsed if more than two consecutive newLines are encountered
      output.push(...normalizePMNodes(inlineNodes, schema));
      inlineNodes = [];
      newLines = [];
    }
    if (
      newLines.length > 0 &&
      inlineNodes.length > 0 &&
      !inlineNodes[inlineNodes.length - 1].isBlock
    ) {
      inlineNodes.push(...newLines);
    }
    inlineNodes.push(...createTextNode(bufferedStr, schema));
  }

  return [...output, ...inlineNodes];
}

/* checks whether a newLine is required between two consecutive nodes
   Returns true for inline nodes, false for block nodes
*/
function isNewLineRequiredBetweenNodes(
  currentNodes: PMNode[],
  buffer: string[],
  nextNodes: PMNode[],
) {
  if (currentNodes.length === 0) {
    return false;
  }
  if (buffer.length > 0 && currentNodes[currentNodes.length - 1]?.isBlock) {
    return false;
  }
  if (buffer.length === 0) {
    if (nextNodes.length === 0) {
      return false;
    }
    if (nextNodes[0]?.type.name === 'hardBreak') {
      return false;
    }
    if (
      nextNodes[0]?.isBlock ||
      currentNodes[currentNodes.length - 1]?.isBlock
    ) {
      return false;
    }
  }
  return true;
}

function isConsecutiveMediaGroups(currentNodes: PMNode[], nextNodes: PMNode[]) {
  return (
    currentNodes.length > 0 &&
    currentNodes[currentNodes.length - 1]?.type.name === 'mediaGroup' &&
    nextNodes[0]?.type.name === 'mediaGroup'
  );
}
