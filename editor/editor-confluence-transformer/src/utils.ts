import {
  Fragment,
  Mark,
  Node as PMNode,
  Schema,
  MarkType,
} from 'prosemirror-model';

import { normalizeHexColor } from '@atlaskit/adf-schema';
import { AC_XMLNS } from './encode-cxhtml';
import { Macro } from './types';

/**
 * Deduce a set of marks from a style declaration.
 */
export function marksFromStyle(
  schema: Schema,
  style: CSSStyleDeclaration,
): Mark[] {
  let marks: Mark[] = [];

  styles: for (let i = 0; i < style.length; i++) {
    const name = style.item(i);
    const value = style.getPropertyValue(name);

    switch (name) {
      case 'text-decoration-color':
      case 'text-decoration-style':
        continue styles;
      case 'text-decoration-line':
      case 'text-decoration':
        switch (value) {
          case 'line-through':
            marks = schema.marks.strike.create().addToSet(marks);
            continue styles;
        }
        break;
      case 'color':
        marks = schema.marks.textColor
          .create({ color: normalizeHexColor(value) })
          .addToSet(marks);
        continue styles;
      case 'font-family':
        if (value === 'monospace') {
          marks = schema.marks.code.create().addToSet(marks);
          continue styles;
        }
    }

    throw new Error(`Unable to derive a mark for CSS ${name}: ${value}`);
  }

  return marks;
}

/**
 * Create a fragment by adding a set of marks to each node.
 */
export function addMarks(fragment: Fragment, marks: Mark[]): Fragment {
  let result = fragment;
  for (let i = 0; i < fragment.childCount; i++) {
    const child = result.child(i);
    let newChild = child;
    for (const mark of marks) {
      newChild = newChild.mark(mark.addToSet(newChild.marks));
    }
    result = result.replaceChild(i, newChild);
  }
  return result;
}

export function getNodeMarkOfType(
  node: PMNode,
  markType: MarkType,
): Mark | null {
  if (!node.marks) {
    return null;
  }
  const foundMarks = node.marks.filter(
    mark => mark.type.name === markType.name,
  );
  return foundMarks.length ? foundMarks[foundMarks.length - 1] : null;
}

/**
 *
 * Traverse the DOM node and build an array of the breadth-first-search traversal
 * through the tree.
 *
 * Detection of supported vs unsupported content happens at this stage. Unsupported
 * nodes do not have their children traversed. Doing this avoids attempting to
 * decode unsupported content descendents into ProseMirror nodes.
 */
export function findTraversalPath(roots: Node[]) {
  const inqueue = [...roots];
  const outqueue = [] as Node[];

  let elem: Element | undefined;
  while ((elem = inqueue.shift() as Element)) {
    outqueue.push(elem);
    let children;
    if (isNodeSupportedContent(elem) && (children = childrenOfNode(elem))) {
      let childIndex;
      for (childIndex = 0; childIndex < children.length; childIndex++) {
        const child = children[childIndex];
        inqueue.push(child);
      }
    }
  }
  return outqueue;
}

function childrenOfNode(node: Element): NodeList | null {
  const tag = getNodeName(node);
  if (tag === 'AC:STRUCTURED-MACRO') {
    return getAcTagChildNodes(node, 'AC:RICH-TEXT-BODY');
  }

  return node.childNodes;
}
/**
 * Return an array containing the child nodes in a fragment.
 *
 * @param fragment
 */
export function children(fragment: Fragment): PMNode[] {
  const nodes: PMNode[] = [];
  for (let i = 0; i < fragment.childCount; i++) {
    nodes.push(fragment.child(i));
  }
  return nodes;
}

/**
 * Quickly determine if a DOM node is supported (i.e. can be represented in the ProseMirror
 * schema).
 *
 * When a node is not supported, its children are not traversed — instead the entire node content
 * is stored inside an `unsupportedInline`.
 *
 * @param node
 */
function isNodeSupportedContent(node: Node): boolean {
  if (
    node.nodeType === Node.TEXT_NODE ||
    node.nodeType === Node.CDATA_SECTION_NODE
  ) {
    return true;
  }

  if (node instanceof HTMLElement || node.nodeType === Node.ELEMENT_NODE) {
    const tag = getNodeName(node);
    switch (tag) {
      case 'DEL':
      case 'S':
      case 'B':
      case 'STRONG':
      case 'I':
      case 'EM':
      case 'CODE':
      case 'SUB':
      case 'SUP':
      case 'U':
      case 'BLOCKQUOTE':
      case 'SPAN':
      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6':
      case 'BR':
      case 'HR':
      case 'UL':
      case 'OL':
      case 'LI':
      case 'P':
      case 'A':
      case 'FAB:MENTION':
      case 'FAB:MEDIA-GROUP':
      case 'FAB:MEDIA-SINGLE':
      case 'FAB:MEDIA':
      case 'AC:INLINE-COMMENT-MARKER':
      case 'AC:STRUCTURED-MACRO':
        return true;
    }
  }

  return false;
}

export function getAcName(node: Element): string | undefined {
  return node.getAttribute('ac:name') || '';
}

export function getNodeName(node: Node): string {
  return node.nodeName.toUpperCase();
}

