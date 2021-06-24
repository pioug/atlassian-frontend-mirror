import { Node as PMNode, Schema } from 'prosemirror-model';
import { AddCellArgs } from '../../interfaces';
import { TableBuilder } from '../builder/table-builder';
import { parseString } from '../text';
import { normalizePMNodes } from '../utils/normalize';
import { linkFormat } from './links/link-format';
import { media } from './media';
import { emoji } from './emoji';
import { TokenType, TokenParser } from './';
import { Context } from '../../interfaces';
import { parseNewlineOnly } from './whitespace';
import { parseMacroKeyword } from './keyword';
import { parseToken } from './';

/*
  The following are currently NOT supported
  1. Macros
  2. Escape |
  3. Table of table
*/
const CELL_REGEXP = /^([ \t]*)([|]+)([ \t]*)/;
const EMPTY_LINE_REGEXP = /^[ \t]*\r?\n/;

const processState = {
  END_TABLE: 2,
  BUFFER: 4,
  CLOSE_ROW: 5,
  NEW_ROW: 6,
  LINE_BREAK: 7,
  LINK: 8,
  MEDIA: 9,
  MACRO: 10,
  EMOJI: 11,
};

export const table: TokenParser = ({ input, position, schema, context }) => {
  /**
   * The following token types will be ignored in parsing
   * the content of a table cell
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.TABLE,
    TokenType.RULER,
  ];

  const output: PMNode[] = [];
  let index = position;
  let currentState = processState.NEW_ROW;
  let buffer = [];
  let cellsBuffer: AddCellArgs[] = [];
  let cellStyle = '';

  let builder: TableBuilder | null = null;

  while (index < input.length) {
    const char = input.charAt(index);
    const substring = input.substring(index);

    switch (currentState) {
      case processState.NEW_ROW: {
        const tableMatch = substring.match(CELL_REGEXP);
        if (tableMatch) {
          if (!builder) {
            builder = new TableBuilder(schema);
          }
          // Capture empty spaces
          index += tableMatch[1].length;
          cellStyle = tableMatch[2];
          index += tableMatch[2].length;
          currentState = processState.BUFFER;
          continue;
        }

        currentState = processState.END_TABLE;
        continue;
      }
      case processState.LINE_BREAK: {
        // If we encounter an empty line, we should end the table
        const emptyLineMatch = substring.match(EMPTY_LINE_REGEXP);
        if (emptyLineMatch) {
          bufferToCells(
            cellStyle,
            buffer.join(''),
            cellsBuffer,
            schema,
            ignoreTokenTypes,
            context,
          );
          currentState = processState.END_TABLE;
          continue;
        }
        // If we enconter a new row
        const cellMatch = substring.match(CELL_REGEXP);
        if (cellMatch) {
          currentState = processState.CLOSE_ROW;
        } else {
          currentState = processState.BUFFER;
        }
        continue;
      }
      case processState.BUFFER: {
        const length = parseNewlineOnly(substring);
        if (length) {
          // Calculate the index of the end of the current cell,
          // upto and including the new line
          const endIndex = index;
          // Calculate the index of the start of the current cell
          const startIndex = input.lastIndexOf('|', endIndex) + 1;
          const charsBefore = input.substring(startIndex, endIndex);
          if (charsBefore === '' || charsBefore.match(EMPTY_LINE_REGEXP)) {
            currentState = processState.CLOSE_ROW;
          } else {
            currentState = processState.LINE_BREAK;
            buffer.push(input.substr(index, length));
          }
          index += length;
          continue;
        }

        switch (char) {
          case '|': {
            // This is now end of a cell, we should wrap the buffer into a cell
            bufferToCells(
              cellStyle,
              buffer.join(''),
              cellsBuffer,
              schema,
              ignoreTokenTypes,
              context,
            );
            buffer = [];

            // Update cells tyle
            const cellMatch = substring.match(CELL_REGEXP);
            // The below if statement should aways be true, we leave it here to prevent any future code changes fall into infinite loop
            if (cellMatch) {
              cellStyle = cellMatch[2];
              // Move into the cell content
              index += cellMatch[2].length;
              continue;
            }
            break;
          }

          case ':':
          case ';':
          case '(': {
            currentState = processState.EMOJI;
            continue;
          }

          case '[': {
            currentState = processState.LINK;
            continue;
          }

          case '!': {
            currentState = processState.MEDIA;
            continue;
          }

          case '{': {
            currentState = processState.MACRO;
            continue;
          }

          default: {
            buffer.push(char);
            index++;
            continue;
          }
        }
        break;
      }
      case processState.CLOSE_ROW: {
        const bufferOutput = buffer.join('');
        if (bufferOutput.trim().length > 0) {
          bufferToCells(
            cellStyle,
            bufferOutput,
            cellsBuffer,
            schema,
            ignoreTokenTypes,
            context,
          );
          buffer = [];
        }
        if (builder) {
          builder.add(cellsBuffer);
          cellsBuffer = [];
        }

        currentState = processState.NEW_ROW;
        continue;
      }
      case processState.END_TABLE: {
        if (builder) {
          if (cellsBuffer.length) {
            builder.add(cellsBuffer);
          }
          output.push(builder.buildPMNode());
        }

        return {
          type: 'pmnode',
          nodes: output,
          length: index - position,
        };
      }
      case processState.MEDIA: {
        const token = media({ input, schema, context, position: index });
        buffer.push(input.substr(index, token.length));
        index += token.length;
        currentState = processState.BUFFER;
        continue;
      }
      case processState.EMOJI: {
        const token = emoji({ input, schema, context, position: index });
        buffer.push(input.substr(index, token.length));
        index += token.length;
        currentState = processState.BUFFER;
        continue;
      }
      case processState.LINK: {
        /**
         * We should "fly over" the link format and we dont want
         * -awesome [link|https://www.atlass-ian.com] nice
         * to be a strike through because of the '-' in link
         */
        const token = linkFormat({ input, schema, context, position: index });
        if (token.type === 'text') {
          buffer.push(token.text);
          index += token.length;
          currentState = processState.BUFFER;
          continue;
        } else if (token.type === 'pmnode') {
          buffer.push(input.substr(index, token.length));
          index += token.length;
          currentState = processState.BUFFER;
          continue;
        }
        break;
      }
      case processState.MACRO: {
        const match = parseMacroKeyword(input.substring(index));
        if (!match) {
          buffer.push(char);
          currentState = processState.BUFFER;
          break;
        }

        const token = parseToken(input, match.type, index, schema, context);
        buffer.push(input.substr(index, token.length));
        index += token.length;
        currentState = processState.BUFFER;
        continue;
      }
    }

    index++;
  }

  /**
   * If there are left over content which didn't have a closing |
   * For example
   * |cell1|cell2|cell3
   * we still want to create a new cell for the last cell3 if it's
   * not empty.
   */
  const bufferOutput = buffer.join('');
  if (bufferOutput.trim().length > 0) {
    bufferToCells(
      cellStyle,
      bufferOutput,
      cellsBuffer,
      schema,
      ignoreTokenTypes,
      context,
    );
  }

  if (builder) {
    if (cellsBuffer.length) {
      builder.add(cellsBuffer);
    }
    output.push(builder.buildPMNode());
  }

  return {
    type: 'pmnode',
    nodes: output,
    length: index - position,
  };
};

function bufferToCells(
  style: string,
  buffer: string,
  cellsBuffer: AddCellArgs[],
  schema: Schema,
  ignoreTokenTypes: TokenType[],
  context: Context,
) {
  if (buffer.length) {
    const contentNode = parseString({
      schema,
      context,
      ignoreTokenTypes: ignoreTokenTypes,
      input: buffer,
    });
    cellsBuffer.push({
      style,
      content: normalizePMNodes(contentNode, schema),
    });
  }
}
