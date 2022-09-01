// ED-15363: modified version of the original paragraph plugin
// https://github.com/markdown-it/markdown-it/blob/master/lib/rules_block/paragraph.js

const paragraph = (state: any, startLine: number /*, endLine*/) => {
  let content,
    terminate,
    i,
    l,
    token,
    oldParentType,
    nextLine = startLine + 1,
    terminatorRules = state.md.block.ruler.getRules('paragraph'),
    endLine = state.lineMax;

  oldParentType = state.parentType;
  state.parentType = 'paragraph';

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) {
      continue;
    }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }

  // ED-15363: We removed .trim() from this logic from the original library to
  // preserve leading whitespaces at the beginning and end of paragraph blocks
  // when pasting plain text (to preserve whitespace-based indentation, at the
  // beginning and end of paragraphs).

  // content = state.getLines(startLine, nextLine, state.blkIndent, false) .trim()
  content = state.getLines(startLine, nextLine, state.blkIndent, false);

  state.line = nextLine;

  token = state.push('paragraph_open', 'p', 1);
  token.map = [startLine, state.line];

  token = state.push('inline', '', 0);
  token.content = content;
  token.map = [startLine, state.line];
  token.children = [];

  token = state.push('paragraph_close', 'p', -1);

  state.parentType = oldParentType;

  return true;
};

export default (md: any) => md.block.ruler.at('paragraph', paragraph);
