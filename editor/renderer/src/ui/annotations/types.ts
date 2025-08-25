import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';

export enum InsertDraftPosition {
	AROUND_TEXT = 'AROUND_TEXT',
	START = 'START',
	END = 'END',
	INSIDE = 'INSIDE',
}

export type Position = { from: number; to: number };

export type AnnotationsWrapperProps = React.PropsWithChildren<{
	/**
	 * This is set internally -- and should not be set by consumers.
	 */
	_startPos?: number;
	adfDocument: JSONDocNode;
	annotationProvider: AnnotationProviders | null | undefined;
	/**
	 * This is set (by consumers) for nested renderers when they are
	 * rendering bodied extension content.
	 */
	isNestedRender: boolean;
	onLoadComplete?: ({
		numberOfUnresolvedInlineComments,
	}: {
		numberOfUnresolvedInlineComments: number;
	}) => void;
	rendererRef: React.RefObject<HTMLDivElement>;
}>;

export type TextPosition = {
	end: number;
	start: number;
};
