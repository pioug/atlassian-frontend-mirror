import { Node } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';
import { ADDoc } from '@atlaskit/editor-common/validator';

export interface RendererActionsOptions {
  annotate: (
    range: Range,
    annotationId: string,
    annotationType: 'inlineComment',
  ) =>
    | {
        step: Step;
        doc?: ADDoc;
      }
    | undefined;
}

export default class RendererActions implements RendererActionsOptions {
  // This is our psuedo feature flag for now
  // This module can only be used when wrapped with
  // the <RendererContext> component for now.
  private initFromContext: boolean = false;
  private doc?: Node;
  // Any kind of refence is allowed
  private ref?: any;

  constructor(initFromContext: boolean = false) {
    this.initFromContext = initFromContext;
  }

  //#region private
  _privateRegisterRenderer(ref: any, doc: Node): void {
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
  }

  _privateUnregisterRenderer(): void {
    this.doc = undefined;
    this.ref = undefined;
  }
  //#endregion

  annotate(
    range: Range,
    annotationId: string,
    annotationType: 'inlineComment',
  ) {
    if (!this.doc) {
      return undefined;
    }

    return undefined;
  }
}
