import { Fragment, Schema } from 'prosemirror-model';

import { Serializer } from '../serializer';
import { defaultSchema } from '@atlaskit/adf-schema';
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

    return result.join('\n').replace(/\n+/g, '\n');
  }

  static fromSchema(schema: Schema = defaultSchema): TextSerializer {
    return new TextSerializer(schema);
  }
}
