export const isDOMElement = (maybeNode: unknown): maybeNode is Element =>
  maybeNode instanceof Node && maybeNode.nodeType === Node.ELEMENT_NODE;
