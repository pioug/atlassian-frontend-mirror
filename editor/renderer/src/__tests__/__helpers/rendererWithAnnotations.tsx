import React from 'react';
import EventEmitter from 'events';

import type { AnnotationId, DocNode } from '@atlaskit/adf-schema';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import * as annotationAdf from '../__fixtures__/annotation-adf.json';
import * as docWithTable from '../__fixtures__/doc-with-table-adf.json';

import type {
	AnnotationUpdateEventPayloads,
	AnnotationUpdateEvent,
} from '@atlaskit/editor-common/types';
import {
	AnnotationUpdateEmitter,
	type InlineCommentAnnotationProvider,
} from '@atlaskit/editor-common/types';
import Renderer from '../../ui/Renderer';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
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

export function RendererWithAnnotations(): React.JSX.Element {
	return (
		<Renderer
			adfStage={'stage0'}
			document={annotationAdf as unknown as DocNode}
			appearance={'full-page'}
			allowAnnotations={true}
			annotationProvider={{
				inlineComment: annotationInlineCommentProvider,
			}}
			schema={getSchemaBasedOnStage('stage0')}
		/>
	);
}

export function RendererWithTableAndAnnotations(): React.JSX.Element {
	return (
		<Renderer
			adfStage={'stage0'}
			document={docWithTable as unknown as DocNode}
			appearance={'full-page'}
			allowAnnotations={true}
			annotationProvider={{
				inlineComment: annotationInlineCommentProvider,
			}}
			schema={getSchemaBasedOnStage('stage0')}
		/>
	);
}
