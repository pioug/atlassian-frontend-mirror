import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import {
  ReplaceAroundStep,
  ReplaceStep,
} from '@atlaskit/editor-prosemirror/transform';

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

export const wrapTaskListIntoListAbove = (
  tr: Transaction,
  taskListStart: number,
  previousListStart: number,
) => {
  const $taskListStart = tr.doc.resolve(taskListStart);

  /* Safecheck: if not passed a taskList node, return */
  if ($taskListStart.node().type.name !== 'taskList') {
    return;
  }

  const $previousListStart = tr.doc.resolve(previousListStart);
  const taskList = tr.doc.slice($taskListStart.pos, $taskListStart.after());
  const frag = Fragment.from(taskList.content);

  /*
    Delete the existing taskList at the same level and insert inside above list provided
    1. To delete the tasklist, we need wrapping positions before and after it to completely delete it.
      $taskListStart.after() would give us closing position enclosed by node itself using it would remove only the contents of taskList
      so we add 1 to it to get the position after the taskList node and completly remove it.
    2. Inserting the taskList at the end() position safe inserts the taskList to next available position which would lead to deleting and inserting taskList at same place.
      Reason: $previousListStart.end() gives us end position of listItem but we can add content only inside listItem not at same level
      so we subtract 1 to get the position inside the list item and insert the TaskList same level as paragraph/content inside listItem.
  */
  tr.delete($taskListStart.before(), $taskListStart.after() + 1);
  tr.insert($previousListStart.end() - 1, frag);
};
