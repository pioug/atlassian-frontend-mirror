import { Node as PMNode, Schema } from 'prosemirror-model';
import { AddArgs, List, ListItem, ListType } from '../../interfaces';

const supportedContentType = [
  'paragraph',
  'orderedList',
  'bulletList',
  'mediaSingle',
  'codeBlock',
];

/**
 * Return the type of a list from the bullets
 */
export function getType(bullets: string): ListType {
  return /#$/.test(bullets) ? 'orderedList' : 'bulletList';
}

export class ListBuilder {
  private schema: Schema;
  private root: List;
  private lastDepth: number;
  private lastList: List;

  constructor(schema: Schema, bullets: string) {
    this.schema = schema;
    this.root = { children: [], type: getType(bullets) };
    this.lastDepth = 1;
    this.lastList = this.root;
  }

  /**
   * Return the type of the base list
   * @returns {ListType}
   */
  get type(): ListType {
    return this.root.type;
  }

  /**
   * Add a list item to the builder
   * @param {AddArgs[]} items
   */
  add(items: AddArgs[]) {
    for (const item of items) {
      const { style, content } = item;

      // If there's no style, add to previous list item as multiline
      if (style === null) {
        this.appendToLastItem(content);
        continue;
      }

      const depth = style.length;
      const type = getType(style);

      if (depth > this.lastDepth) {
        // Add children starting from last node
        this.createNest(depth - this.lastDepth, type);
        this.lastDepth = depth;
        this.lastList = this.addListItem(type, content);
      } else if (depth === this.lastDepth) {
        // Add list item to current node
        this.lastList = this.addListItem(type, content);
      } else {
        // Find node at depth and add list item
        this.lastList = this.findAncestor(this.lastDepth - depth);
        this.lastDepth = depth;
        this.lastList = this.addListItem(type, content);
      }
    }
  }

  /**
   * Compile a prosemirror node from the root list
   * @returns {PMNode[]}
   */
  buildPMNode(): PMNode[] {
    return this.parseList(this.root);
  }

  /**
   * Build prosemirror bulletList or orderedList node
   * @param {List} list
   * @returns {PMNode}
   */
  private parseList = (list: List): PMNode[] => {
    const listNode = this.schema.nodes[list.type];
    const output: PMNode[] = [];
    let listItemsBuffer: PMNode[] = [];

    for (let i = 0; i < list.children.length; i++) {
      const parsedContent = this.parseListItem(list.children[i]);

      for (let j = 0; j < parsedContent.length; j++) {
        const parsedNode = parsedContent[j];
        if (parsedNode.type.name === 'listItem') {
          listItemsBuffer.push(parsedNode);
          continue;
        }
        /**
         * If the node is not a listItem, then we need to
         * wrap exisintg list and break out
         */
        if (listItemsBuffer.length) {
          const list = listNode.createChecked({}, listItemsBuffer);
          output.push(list);
        }
        output.push(parsedNode); // This is the break out node
        listItemsBuffer = [];
      }
    }

    if (listItemsBuffer.length) {
      const list = listNode.createChecked({}, listItemsBuffer);
      output.push(list);
    }

    return output;
  };

  /**
   * Build prosemirror listItem node
   * This function would possibly return non listItem nodes
   * which we need to break out later
   * @param {ListItem} item
   */
  private parseListItem = (item: ListItem): PMNode[] => {
    const output: PMNode[] = [];

    if (!item.content) {
      item.content = [];
    }

    // Parse nested list
    const parsedChildren = item.children.reduce(
      (result: PMNode[], list: List) => {
        const parsedList = this.parseList(list);
        result.push(...parsedList);
        return result;
      },
      [],
    );
    // Append children to the content
    item.content.push(...parsedChildren);

    let contentBuffer: PMNode[] = [];
    for (let i = 0; i < item.content.length; i++) {
      const pmNode = item.content[i];

      /**
       * Skip empty paragraph
       */
      if (pmNode.type.name === 'paragraph' && pmNode.childCount === 0) {
        continue;
      }

      /* Skip Empty spaces after rule */
      if (this.isParagraphEmptyTextNode(pmNode)) {
        continue;
      }

      if (supportedContentType.indexOf(pmNode.type.name) === -1) {
        const listItem = this.createListItem(contentBuffer, this.schema);
        output.push(listItem);
        output.push(pmNode);

        contentBuffer = [];
        continue;
      }
      contentBuffer.push(pmNode);
    }

    if (contentBuffer.length) {
      const listItem = this.createListItem(contentBuffer, this.schema);
      output.push(listItem);
    }

    return output;
  };

  /* Check if all paragraph's children nodes are text and empty */
  private isParagraphEmptyTextNode(node: PMNode): boolean {
    if (node.type.name !== 'paragraph' || !node.childCount) {
      return false;
    }
    for (let i = 0; i < node.childCount; i++) {
      const n = node.content.child(i);
      if (n.type.name !== 'text') {
        // Paragraph contains non-text node, so not empty
        return false;
      } else if (n.textContent.trim() !== '') {
        return false;
      }
    }
    return true;
  }

  private createListItem(content: PMNode[], schema: Schema): PMNode {
    if (
      content.length === 0 ||
      ['paragraph', 'mediaSingle'].indexOf(content[0].type.name) === -1
    ) {
      // If the content is empty or the first element is not paragraph or mediaSingle.
      // this likely to be a nested list where the toplevel list is empty
      // For example: *# item 1
      // In this case we create an empty paragraph for the top level listNode
      content.unshift(this.schema.nodes.paragraph.createChecked());
    }

    return schema.nodes.listItem.createChecked({}, content);
  }

  /**
   * Add an item at the same level as the current list item
   * @param {ListType} type
   * @param {PMNode} content
   * @returns {PMNode}
   */
  private addListItem(type: ListType, content: PMNode[]): List {
    let list = this.lastList;

    // If the list is a different type, create a new list and add it to the parent node
    if (list.type !== type) {
      const parent = list.parent;
      const newList = {
        children: [],
        type,
        parent,
      };
      parent!.children.push(newList);
      this.lastList = list = newList;
    }

    const listItem: ListItem = { content, parent: list, children: [] };
    list.children = [...list.children, listItem];

    return list;
  }

  /**
   * Append the past content to the last accessed list node (multiline entries)
   * @param {PMNode[]} content
   */
  private appendToLastItem(content: PMNode[]) {
    const { children } = this.lastList;
    const lastItem = children[children.length - 1];

    lastItem.content!.push(...content);
  }

  /**
   * Created a nested list structure of N depth under the current node
   * @param {number} depth
   * @param {ListType} type
   */
  private createNest(depth: number, type: ListType) {
    while (depth-- > 0) {
      if (this.lastList.children.length === 0) {
        const listItem = { parent: this.lastList, children: [] };
        this.lastList.children = [listItem];
      }

      const nextItem = this.lastList.children[
        this.lastList.children.length - 1
      ];

      nextItem.children = [
        {
          children: [],
          parent: nextItem,
          type,
        },
      ];

      this.lastList = nextItem.children[0];
    }
  }

  /**
   * Find the Nth list ancestor of the current list
   * @param {number} depth
   */
  private findAncestor(depth: number) {
    let list: List = this.lastList;
    while (depth-- > 0 && list.parent) {
      const listItem = list.parent;
      if (listItem && listItem.parent) {
        list = listItem.parent;
      }
    }
    return list;
  }
}
