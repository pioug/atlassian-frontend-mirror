import { Node as PMNode, Schema, Slice } from 'prosemirror-model';
import {
  ReplaceStep,
  Step,
  StepMap,
  StepResult,
  Mappable,
} from 'prosemirror-transform';

export const stepType = 'editor-linking-meta';
export const invertStepType = 'editor-linking-meta-invert';

export type LinkStepMetadata = {
  /**
   * Editor action performed
   */
  action?: string;
  /**
   * Editor input method that triggered the transaction
   */
  inputMethod?: string;
  /**
   * The applicable card action for this step
   * if is RESOLVE then the undo/redo steps should be considered "updates" of a link
   */
  cardAction?: 'RESOLVE';
  /**
   * Source UI that tiggered this step, if available/applicable
   */
  sourceEvent?: unknown;
};

/**
 * Custom Prosemirror Step to attach metadata about user interactions with links
 * Using a Step means that it will work with prosemirror-history and we get utilise when
 * firing events on history change
 */
export class LinkMetaStep extends Step {
  constructor(
    private pos: number | null,
    private metadata: LinkStepMetadata,
    private isInverted: boolean = false,
  ) {
    super();
  }

  public getMetadata() {
    return this.metadata;
  }

  /**
   * Generate new undo/redo analytics event when step is inverted
   */
  invert() {
    /**
     * Omit sourceEvent in history
     */
    const { sourceEvent, ...metadata } = this.metadata;
    return new LinkMetaStep(this.pos, metadata, true);
  }

  // Should make no modifications to the doc
  apply(doc: PMNode) {
    return StepResult.ok(doc);
  }

  map(mapping: Mappable) {
    let newPos = this.pos;
    if (typeof newPos === 'number') {
      newPos = mapping.map(newPos);
    }
    // Return the same events, this step will never be removed
    return new LinkMetaStep(newPos, this.metadata, this.isInverted);
  }
  getMap() {
    return new StepMap([this.pos || 0, 0, 0]);
  }

  // Return null to avoid merging events
  merge() {
    return null;
  }

  toJSON() {
    // When serialized we should create a noop Replace step
    return {
      stepType: 'replace',
      from: 0,
      to: 0,
    };
  }

  static fromJSON<S extends Schema = any>(_: S, __: { [key: string]: any }) {
    // This is a "local custom step" once serialized
    // we need to transform it in a no-operation action
    return new ReplaceStep(0, 0, Slice.empty);
  }
}

/** Register this step with Prosemirror */
Step.jsonID(stepType, LinkMetaStep);
