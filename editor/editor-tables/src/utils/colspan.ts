import { CellAttributes, CellAttributesWithColSpan } from '../types';

export function removeColSpan(
  attrs: CellAttributes,
  pos: number,
  n = 1,
): CellAttributes {
  if (!attrs.colspan) {
    throw new Error('removeColSpan(): attrs.colspan not defined');
  }

  const result = { ...attrs, colspan: attrs.colspan - n };

  if (result.colwidth) {
    result.colwidth = result.colwidth.slice();
    result.colwidth.splice(pos, n);
    if (!result.colwidth.some((w: number) => w > 0)) {
      result.colwidth = undefined;
    }
  }

  return result;
}

export function assertColspan(attrs: CellAttributes) {
  if (typeof attrs.colspan === 'undefined') {
    throw new Error('addColSpan: attrs.colspan is not defined');
  }

  if (
    typeof attrs.colspan !== 'number' ||
    Number.isNaN(attrs.colspan) ||
    attrs.colspan < 1
  ) {
    throw new Error(
      `addColSpan: attrs.colspan must be number >= 1, received: ${attrs.colspan}`,
    );
  }
}

// TODO: replace "addColSpan" from table plugin with this function
export function addColSpan<T extends CellAttributesWithColSpan>(
  attrs: T,
  pos: number,
  n = 1,
): T {
  assertColspan(attrs);

  const result = { ...attrs, colspan: attrs.colspan + n };
  if (result.colwidth) {
    result.colwidth = result.colwidth.slice();
    for (let i = 0; i < n; i++) {
      result.colwidth.splice(pos, 0, 0);
    }
  }

  return result;
}
