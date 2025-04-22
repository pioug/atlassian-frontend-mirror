import React, { createContext } from 'react';
import type { Position } from './types';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import type { AnnotationId, AnnotationMarkStates } from '@atlaskit/adf-schema';
import { fg } from '@atlaskit/platform-feature-flags';

export type AnnotationsDraftContextWrapperChildrenProps = {
	applyAnnotationDraftAt: (position: Position) => void;
	clearAnnotationDraft: () => void;
};

type RenderCallbackType = (
	props: React.PropsWithChildren<AnnotationsDraftContextWrapperChildrenProps>,
) => React.ReactNode;

type Props = {
	setDraftRange: () => void;
	clearDraftRange: () => void;
	children: RenderCallbackType;
	isNestedRender?: boolean;
};

type State = {
	position: Position | null;
};

export const AnnotationsDraftContext = createContext<Position | null>(null);
export const ProvidersContext = createContext<AnnotationProviders | null | undefined>(null);
export const InlineCommentsStateContext = createContext<
	Record<AnnotationId, AnnotationMarkStates | null>
>({});

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class AnnotationsDraftContextWrapper extends React.Component<Props, State> {
	state = {
		position: null,
	};

	render() {
		const { children, isNestedRender } = this.props;
		const { position } = this.state;
		const applyAnnotationDraftAt = this.applyAnnotationDraftAt;
		const clearAnnotationDraft = this.clearAnnotationDraft;

		/*
		 * If this is a nested render, we do not provide the draft context
		 * because it has already been provided higher up the component tree
		 * and we need the original context to create draft annotations on extensions.
		 */
		return isNestedRender && fg('confluence_frontend_fix_extension_draft_annotation') ? (
			<span data-testid="context-wrapper-without-provider">
				{children({ applyAnnotationDraftAt, clearAnnotationDraft })}
			</span>
		) : (
			<AnnotationsDraftContext.Provider value={position}>
				{children({ applyAnnotationDraftAt, clearAnnotationDraft })}
			</AnnotationsDraftContext.Provider>
		);
	}

	applyAnnotationDraftAt = (nextPosition: Position) => {
		const { setDraftRange } = this.props;

		// Set the draft range to preserve it downstream
		setDraftRange();

		// We need to support a new draft being made while one exists and overwrite it
		// Set the document position for the newly created draft
		this.setState({
			position: nextPosition,
		});
	};

	clearAnnotationDraft = () => {
		const { clearDraftRange } = this.props;

		// Clear the draft range
		clearDraftRange();

		// Clear the draft position in the document
		this.setState({
			position: null,
		});
	};
}
