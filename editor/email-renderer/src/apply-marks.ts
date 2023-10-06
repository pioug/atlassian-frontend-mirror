import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { MetaDataContext } from './interfaces';
import { markSerializers } from './mark-serializers';

export const applyMarks = (
  marks: readonly Mark[],
  text: string,
  context?: MetaDataContext,
): string => {
  let output = text;
  for (const mark of marks) {
    // ignore marks with unknown type
    if (markSerializers[mark.type.name]) {
      output = markSerializers[mark.type.name]({ mark, text: output, context });
    }
  }

  return output;
};
