import { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';
import { measureRender } from '@atlaskit/editor-common';
import { measurements } from '@atlaskit/editor-core';

type TotalNodeSizeAndNodes = {
  totalNodeSize: number;
  nodes: string;
};

class JSONNodeQueue {
  nodes: Array<JSONNode> = [];

  enqueue(node: JSONNode) {
    this.nodes.push(node);
  }

  dequeue() {
    return this.nodes.shift()!;
  }

  front() {
    return this.nodes[0];
  }

  isEmpty() {
    return this.nodes.length === 0;
  }
}

const getTotalNodeSizeAndNodes = (
  docNode: JSONDocNode,
): TotalNodeSizeAndNodes => {
  let totalNodeSize: number = 0;
  let nodes: Record<string, number> = {};

  const queue = new JSONNodeQueue();
  queue.enqueue(docNode);

  while (!queue.isEmpty()) {
    const node = queue.front();

    node.content?.forEach((content) => {
      if (content) {
        queue.enqueue(content);
      }
    });

    const { type } = queue.dequeue();

    if (type !== 'doc') {
      totalNodeSize += 1;
      nodes[type] = (nodes[node.type] || 0) + 1;
    }
  }

  return { totalNodeSize, nodes: JSON.stringify(nodes) };
};

export function measureContentRenderedPerformance(
  docNode: JSONDocNode,
  callback: (
    totalNodeSize: number,
    nodes: string,
    actualRenderingDuration: number,
  ) => void,
) {
  measureRender(
    measurements.PROSEMIRROR_CONTENT_RENDERED,
    (actualRenderingDuration) => {
      const { totalNodeSize, nodes } = getTotalNodeSizeAndNodes(docNode);

      callback(totalNodeSize, nodes, actualRenderingDuration);
    },
  );
}

export function isContentEmpty(content: JSONDocNode) {
  if (content && content.content && content.content.length > 0) {
    return false;
  }
  return true;
}

export class PerformanceMatrices {
  private readonly startTime: number;

  constructor() {
    this.startTime = performance.now();
  }

  get duration(): number {
    return performance.now() - this.startTime;
  }
}
