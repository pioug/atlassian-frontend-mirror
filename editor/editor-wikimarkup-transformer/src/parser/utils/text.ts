import { Node as PMNode } from 'prosemirror-model';

/**
 * Check if the node has certain marks
 */
export function hasAnyOfMarks(node: PMNode, types: string[]): boolean {
  return (
    node.marks.findIndex(
      m => types.findIndex(t => m.type.name === t) !== -1,
    ) !== -1
  );
}

export function isDigit(value: string) {
  return !!value.match(/^\d$/);
}

export function isBlank(value: string | null) {
  return value === null || value.trim() === '';
}

export function isNotBlank(value: string | null) {
  return !isBlank(value);
}

export class StringBuffer {
  constructor(private buffer: string = '') {}

  indexOf(value: string): number {
    return this.buffer.indexOf(value);
  }

  lastIndexOf(value: string): number {
    return this.buffer.lastIndexOf(value);
  }

  charAt(index: number): string {
    return this.buffer.charAt(index);
  }

  length(): number {
    return this.buffer.length;
  }

  delete(start: number, end: number) {
    this.buffer = this.buffer.substring(0, start) + this.buffer.substring(end);
  }

  append(value: string) {
    this.buffer += value;
  }

  substring(start: number, end?: number) {
    return this.buffer.substring(start, end);
  }

  deleteCharAt(index: number) {
    this.delete(index, index + 1);
  }

  toString() {
    return this.buffer;
  }
}