export function getAcTagContent(node: Element, tagName: string): string | null {
  for (let i = 0, len = node.childNodes.length; i < len; i++) {
    const child = node.childNodes[i] as Element;
    if (getNodeName(child) === tagName) {
      return child.textContent;
    }
  }

  return null;
}

export function getAcTagChildNodes(
  node: Element,
  tagName: string,
): NodeList | null {
  const child = getAcTagNode(node, tagName);
  if (child) {
    // return html collection only if childNodes are found
    return child.childNodes.length ? child.childNodes : null;
  }
  return null;
}

export function getAcTagNode(node: Element, tagName: string): Element | null {
  for (let i = 0, len = node.childNodes.length; i < len; i++) {
    const child = node.childNodes[i] as Element;
    if (getNodeName(child).toLowerCase() === tagName) {
      return child;
    }
  }
  return null;
}

export function getMacroAttribute(node: Element, attribute: string): string {
  return node.getAttribute('data-macro-' + attribute) || '';
}

export function getMacroParameters(node: Element): any {
  const params: Record<string, string> = {};

  getMacroAttribute(node, 'parameters')
    .split('|')
    .forEach(paramStr => {
      const param = paramStr.split('=');
      if (param.length) {
        params[param[0]] = param[1];
      }
    });
  return params;
}

export function createCodeFragment(
  schema: Schema,
  codeContent: string,
  language?: string | null,
  title?: string | null,
): Fragment {
  const content: PMNode[] = [];

  if (!!title) {
    const titleNode = schema.nodes.heading.createChecked(
      { level: 5 },
      schema.text(title),
    );
    content.push(titleNode);
  }

  const codeBlockNode = schema.nodes.codeBlock.createChecked(
    { language },
    schema.text(codeContent),
  );

  content.push(codeBlockNode);

  return Fragment.from(content);
}

export function hasClass(node: Element, className: string): boolean {
  if (node && node.className) {
    return node.className.indexOf(className) > -1;
  }
  return false;
}

/**
 * Calculates the size of an element in a given dimension, using its CSS property value,
 * which may be based to the parent element's dimensions.
 *
 * @param value Value for a CSS property. Supported units are px and %.
 * @param parentPixels The dimension of the container element, in pixels.
 */
export function calcPixelsFromCSSValue(
  value: string,
  parentPixels: number,
): number {
  if (value.substr(-2) === 'px') {
    return parseInt(value.slice(0, -2), 10);
  } else if (value.substr(-1) === '%') {
    return Math.round(
      (parseInt(value.slice(0, -1), 10) / 100.0) * parentPixels,
    );
  }
  return 0;
}

/*
 * Constructs a struct string of replacement blocks and marks for a given node
 */
export function getContent(
  node: Node,
  convertedNodes: WeakMap<Node, Fragment | PMNode>,
): Fragment {
  let fragment = Fragment.fromArray([]);
  for (let childIndex = 0; childIndex < node.childNodes.length; childIndex++) {
    const child = node.childNodes[childIndex];
    const thing = convertedNodes.get(child);
    if (thing instanceof Fragment || thing instanceof PMNode) {
      fragment = fragment.append(Fragment.from(thing));
    }
  }
  return fragment;
}

export function parseMacro(node: Element): Macro {
  const macroName = getAcName(node) || 'Unnamed Macro';
  const macroId = node.getAttributeNS(AC_XMLNS, 'macro-id')!;
  const properties: Record<string, string | null> = {};
  const params: Record<string, string | null> = {};

  for (let i = 0, len = node.childNodes.length; i < len; i++) {
    const child = node.childNodes[i] as Element;
    const nodeName = getNodeName(child).toLowerCase();
    if (child.nodeType === 3) {
      continue;
    }
    const value = child.textContent;

    // example: <ac:parameter ac:name=\"colour\">Red</ac:parameter>
    if (nodeName === 'ac:parameter') {
      const key = getAcName(child);
      if (key) {
        params[key] = value;
      }
    } else {
      // example: <fab:placeholder-url>, <fab:display-type>, <ac:rich-text-body>
      properties[nodeName] = value;
    }
  }

  return { macroId, macroName, properties, params };
}

export const getExtensionMacroParams = (params: Record<string, any>) => {
  const macroParams: Record<string, { value: any }> = {};
  Object.keys(params).forEach(key => {
    /** Safe check for empty keys */
    if (key) {
      macroParams[key] = { value: params[key] };
    }
  });
  return macroParams;
};

export const mapPanelTypeToPm = (panelType: string) => {
  switch (panelType) {
    case 'warning':
      return 'error';
    case 'note':
      return 'warning';
    case 'tip':
      return 'success';
  }
  return panelType;
};

export const mapPanelTypeToCxhtml = (panelType: string) => {
  switch (panelType) {
    case 'error':
      return 'warning';
    case 'warning':
      return 'note';
    case 'success':
      return 'tip';
    case 'note':
      return 'panel';
  }
  return panelType;
};

export const encodeMacroParams = (
  doc: Document,
  params: {
    [name: string]: { value: string };
  },
) => {
  const elem = doc.createDocumentFragment();
  Object.keys(params).forEach(name => {
    const el = doc.createElementNS(AC_XMLNS, 'ac:parameter');
    el.setAttributeNS(AC_XMLNS, 'ac:name', name);
    el.textContent = params[name].value;
    elem.appendChild(el);
  });
  return elem;
};
