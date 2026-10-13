import EventEmitter from 'events';

import React, { useEffect, useState } from 'react';

import type { AnnotationId } from '@atlaskit/adf-schema/annotation';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import type { DocNode } from '@atlaskit/adf-schema/doc';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { InlineCommentAnnotationProvider } from '@atlaskit/editor-common/types/annotation';
import type { AnnotationUpdateEventPayloads } from '@atlaskit/editor-common/types/emitter';
import {
	AnnotationUpdateEmitter,
	AnnotationUpdateEvent,
} from '@atlaskit/editor-common/types/emitter';

import { AnnotationRangeProvider } from '../../ui/annotations/contexts/AnnotationRangeContext';
import Renderer from '../../ui/Renderer';
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

// The default `ui/Renderer` export is the nested variant, which expects an outer range context
// (as in Confluence) and provides none, so selections never reach the selection component.
// It also reads `rendererRef.current` during render, which is still null on the first pass, so a
// second render is needed before the selectionchange listener is attached.
function collectAnnotationIds(node: any, ids: Set<string> = new Set()): Set<string> {
	node?.marks?.forEach((mark: any) => {
		if (mark.type === 'annotation') {
			ids.add(mark.attrs.id);
		}
	});
	node?.content?.forEach((child: any) => collectAnnotationIds(child, ids));
	return ids;
}

function AnnotatedRenderer({ doc }: { doc: DocNode }): React.JSX.Element {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
		// Nested renderers don't load annotation state themselves; the host hydrates it.
		const payload: Record<string, any> = {};
		collectAnnotationIds(doc).forEach((id) => {
			payload[id] = {
				id,
				annotationType: AnnotationTypes.INLINE_COMMENT,
				state: AnnotationMarkStates.ACTIVE,
			};
		});
		annotationInlineCommentProvider.updateSubscriber?.emit(
			AnnotationUpdateEvent.SET_ANNOTATION_STATE,
			payload,
		);
	}, [doc]);

	return (
		<AnnotationRangeProvider>
			<Renderer
				adfStage={'stage0'}
				document={doc}
				appearance={'full-page'}
				allowAnnotations={true}
				truncated={mounted ? false : undefined}
				annotationProvider={{
					inlineComment: annotationInlineCommentProvider,
				}}
				schema={getSchemaBasedOnStage('stage0')}
			/>
		</AnnotationRangeProvider>
	);
}

export function RendererWithAnnotations(): React.JSX.Element {
	return <AnnotatedRenderer doc={annotationAdf as unknown as DocNode} />;
}

export function RendererWithTableAndAnnotations(): React.JSX.Element {
	return <AnnotatedRenderer doc={docWithTable as unknown as DocNode} />;
}
