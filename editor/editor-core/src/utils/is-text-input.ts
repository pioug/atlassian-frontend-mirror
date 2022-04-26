import { Transaction, ReadonlyTransaction } from 'prosemirror-state';
import { ReplaceStep } from 'prosemirror-transform';
import { Slice } from 'prosemirror-model';

interface DetailedReplaceStep extends ReplaceStep {
  from: number;
  to: number;
  slice: Slice;
}

export const isTextInput = (tr: Transaction | ReadonlyTransaction): boolean => {
  const [step] = tr.steps;
  if (!step || !(step instanceof ReplaceStep)) {
    return false;
  }

  const {
    slice: { content },
    from,
    to,
  } = step as DetailedReplaceStep;
  const char = content.firstChild;

  return (
    from === to &&
    content.childCount === 1 &&
    !!char &&
    !!char.text &&
    char.text.length === 1
  );
};
