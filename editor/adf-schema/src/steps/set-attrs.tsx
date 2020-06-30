import { Mappable, Step, StepResult } from 'prosemirror-transform';
import {
  Node as ProseMirrorNode,
  Slice,
  Fragment,
  Schema,
} from 'prosemirror-model';

/**
 * For more context on what this is about:
 * @see https://discuss.prosemirror.net/t/preventing-image-placeholder-replacement-from-being-undone/1394
 */
export class SetAttrsStep extends Step {
  pos: number;
  attrs: object;

  constructor(pos: number, attrs: object) {
    super();
    this.pos = pos;
    this.attrs = attrs;
  }

  apply(doc: ProseMirrorNode) {
    let target = doc.nodeAt(this.pos);
    if (!target) {
      return StepResult.fail('No node at given position');
    }

    const attrs = {
      ...(target.attrs || {}),
      ...(this.attrs || {}),
    };

    let newNode = target.type.create(attrs, Fragment.empty, target.marks);
    let slice = new Slice(Fragment.from(newNode), 0, target.isLeaf ? 0 : 1);
    return StepResult.fromReplace(doc, this.pos, this.pos + 1, slice);
  }

  invert(doc: ProseMirrorNode) {
    let target = doc.nodeAt(this.pos);
    return new SetAttrsStep(this.pos, target ? target.attrs : {});
  }

  map(mapping: Mappable) {
    let result = mapping.mapResult(this.pos, 1);
    return result.deleted ? null : new SetAttrsStep(result.pos, this.attrs);
  }

  toJSON() {
    return { stepType: 'setAttrs', pos: this.pos, attrs: this.attrs };
  }

  static fromJSON(_schema: Schema, json: { pos?: number; attrs: object }) {
    if (
      typeof json.pos !== 'number' ||
      (json.attrs !== null && typeof json.attrs !== 'object')
    ) {
      throw new RangeError('Invalid input for SetAttrsStep.fromJSON');
    }
    return new SetAttrsStep(json.pos, json.attrs);
  }
}

Step.jsonID('setAttrs', SetAttrsStep);
