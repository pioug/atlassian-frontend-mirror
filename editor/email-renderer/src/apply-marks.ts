import { Mark } from 'prosemirror-model';
import { markSerializers } from './mark-serializers';

export const applyMarks = (marks: Mark[], text: string): string => {
  let output = text;
  for (const mark of marks) {
    // ignore marks with unknown type
    if (markSerializers[mark.type.name]) {
      output = markSerializers[mark.type.name]({ mark, text: output });
    }
  }

  return output;
};
