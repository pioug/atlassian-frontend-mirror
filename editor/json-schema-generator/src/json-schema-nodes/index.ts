import type SchemaNode from './schema-node';

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

	addDefinition(name: string, definition: SchemaNode): void {
		this.definitions.set(name, { node: definition, used: false });
	}

	hasDefinition(name: string): boolean {
		return this.definitions.has(name);
	}

	private updateUsed(name: string, value: boolean) {
		if (this.definitions.has(name)) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const def = this.definitions.get(name)!;
			def.used = value;
		}
	}

	markAsUsed(name: string): void {
		this.updateUsed(name, true);
	}

	markAsUnused(name: string): void {
		this.updateUsed(name, false);
	}

	toJSON(): {
		$ref: string;
		$schema: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		definitions: any;
		description: string;
	} {
		if (!this.definitions.has(this.root)) {
			throw new Error(`${this.root} not found in the added definitions`);
		}
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
