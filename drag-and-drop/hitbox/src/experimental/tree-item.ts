import type { Input, Position } from '@atlaskit/drag-and-drop/types';

export type ItemMode = 'standard' | 'expanded' | 'last-in-group';

export type Instruction =
  | {
      type: 'reorder-above';
      currentLevel: number;
      indentPerLevel: number;
    }
  | {
      type: 'reorder-below';
      currentLevel: number;
      indentPerLevel: number;
    }
  | {
      type: 'make-child';
      currentLevel: number;
      indentPerLevel: number;
    }
  | {
      type: 'reparent';
      currentLevel: number;
      indentPerLevel: number;
      desiredLevel: number;
    }
  | {
      type: 'instruction-blocked';
      desired: Exclude<Instruction, { type: 'instruction-blocked' }>;
    };
// using a symbol so we can guarantee a key with a unique value
const uniqueKey = Symbol('tree-item-instruction');

function getCenter(rect: DOMRect): Position {
  return {
    x: (rect.right + rect.left) / 2,
    y: (rect.bottom + rect.top) / 2,
  };
}

function reorderAndMakeChildArea({
  client,
  borderBox,
  indentPerLevel,
  currentLevel,
}: {
  client: Position;
  borderBox: DOMRect;
  indentPerLevel: number;
  currentLevel: number;
}): Instruction {
  const quarterOfHeight = borderBox.height / 4;

  // In the top 1/4: reorder-above
  // On the line = in the top 1/4 to give this zone a bit more space
  if (client.y <= borderBox.top + quarterOfHeight) {
    return { type: 'reorder-above', indentPerLevel, currentLevel };
  }
  // In the bottom 1/4: reorder-below
  // On the line = in the bottom 1/4 to give this zone a bit more space
  if (client.y >= borderBox.bottom - quarterOfHeight) {
    return { type: 'reorder-below', indentPerLevel, currentLevel };
  }
  return { type: 'make-child', indentPerLevel, currentLevel };
}

function getInstruction({
  element,
  input,
  currentLevel,
  indentPerLevel,
  mode,
}: {
  element: Element;
  input: Input;
  currentLevel: number;
  indentPerLevel: number;
  mode: ItemMode;
}): Instruction {
  const client: Position = {
    x: input.clientX,
    y: input.clientY,
  };

  const borderBox = element.getBoundingClientRect();
  if (mode === 'standard') {
    return reorderAndMakeChildArea({
      borderBox,
      client,
      indentPerLevel,
      currentLevel,
    });
  }
  const center: Position = getCenter(borderBox);

  if (mode === 'expanded') {
    // Note: We are giving a slight preference to actions were the user is moving something down in the tree
    // So 'on the line' in this case will cause a 'make-child' action
    if (client.y < center.y) {
      return { type: 'reorder-above', indentPerLevel, currentLevel };
    }
    return { type: 'make-child', indentPerLevel, currentLevel };
  }

  const visibleInset = indentPerLevel * currentLevel;

  // Before the left edge of the visible item
  if (client.x < borderBox.left + visibleInset) {
    // Above the center: `reorder-above`
    if (client.y < center.y) {
      return { type: 'reorder-above', indentPerLevel, currentLevel };
    }
    // On or below the center: `reparent`
    // On the center = `reparent` as we are giving a slightly bigger hitbox to this
    // action as it is the only place a user can do it
    const rawLevel = (client.x - borderBox.left) / indentPerLevel;
    // We can get sub pixel negative numbers as getBoundingClientRect gives sub-pixel accuracy,
    // where as clientX is rounded to the nearest pixel.
    // Using Math.max() ensures we can never get a negative level
    const desiredLevel = Math.max(Math.floor(rawLevel), 0);
    return {
      type: 'reparent',
      desiredLevel,
      indentPerLevel,
      currentLevel,
    };
  }
  // On the visible item
  return reorderAndMakeChildArea({
    borderBox,
    client,
    indentPerLevel,
    currentLevel,
  });
}

function applyInstructionBlock({
  desired,
  block,
}: {
  desired: Instruction;
  block?: Instruction['type'][];
}): Instruction {
  if (block?.includes(desired.type) && desired.type !== 'instruction-blocked') {
    const blocked: Instruction = {
      type: 'instruction-blocked',
      desired,
    };
    return blocked;
  }

  return desired;
}

export function attachInstruction(
  userData: Record<string | symbol, unknown>,
  {
    block,
    ...rest
  }: Parameters<typeof getInstruction>[0] & {
    block?: Instruction['type'][];
  },
): Record<string | symbol, unknown> {
  const desired: Instruction = getInstruction(rest);
  const instruction: Instruction = applyInstructionBlock({
    desired,
    block,
  });

  return {
    ...userData,
    [uniqueKey]: instruction,
  };
}

export function extractInstruction(
  userData: Record<string | symbol, unknown>,
): Instruction | null {
  return (userData[uniqueKey] as Instruction) ?? null;
}
