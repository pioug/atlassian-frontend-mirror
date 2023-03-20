import {
  AST,
  AstGenerator,
  RefractorNode,
  SyntaxHighlighterLineProps,
} from '../../types';

import createLineGenerator from './create-line';
import createLineElement from './create-line-element';
import flattenCodeTree from './flatten-code-tree';
import getCodeTree from './get-code-tree';

const newLineRegex = /\n/g;
function getNewLines(str: string) {
  return str.match(newLineRegex);
}

interface ProcessLines {
  astGenerator: AstGenerator;
  code: string;
  language: string;
  shouldCreateParentElementForLines: boolean;
  lineProps: SyntaxHighlighterLineProps;
  showLineNumbers: boolean;
}

/**
 * __Line Processor__
 *
 * A line processor, that uses refractor to turn code into a tree structure
 * with highlighting metadata and collapses this tree into lines for a renderer.
 */
export default function processLines({
  astGenerator,
  code,
  language,
  shouldCreateParentElementForLines,
  lineProps,
  showLineNumbers,
}: ProcessLines): RefractorNode[] {
  const codeTree = getCodeTree(language, code, astGenerator);

  const startingLineNumber = 1;
  const createLine = createLineGenerator(
    lineProps,
    shouldCreateParentElementForLines,
    showLineNumbers,
  );

  const newTree: (RefractorNode | RefractorNode[])[] = [];
  let lastLineBreakIndex = -1;
  let index = 0;

  // Seems odd we flatten the tree immediately - what work could we do on it more performantly than on the lines?
  const tree = flattenCodeTree(codeTree);

  while (index < tree.length) {
    const testNode: RefractorNode = tree[index];
    if (testNode.type === 'text') {
      index++;
      continue;
    }

    const node = testNode as AST.Element;
    const firstChildNode = node.children[0];

    if (firstChildNode.type === 'text') {
      const { value } = firstChildNode;
      const newLines = getNewLines(value);

      if (newLines) {
        const splitValue = value.split('\n');

        splitValue.forEach((text: string, i: number) => {
          const lineNumber = newTree.length + startingLineNumber;
          const newChild: AST.Text = { type: 'text', value: `${text}\n` };

          // if it's the first line
          if (i === 0) {
            const children = tree.slice(lastLineBreakIndex + 1, index).concat(
              createLineElement({
                children: [newChild],
                className: node.properties.className,
                lineNumber,
              }),
            );

            const line = createLine(children, lineNumber);
            newTree.push(line);

            // if it's the last line
          } else if (i === splitValue.length - 1) {
            const nextNode = tree[index + 1] as AST.Element;
            const stringChild =
              nextNode && nextNode.children && nextNode.children[0];
            // Similar to newChild above, but no newline
            const lastLineInPreviousSpan: AST.Text = {
              type: 'text',
              value: `${text}`,
            };
            if (stringChild) {
              const newElem = createLineElement({
                children: [lastLineInPreviousSpan],
                className: node.properties.className,
                lineNumber,
              });
              tree.splice(index + 1, 0, newElem);
            } else {
              const children = [lastLineInPreviousSpan];
              const line = createLine(
                children,
                lineNumber,
                node.properties.className,
              );
              newTree.push(line);
            }

            // if it's neither the first nor the last line
          } else {
            const children = [newChild];
            const line = createLine(
              children,
              lineNumber,
              node.properties.className,
            );
            newTree.push(line);
          }
        });
        lastLineBreakIndex = index;
      }
    }
    index++;
  }

  if (lastLineBreakIndex !== tree.length - 1) {
    const children = tree.slice(lastLineBreakIndex + 1, tree.length);
    if (children && children.length) {
      const lineNumber = newTree.length + startingLineNumber;
      const line = createLine(children, lineNumber);
      newTree.push(line);
    }
  }

  if (shouldCreateParentElementForLines) {
    return newTree as RefractorNode[];
  }

  // If shouldCreateParentElementForLines was off, we still have a tree structure we need to flatten
  // We have (RefractorNode | RefractorNode[])[] but need RefractorNode[]
  // This seems like a code smell to review
  return newTree.flat(1) as RefractorNode[];
}
