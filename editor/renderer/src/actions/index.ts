import {
  JSONTransformer,
  JSONDocNode,
} from '@atlaskit/editor-json-transformer';
import { Node, Schema } from 'prosemirror-model';
import { Step, RemoveMarkStep } from 'prosemirror-transform';
import { createAnnotationStep, getPosFromRange } from '../steps';

type ActionResult = { step: Step; doc: JSONDocNode } | false;
export interface RendererActionsOptions {
  annotate: (
    range: Range,
    annotationId: string,
    annotationType: 'inlineComment',
  ) => ActionResult;
  deleteAnnotation: (
    annotationId: string,
    annotationType: 'inlineComment',
  ) => ActionResult;
  isValidAnnotationRange: (range: Range) => boolean;
}

export default class RendererActions implements RendererActionsOptions {
  // This is our psuedo feature flag for now
  // This module can only be used when wrapped with
  // the <RendererContext> component for now.
  private initFromContext: boolean = false;
  private transformer: JSONTransformer;
  private doc?: Node;
  private schema?: Schema;
  // Any kind of refence is allowed
  private ref?: any;

  constructor(initFromContext: boolean = false) {
    this.initFromContext = initFromContext;
    this.transformer = new JSONTransformer();
  }

  //#region private
  _privateRegisterRenderer(
    ref: React.MutableRefObject<null>,
    doc: Node,
    schema: Schema,
  ): void {
    if (!this.initFromContext) {
      return;
    } else if (!this.ref) {
      this.ref = ref;
    } else if (this.ref !== ref) {
      throw new Error(
        "Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
      );
    }
    this.doc = doc;
    this.schema = schema;
  }

  _privateUnregisterRenderer(): void {
    this.doc = undefined;
    this.ref = undefined;
    this.schema = undefined;
  }

  /**
   * Validate whether we can create an annotation between two positions
   */
  _privateValidatePositionsForAnnotation(from: number, to: number): boolean {
    if (!this.doc) {
      return false;
    }

    let isAllowed = true;
    this.doc.nodesBetween(from, to, node => {
      // we don't allow annotating inline nodes other than text
      if (node && node.isInline && !node.isText) {
        isAllowed = false;
      }
    });

    return isAllowed;
  }
  //#endregion

  deleteAnnotation(annotationId: string, annotationType: 'inlineComment') {
    if (!this.doc || !this.schema || !this.schema.marks.annotation) {
      return false;
    }

    const mark = this.schema.marks.annotation.create({
      id: annotationId,
      annotationType,
    });

    let from: number | undefined;
    let to: number | undefined;

    this.doc.descendants((node, pos) => {
      const found = mark.isInSet(node.marks);
      if (found && !from) {
        // Set both here incase it only spans one node.
        from = pos;
        to = pos + node.nodeSize;
      } else if (found && from) {
        // If the mark spans multiple nodes,
        // we'll keep setting the end until no longer found.
        to = pos + node.nodeSize;
      }
      return true;
    });

    if (from === undefined || to === undefined) {
      return false;
    }

    const step = new RemoveMarkStep(from, to, mark);
    const { doc, failed } = step.apply(this.doc);

    if (!failed && doc) {
      return {
        step,
        doc: this.transformer.encode(doc),
      };
    }

    return false;
  }

  annotate(
    range: Range,
    annotationId: string,
    annotationType: 'inlineComment',
  ) {
    if (!this.doc || !this.schema || !this.schema.marks.annotation) {
      return false;
    }

    const pos = getPosFromRange(range);
    if (!pos) {
      return false;
    }

    const { from, to } = pos;
    const validPositions = this._privateValidatePositionsForAnnotation(
      from,
      to,
    );
    if (!validPositions) {
      return false;
    }

    const step = createAnnotationStep(from, to, {
      annotationId,
      annotationType,
      schema: this.schema,
    });

    if (!step) {
      return false;
    }

    const { doc, failed } = step.apply(this.doc);

    if (!failed && doc) {
      return {
        step,
        doc: this.transformer.encode(doc),
      };
    }

    return false;
  }

  isValidAnnotationRange(range: Range) {
    const pos = getPosFromRange(range);
    if (!pos || !this.doc) {
      return false;
    }

    return this._privateValidatePositionsForAnnotation(pos.from, pos.to);
  }
}
