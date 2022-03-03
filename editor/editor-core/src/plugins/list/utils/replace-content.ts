import { ResolvedPos } from 'prosemirror-model';
import { ReplaceAroundStep, ReplaceStep, Step } from 'prosemirror-transform';

type Params = {
  insertPosition: number;
  $target: ResolvedPos;
};
export const moveTargetIntoList = ({
  insertPosition,
  $target,
}: Params): Step => {
  // take the text content of the paragraph and insert after the paragraph up until before the the cut
  const from = insertPosition;
  const to = $target.pos + ($target.nodeAfter?.nodeSize || 0); //$cut.pos + $cut.nodeAfter.nodeSize;
  const gapFrom = $target.posAtIndex(0, $target.depth + 1); // start pos of the child
  const gapTo = $target.doc.resolve(gapFrom).end(); // end pos of the paragraph

  if (gapTo - gapFrom === 0) {
    return new ReplaceStep(
      from,
      to,
      $target.doc.slice(insertPosition, $target.pos),
    );
  }

  const step: ReplaceAroundStep = new ReplaceAroundStep(
    from,
    to,
    gapFrom,
    gapTo,
    $target.doc.slice(insertPosition, $target.pos),
    0,
    true,
  );

  return step;
};
