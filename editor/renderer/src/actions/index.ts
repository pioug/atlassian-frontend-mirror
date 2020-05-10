import {
  JSONTransformer,
  JSONDocNode,
} from '@atlaskit/editor-json-transformer';
import { Node, Schema } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';
import { createAnnotationStep, getPosFromRange } from '../steps';

export interface RendererActionsOptions {
  annotate: (
    range: Range,
    annotationId: string,
    annotationType: 'inlineComment',
  ) =>
    | {
        step: Step;
        doc: JSONDocNode;
      }
    | false;
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
  //#endregion

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

    let isAllowed = true;
    const { from, to } = pos as { from: number; to: number };
    this.doc.nodesBetween(from, to, node => {
      // we don't allow annotating inline nodes other than text
      if (node && node.isInline && !node.isText) {
        isAllowed = false;
      }
    });

    if (!isAllowed) {
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
}
