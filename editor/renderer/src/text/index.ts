import { type Fragment, type Schema } from '@atlaskit/editor-prosemirror/model';

import { type Serializer } from '../serializer';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { reduce } from './nodes';

export default class TextSerializer implements Serializer<string> {
	constructor(private schema: Schema) {
		this.schema = schema;
	}

	serializeFragment(fragment: Fragment): string {
		const result: string[] = [];

		fragment.forEach((n) => {
			result.push(reduce(n, this.schema));
		});

		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		return result.join('\n').replace(/\n+/g, '\n');
	}

	static fromSchema(schema: Schema = defaultSchema): TextSerializer {
		return new TextSerializer(schema);
	}
}
