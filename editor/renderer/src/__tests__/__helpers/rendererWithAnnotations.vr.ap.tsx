import EventEmitter from 'events';

import React, { useRef } from 'react';

import type { AnnotationId } from '@atlaskit/adf-schema/annotation';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import type { DocNode } from '@atlaskit/adf-schema/doc';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { InlineCommentAnnotationProvider } from '@atlaskit/editor-common/types/annotation';
import type {
	AnnotationUpdateEvent,
	AnnotationUpdateEventPayloads,
} from '@atlaskit/editor-common/types/emitter';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/types/emitter';
import { RendererActionsContext } from '@atlaskit/renderer/actions/renderer-actions-context';

import { Renderer } from '../../entry-points/renderer-default';
import { AnnotationsWrapper } from '../../ui/annotations';
import * as annotationAdf from '../__fixtures__/annotation-adf.json';
import * as docWithTable from '../__fixtures__/doc-with-table-adf.json';
import { SelectionInlineComponentMock } from './annotationSelectionComponentMock';

type Callback<T> = T extends keyof AnnotationUpdateEventPayloads
	? (payload: AnnotationUpdateEventPayloads[T]) => void
	: () => void;

const emitter: EventEmitter = new EventEmitter();
class AnnotationUpdateEmitterMock extends AnnotationUpdateEmitter {
	emit<T extends keyof AnnotationUpdateEventPayloads>(
		event: T,
		params: AnnotationUpdateEventPayloads[T],
	): boolean;
	emit<T extends AnnotationUpdateEvent>(event: T): boolean;
	emit(event: AnnotationUpdateEvent, params?: never): boolean {
		if (typeof params === 'undefined') {
			return emitter.emit(event);
		}

		return emitter.emit(event, params);
	}

	on<T extends AnnotationUpdateEvent>(event: T, listener: Callback<T>): void;
	on(event: string, listener: (payload?: any) => void): EventEmitter {
		return emitter.on(event, listener);
	}

	off<T extends AnnotationUpdateEvent>(event: T, listener: Callback<T>): void;
	off(event: string, listener: (payload?: any) => void): EventEmitter {
		return emitter.removeListener(event, listener);
	}

	listeners(event: AnnotationUpdateEvent) {
		return emitter.listeners(event);
	}
}

export const annotationInlineCommentProvider: InlineCommentAnnotationProvider = {
	getState: (annotationIds: AnnotationId[]) => {
		const x = annotationIds.map((id) => ({
			id,
			annotationType: AnnotationTypes.INLINE_COMMENT,
			state: AnnotationMarkStates.ACTIVE,
		}));

		return Promise.resolve(x);
	},

	allowDraftMode: true,
	selectionComponent: SelectionInlineComponentMock(() => {}),
	updateSubscriber: new AnnotationUpdateEmitterMock(),
};

// The default `ui/Renderer` export is the nested variant: it renders every block as its own
// `.ak-renderer-document` without `data-renderer-start-pos`, so a selection never resolves to a
// document position and the Comment button stays disabled. Compose the top-level renderer instead.
function AnnotatedRenderer({ doc }: { doc: DocNode }): React.JSX.Element {
	const rendererRef = useRef<HTMLDivElement>(null);
	const annotationProvider = { inlineComment: annotationInlineCommentProvider };

	return (
		<RendererActionsContext>
			<AnnotationsWrapper
				rendererRef={rendererRef}
				adfDocument={doc}
				annotationProvider={annotationProvider}
				isNestedRender={false}
			>
				<Renderer
					innerRef={rendererRef}
					adfStage={'stage0'}
					document={doc}
					appearance={'full-page'}
					allowAnnotations={true}
					// Renderer reads `allowDraftMode` from its own prop to render draft marks.
					annotationProvider={annotationProvider}
					schema={getSchemaBasedOnStage('stage0')}
				/>
			</AnnotationsWrapper>
		</RendererActionsContext>
	);
}

export function RendererWithAnnotations(): React.JSX.Element {
	return <AnnotatedRenderer doc={annotationAdf as unknown as DocNode} />;
}

export function RendererWithTableAndAnnotations(): React.JSX.Element {
	return <AnnotatedRenderer doc={docWithTable as unknown as DocNode} />;
}
