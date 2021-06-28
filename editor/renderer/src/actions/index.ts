import {
  JSONTransformer,
  JSONDocNode,
} from '@atlaskit/editor-json-transformer';
import {
  canApplyAnnotationOnRange,
  getAnnotationIdsFromRange,
  AnnotationActionResult,
  AnnotationByMatches,
} from '@atlaskit/editor-common';
import { AnnotationTypes, AnnotationId } from '@atlaskit/adf-schema';
import { Node, Schema, Mark } from 'prosemirror-model';
import { Step, RemoveMarkStep } from 'prosemirror-transform';
import { createAnnotationStep, getPosFromRange } from '../steps';
import {
  AnalyticsEventPayload,
  AnnotationDeleteAEP,
} from '../analytics/events';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../analytics/enums';
import { getIndexMatch } from './matches-utils';

type ActionResult = { step: Step; doc: JSONDocNode } | false;
type Position = { from: number; to: number };
type Annotation = { annotationId: string; annotationType: AnnotationTypes };

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

export type ApplyAnnotation = (
  pos: Position,
  annotation: Annotation,
) => AnnotationActionResult;

export interface AnnotationsRendererActionsOptions {
  isValidAnnotationPosition: (pos: Position) => boolean;
  applyAnnotation: ApplyAnnotation;
  getAnnotationMarks: () => Mark[];
}

export interface PositionRendererActionsOptions {
  getPositionFromRange: (range: Range) => Position | false;
}

export default class RendererActions
  implements
    RendererActionsOptions,
    AnnotationsRendererActionsOptions,
    PositionRendererActionsOptions {
  // This is our psuedo feature flag for now
  // This module can only be used when wrapped with
  // the <RendererContext> component for now.
  private initFromContext: boolean = false;
  private transformer: JSONTransformer;
  private doc?: Node;
  private schema?: Schema;
  // Any kind of refence is allowed
  private ref?: any;
  private onAnalyticsEvent?: (event: AnalyticsEventPayload) => void;

  constructor(initFromContext: boolean = false) {
    this.initFromContext = initFromContext;
    this.transformer = new JSONTransformer();
  }

  //#region private
  _privateRegisterRenderer(
    ref: React.MutableRefObject<null>,
    doc: Node,
    schema: Schema,
    onAnalyticsEvent?: (event: AnalyticsEventPayload) => void,
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
    this.onAnalyticsEvent = onAnalyticsEvent;
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
    if (!this.doc || !this.schema) {
      return false;
    }

    return canApplyAnnotationOnRange({ from, to }, this.doc, this.schema);
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

    if (this.onAnalyticsEvent) {
      const payload: AnnotationDeleteAEP = {
        action: ACTION.DELETED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
      };

      this.onAnalyticsEvent(payload);
    }

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

    return this.applyAnnotation(pos, {
      annotationId,
      annotationType: AnnotationTypes.INLINE_COMMENT,
    });
  }

  isValidAnnotationRange(range: Range) {
    const pos = getPosFromRange(range);
    if (!pos || !this.doc) {
      return false;
    }

    return this._privateValidatePositionsForAnnotation(pos.from, pos.to);
  }

  isValidAnnotationPosition(pos: Position) {
    if (!pos || !this.doc) {
      return false;
    }

    return this._privateValidatePositionsForAnnotation(pos.from, pos.to);
  }

  getPositionFromRange(range: Range): Position | false {
    if (!this.doc || !this.schema) {
      return false;
    }

    return getPosFromRange(range);
  }

  getAnnotationMarks() {
    const { schema, doc } = this;
    if (!schema || !doc) {
      return [];
    }

    const {
      marks: { annotation: annotationMarkType },
    } = schema;

    if (!annotationMarkType) {
      return [];
    }
    const marks: Mark[] = [];

    doc.descendants((node) => {
      const annotationsMark = node.marks.filter(
        (m) => m.type === annotationMarkType,
      );
      if (!annotationsMark || !annotationsMark.length) {
        return true;
      }

      marks.push(...annotationsMark);

      return false;
    });

    const uniqueMarks: Map<AnnotationId, Mark> = new Map();
    marks.forEach((m) => {
      uniqueMarks.set(m.attrs.id, m);
    });

    return Array.from(uniqueMarks.values());
  }

  getAnnotationsByPosition(range: Range): string[] {
    if (!this.doc || !this.schema) {
      return [];
    }

    const pos = getPosFromRange(range);
    if (!pos || !this.doc) {
      return [];
    }
    return getAnnotationIdsFromRange(pos, this.doc, this.schema);
  }

  applyAnnotation(
    pos: Position,
    annotation: Annotation,
  ): AnnotationActionResult {
    if (!this.doc || !pos || !this.schema) {
      return false;
    }
    const { from, to } = pos;
    const { annotationId, annotationType } = annotation;

    const step = createAnnotationStep(from, to, {
      annotationId,
      annotationType,
      schema: this.schema,
    });

    const { doc, failed } = step.apply(this.doc);

    if (failed || !doc) {
      return false;
    }

    const originalSelection = doc.textBetween(from, to);
    const { numMatches, matchIndex } = getIndexMatch(
      this.doc,
      this.schema,
      originalSelection,
      from,
    );

    return {
      step,
      doc: this.transformer.encode(doc),
      originalSelection,
      numMatches,
      matchIndex,
    };
  }

  generateAnnotationIndexMatch(pos: Position): AnnotationByMatches | false {
    if (!this.doc || !pos || !this.schema) {
      return false;
    }
    const { from, to } = pos;
    const originalSelection = this.doc.textBetween(from, to);
    const { numMatches, matchIndex } = getIndexMatch(
      this.doc,
      this.schema,
      originalSelection,
      from,
    );

    return {
      originalSelection,
      numMatches,
      matchIndex,
    };
  }
}
