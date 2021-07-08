import { EditorState } from 'prosemirror-state';

type NodeCount = Record<string, number>;
type NodesCount = {
  nodeCount: NodeCount;
  extensionNodeCount: NodeCount;
};

export function countNodes(state: EditorState): NodesCount {
  const nodeCount: NodeCount = {};
  const extensionNodeCount: NodeCount = {};

  const nodeTypes = state.schema.nodes;
  const extensionNodeTypes = [
    nodeTypes.extension?.name,
    nodeTypes.inlineExtension?.name,
    nodeTypes.bodiedExtension?.name,
  ];

  state.doc.descendants((node) => {
    const nodeName = node.type.name;
    if (nodeName in nodeCount) {
      nodeCount[nodeName]++;
    } else {
      nodeCount[nodeName] = 1;
    }

    let extensionNodeName = nodeName;
    if (
      extensionNodeTypes.includes(extensionNodeName) &&
      node.attrs?.extensionType
    ) {
      extensionNodeName = `${node.attrs.extensionType} - ${node.attrs?.extensionKey}`;

      if (extensionNodeName in extensionNodeCount) {
        extensionNodeCount[extensionNodeName]++;
      } else {
        extensionNodeCount[extensionNodeName] = 1;
      }
    }

    return true;
  });

  return {
    nodeCount,
    extensionNodeCount,
  };
}
