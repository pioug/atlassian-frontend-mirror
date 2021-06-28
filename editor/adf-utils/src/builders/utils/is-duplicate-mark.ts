export function isDuplicateMark(node: { marks?: Array<any> }, type: string) {
  if (node.marks && node.marks.some((mark) => mark.type === type)) {
    return true;
  }
  return false;
}

export function duplicateMarkError(node: { marks?: Array<any> }, type: string) {
  return `Mark with the same name '${type}' already exists on a node: ${JSON.stringify(
    node,
  )}`;
}
