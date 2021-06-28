import {
  MarkdownSerializer as PMMarkdownSerializer,
  MarkdownSerializerState as PMMarkdownSerializerState,
} from 'prosemirror-markdown';
import { Mark, Node as PMNode } from 'prosemirror-model';
import { escapeMarkdown, stringRepeat } from './util';
import tableNodes from './tableSerializer';

/**
 * Look for series of backticks in a string, find length of the longest one, then
 * generate a backtick chain of a length longer by one. This is the only proven way
 * to escape backticks inside code block and inline code (for python-markdown)
 */
const generateOuterBacktickChain: (
  text: string,
  minLength?: number,
) => string = (() => {
  function getMaxLength(text: String): number {
    return (text.match(/`+/g) || []).reduce(
      (prev, val) => (val.length > prev.length ? val : prev),
      '',
    ).length;
  }

  return function (text: string, minLength = 1): string {
    const length = Math.max(minLength, getMaxLength(text) + 1);
    return stringRepeat('`', length);
  };
})();

export class MarkdownSerializerState extends PMMarkdownSerializerState {
  context = { insideTable: false };

  renderContent(parent: PMNode): void {
    parent.forEach((child: PMNode, _offset: number, index: number) => {
      if (
        // If child is an empty Textblock we need to insert a zwnj-character in order to preserve that line in markdown
        child.isTextblock &&
        !child.textContent &&
        // If child is a Codeblock we need to handle this separately as we want to preserve empty code blocks
        !(child.type.name === 'codeBlock') &&
        !(child.content && (child.content as any).size > 0)
      ) {
        return nodes.empty_line(this, child);
      }

      return this.render(child, parent, index);
    });
  }

  /**
   * This method override will properly escape backticks in text nodes with "code" mark enabled.
   * Bitbucket uses python-markdown which does not honor escaped backtick escape sequences \`
   * inside a backtick fence.
   *
   * @see node_modules/prosemirror-markdown/src/to_markdown.js
   * @see MarkdownSerializerState.renderInline()
   */
  renderInline(parent: PMNode): void {
    const active: Mark[] = [];
    let trailing = '';

    const progress = (node: PMNode | null, _?: any, index?: number) => {
      let marks = node
        ? node.marks.filter((mark) => this.marks[mark.type.name as any])
        : [];

      let leading = trailing;
      trailing = '';
      // If whitespace has to be expelled from the node, adjust
      // leading and trailing accordingly.
      if (
        node &&
        node.isText &&
        marks.some((mark) => {
          let info = this.marks[mark.type.name as any];
          return info && (info as any).expelEnclosingWhitespace;
        })
      ) {
        let [, lead, inner, trail] = /^(\s*)(.*?)(\s*)$/m.exec(node.text!)!;
        leading += lead;
        trailing = trail;
        if (lead || trail) {
          node = inner ? (node as any).withText(inner) : null;
          if (!node) {
            marks = active;
          }
        }
      }

      const code =
        marks.length &&
        marks[marks.length - 1].type.name === 'code' &&
        marks[marks.length - 1];
      const len = marks.length - (code ? 1 : 0);

      // Try to reorder 'mixable' marks, such as em and strong, which
      // in Markdown may be opened and closed in different order, so
      // that order of the marks for the token matches the order in
      // active.
      outer: for (let i = 0; i < len; i++) {
        const mark: Mark = marks[i];
        if (!(this.marks[mark.type.name as any] as any).mixable) {
          break;
        }
        for (let j = 0; j < active.length; j++) {
          const other = active[j];
          if (!(this.marks[other.type.name as any] as any).mixable) {
            break;
          }
          if (mark.eq(other)) {
            if (i > j) {
              marks = marks
                .slice(0, j)
                .concat(mark)
                .concat(marks.slice(j, i))
                .concat(marks.slice(i + 1, len));
            } else if (j > i) {
              marks = marks
                .slice(0, i)
                .concat(marks.slice(i + 1, j))
                .concat(mark)
                .concat(marks.slice(j, len));
            }
            continue outer;
          }
        }
      }

      // Find the prefix of the mark set that didn't change
      let keep = 0;
      while (
        keep < Math.min(active.length, len) &&
        marks[keep].eq(active[keep])
      ) {
        ++keep;
      }

      // Close the marks that need to be closed
      while (keep < active.length) {
        this.text(this.markString(active.pop()!, false), false);
      }

      // Output any previously expelled trailing whitespace outside the marks
      if (leading) {
        this.text(leading);
      }

      // Open the marks that need to be opened
      while (active.length < len) {
        const add = marks[active.length];
        active.push(add);
        this.text(this.markString(add, true), false);
      }

      if (node) {
        if (!code || !node.isText) {
          this.render(node, parent, index!);
        } else if (node.text) {
          // Generate valid monospace, fenced with series of backticks longer that backtick series inside it.
          let text = node.text;
          const backticks = generateOuterBacktickChain(node.text as string, 1);

          // Make sure there is a space between fences, otherwise python-markdown renderer will get confused
          if (text.match(/^`/)) {
            text = ' ' + text;
          }

          if (text.match(/`$/)) {
            text += ' ';
          }

          this.text(backticks + text + backticks, false);
        }
      }
    };

    parent.forEach((child: PMNode, _offset: number, index: number) => {
      progress(child, parent, index);
    });

    progress(null);
  }
}

export class MarkdownSerializer extends PMMarkdownSerializer {
  serialize(content: PMNode, options?: { [key: string]: any }): string {
    const state = new MarkdownSerializerState(
      this.nodes,
      this.marks,
      options || {},
    );

    state.renderContent(content);
    return state.out === '\u200c' ? '' : state.out; // Return empty string if editor only contains a zero-non-width character
  }
}

const editorNodes = {
  blockquote(state: MarkdownSerializerState, node: PMNode) {
    state.wrapBlock('> ', undefined, node, () => state.renderContent(node));
  },
  codeBlock(state: MarkdownSerializerState, node: PMNode) {
    const backticks = generateOuterBacktickChain(node.textContent, 3);
    state.write(backticks + (node.attrs.language || '') + '\n');
    state.text(node.textContent ? node.textContent : '\u200c', false);
    state.ensureNewLine();
    state.write(backticks);
    state.closeBlock(node);
  },
  heading(state: MarkdownSerializerState, node: PMNode) {
    state.write(state.repeat('#', node.attrs.level) + ' ');
    state.renderInline(node);
    state.closeBlock(node);
  },
  rule(state: MarkdownSerializerState, node: PMNode) {
    state.write(node.attrs.markup || '---');
    state.closeBlock(node);
  },
  bulletList(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      state.render(child, node, i);
    }
  },
  orderedList(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      state.render(child, node, i);
    }
  },
  listItem(
    state: MarkdownSerializerState,
    node: PMNode,
    parent: PMNode,
    index: number,
  ) {
    const delimiter =
      parent.type.name === 'bulletList' ? '* ' : `${index + 1}. `;
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (i > 0) {
        state.write('\n');
      }
      if (i === 0) {
        state.wrapBlock('  ', delimiter, node, () =>
          state.render(child, parent, i),
        );
      } else {
        state.wrapBlock('    ', undefined, node, () =>
          state.render(child, parent, i),
        );
      }
      if (child.type.name === 'paragraph' && i > 0) {
        state.write('\n');
      }
      state.flushClose(1);
    }
    if (index === parent.childCount - 1) {
      state.write('\n');
    }
  },
  paragraph(state: MarkdownSerializerState, node: PMNode) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  mediaGroup(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      state.render(child, node, i);
    }
  },
  mediaSingle(state: MarkdownSerializerState, node: PMNode, parent: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      state.render(child, node, i);
      if (!parent.type.name.startsWith('table')) {
        state.write('\n');
      }
    }
  },
  media(state: MarkdownSerializerState, node: PMNode) {
    state.write('![](' + node.attrs.url + ')');
  },
  image(state: MarkdownSerializerState, node: PMNode) {
    // Note: the 'title' is not escaped in this flavor of markdown.
    state.write(
      '![' +
        escapeMarkdown(node.attrs.alt) +
        '](' +
        node.attrs.src +
        (node.attrs.title ? ` '${escapeMarkdown(node.attrs.title)}'` : '') +
        ')',
    );
  },
  hardBreak(state: MarkdownSerializerState) {
    state.write('  \n');
  },
  text(
    state: MarkdownSerializerState,
    node: PMNode,
    parent: PMNode,
    index: number,
  ) {
    const previousNode = index === 0 ? null : parent.child(index - 1);
    let text = node.textContent;

    // BB converts 4 spaces at the beginning of the line to code block
    // that's why we escape 4 spaces with zero-width-non-joiner
    const fourSpaces = '    ';
    if (!previousNode && /^\s{4}/.test(node.textContent)) {
      text = node.textContent.replace(fourSpaces, '\u200c' + fourSpaces);
    }

    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const startOfLine = state.atBlank() || !!state.closed;
      state.write();
      state.out += escapeMarkdown(
        lines[i],
        startOfLine,
        state.context.insideTable,
      );
      if (i !== lines.length - 1) {
        if (
          lines[i] &&
          lines[i].length &&
          lines[i + 1] &&
          lines[i + 1].length
        ) {
          state.out += '  ';
        }
        state.out += '\n';
      }
    }
  },
  empty_line(state: MarkdownSerializerState, node: PMNode) {
    state.write('\u200c'); // zero-width-non-joiner
    state.closeBlock(node);
  },
  mention(
    state: MarkdownSerializerState,
    node: PMNode,
    parent: PMNode,
    index: number,
  ) {
    const isLastNode = parent.childCount === index + 1;
    let delimiter = '';
    if (!isLastNode) {
      const nextNode = parent.child(index + 1);
      const nextNodeHasLeadingSpace = nextNode.textContent.indexOf(' ') === 0;
      delimiter = nextNodeHasLeadingSpace ? '' : ' ';
    }

    state.write(`@${node.attrs.id}${delimiter}`);
  },
  emoji(state: MarkdownSerializerState, node: PMNode) {
    state.write(node.attrs.shortName);
  },
  inlineCard(state: MarkdownSerializerState, node: PMNode) {
    state.write(
      `[${node.attrs.url}](${node.attrs.url}){: data-inline-card='' }`,
    );
  },
};

export const nodes = { ...editorNodes, ...tableNodes };

export const marks = {
  em: { open: '_', close: '_', mixable: true, expelEnclosingWhitespace: true },
  strong: {
    open: '**',
    close: '**',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  strike: {
    open: '~~',
    close: '~~',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  link: {
    open: '[',
    close(_state: MarkdownSerializerState, mark: any) {
      return '](' + mark.attrs['href'] + ')';
    },
  },
  code: { open: '`', close: '`' },
};
