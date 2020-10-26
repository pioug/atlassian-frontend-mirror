import { NodeType, Schema } from 'prosemirror-model';

export type TableNodeCache = {
  [key: string]: NodeType;
};

export function tableNodeTypes(schema: Schema): TableNodeCache {
  let result: TableNodeCache = schema.cached.tableNodeTypes;

  if (!result) {
    result = {};
    // eslint-disable-next-line no-param-reassign
    schema.cached.tableNodeTypes = result;
    // eslint-disable-next-line guard-for-in
    for (const name in schema.nodes) {
      const type = schema.nodes[name] as NodeType;
      const role = type.spec.tableRole as string;
      if (role) {
        result[role] = type;
      }
    }
  }

  return result;
}
