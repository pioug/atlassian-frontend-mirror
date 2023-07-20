import SchemaNode from './schema-node';
export { default as StringSchemaNode } from './string-schema-node';
export { default as ArraySchemaNode } from './array-schema-node';
export { default as ObjectSchemaNode } from './object-schema-node';
export { default as EnumSchemaNode } from './enum-schema-node';
export { default as ConstSchemaNode } from './const-schema-node';
export { default as PrimitiveSchemaNode } from './primitive-schema-node';
export { default as RefSchemaNode } from './ref-schema-node';
export { default as EmptySchemaNode } from './empty-schema-node';
export { default as AnyOfSchemaNode } from './any-of-schema-node';
export { default as AllOfSchemaNode } from './all-of-schema-node';

export type JSONSchemaVersion = 'draft-04';

export default class JSONSchemaNode {
  version: JSONSchemaVersion;
  description: string;
  root: string;
  definitions: Map<string, { node: SchemaNode; used: boolean }> = new Map();

  constructor(version: JSONSchemaVersion, description: string, root: string) {
    this.version = version;
    this.description = description;
    this.root = root;
  }

  addDefinition(name: string, definition: SchemaNode) {
    this.definitions.set(name, { node: definition, used: false });
  }

  hasDefinition(name: string) {
    return this.definitions.has(name);
  }

  private updateUsed(name: string, value: boolean) {
    if (this.definitions.has(name)) {
      const def = this.definitions.get(name)!;
      def.used = value;
    }
  }

  markAsUsed(name: string) {
    this.updateUsed(name, true);
  }

  markAsUnused(name: string) {
    this.updateUsed(name, false);
  }

  toJSON() {
    if (!this.definitions.has(this.root)) {
      throw new Error(`${this.root} not found in the added definitions`);
    }
    const definitions: any = {};
    for (const [k, { node, used }] of this.definitions) {
      if (used) {
        definitions[k] = node;
      }
    }

    return {
      $schema: `http://json-schema.org/${this.version}/schema#`,
      description: this.description,
      $ref: `#/definitions/${this.root}`,
      definitions,
    };
  }
}

export { SchemaNode };
