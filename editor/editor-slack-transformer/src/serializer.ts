import {
  MarkdownSerializer as PMMarkdownSerializer,
  MarkdownSerializerState as PMMarkdownSerializerState,
} from 'prosemirror-markdown';
import { Node as PMNode } from 'prosemirror-model';

import { escapeMarkdown } from './util';

export class MarkdownSerializerState extends PMMarkdownSerializerState {
  renderContent(parent: PMNode): void {
    parent.forEach((child: PMNode, _offset: number, index: number) => {
      if (
        // If child is an empty Textblock we need to insert a zwnj-character in order to preserve that line in markdown
        child.isTextblock &&
        !child.textContent &&
        // If child is a Codeblock we need to handle this separately as we want to preserve empty code blocks
        !(child.type.name === 'codeBlock') &&
        !(child.content && child.content.size > 0)
      ) {
        return nodes.empty_line(this, child);
      }

      return this.render(child, parent, index);
    });
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

/**
 * Stubs for unsupported nodes
 */
const unsupportedNodes = {
  table(state: MarkdownSerializerState, node: PMNode) {
    state.write('[table]');
    state.closeBlock(node);
  },
  blockCard(state: MarkdownSerializerState, node: PMNode) {
    state.write('[block card]');
    state.closeBlock(node);
  },
  embedCard(state: MarkdownSerializerState) {
    state.write('[embedded card]');
  },
  inlineCard(state: MarkdownSerializerState) {
    state.write('[inline card]');
  },
  inlineExtension(state: MarkdownSerializerState) {
    state.write('[inline extension]');
  },
  extension(state: MarkdownSerializerState, node: PMNode) {
    state.write('[extension]');
    state.closeBlock(node);
  },
  bodiedExtension(state: MarkdownSerializerState, node: PMNode) {
    state.write('[bodied extension]');
    state.closeBlock(node);
  },
  taskList(state: MarkdownSerializerState, node: PMNode) {
    state.write('[task list]');
    state.closeBlock(node);
  },
  caption(state: MarkdownSerializerState) {
    state.write('[caption]');
  },
  nestedExpand(state: MarkdownSerializerState) {
    state.write('[nested expand]');
  },
  confluenceUnsupportedBlock(state: MarkdownSerializerState) {
    state.write('');
  },
  confluenceUnsupportedInline(state: MarkdownSerializerState) {
    state.write('');
  },
  unsupportedInline(state: MarkdownSerializerState) {
    state.write('');
  },
  unsupportedBlock(state: MarkdownSerializerState) {
    state.write('');
  },
};

export const nodes = {
  blockquote(state: MarkdownSerializerState, node: PMNode) {
    state.wrapBlock('> ', undefined, node, () => state.renderContent(node));
  },
  codeBlock(state: MarkdownSerializerState, node: PMNode) {
    state.write('```');
    state.ensureNewLine();
    state.text(node.textContent ? node.textContent : '\u200c', false);
    state.ensureNewLine();
    state.write('```');
    state.closeBlock(node);
  },
  heading(state: MarkdownSerializerState, node: PMNode) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  rule(state: MarkdownSerializerState, node: PMNode) {
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
      parent.type.name === 'bulletList' ? '• ' : `${index + 1}. `;

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
  hardBreak(state: MarkdownSerializerState) {
    state.write('  \n');
  },
  text(state: MarkdownSerializerState, node: PMNode) {
    const lines = node.textContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      state.write();
      state.out += escapeMarkdown(lines[i]);

      if (i !== lines.length - 1) {
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
    state.write(node.attrs.text || node.attrs.shortName);
  },
  mediaGroup(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);

      state.render(child, node, i);
    }
  },
  mediaSingle(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);

      state.render(child, node, i);
      state.write('\n');
    }
  },
  /**
   * Slack markdown does not have specific syntax for images/files.
   * We just show that there's an image attached as a link and a media just as a text.
   */
  media(state: MarkdownSerializerState) {
    state.write('[media attached]');
    state.write('\n');
  },
  image(state: MarkdownSerializerState, node: PMNode) {
    state.write(`[<${node.attrs.src}|image attached>]`);
  },
  date(state: MarkdownSerializerState, node: PMNode) {
    /**
     *  The year will be omitted if the date refers to the current year.
     *  Timestamp should be transformed to Unix time.
     */
    const unixTime = (+node.attrs.timestamp / 1000) | 0;

    state.write(
      `<!date^${unixTime}^{date_short}|${new Date(
        +node.attrs.timestamp,
      ).toDateString()}>`,
    );
  },
  decisionList(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);

      state.render(child, node, i);
    }
  },
  decisionItem(
    state: MarkdownSerializerState,
    node: PMNode,
    parent: PMNode,
    index: number,
  ) {
    state.write('<> ');
    state.renderInline(node);
    state.write('\n');

    if (index === parent.childCount - 1) {
      state.write('\n');
    }
  },
  layoutSection(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);

      state.render(child, node, i);
    }
  },
  layoutColumn(state: MarkdownSerializerState, node: PMNode) {
    state.renderInline(node);
  },
  status(state: MarkdownSerializerState, node: PMNode) {
    state.write(`*${node.attrs.text}*`);
  },
  panel(state: MarkdownSerializerState, node: PMNode) {
    state.renderInline(node);
  },
  placeholder(state: MarkdownSerializerState, node: PMNode) {
    state.write(node.attrs.text);
  },
  confluenceJiraIssue(state: MarkdownSerializerState, node: PMNode) {
    state.write(` JIRA | ${node.attrs.issueKey} `);
  },
  ...unsupportedNodes,
};

/**
 * Slack markdown does not have specific syntax for (sub|super)script, underline, text color.
 */
const unsupportedMarks = {
  subsup: {
    open: '',
    close: '',
  },
  underline: {
    open: '',
    close: '',
  },
  textColor: {
    open: '',
    close: '',
  },
  typeAheadQuery: {
    open: '',
    close: '',
  },
  confluenceInlineComment: {
    open: '',
    close: '',
  },
  annotation: {
    open: '',
    close: '',
  },
  unsupportedMark: {
    open: '',
    close: '',
  },
};

export const marks = {
  em: { open: '_', close: '_', mixable: true, expelEnclosingWhitespace: true },
  strong: {
    open: '*',
    close: '*',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  strike: {
    open: '~',
    close: '~',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  link: {
    open(_state: MarkdownSerializerState, mark: any) {
      return '<' + mark.attrs.href + '|';
    },
    close: '>',
  },
  code: { open: '`', close: '`', escape: false },
  ...unsupportedMarks,
};
