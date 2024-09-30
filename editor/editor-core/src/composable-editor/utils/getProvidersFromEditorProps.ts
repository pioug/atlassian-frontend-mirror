import type { Providers } from '@atlaskit/editor-common/provider-factory';

import type { EditorProps } from '../../types/editor-props';

type Complete<T> = {
	[P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
};

type EditorProviderProps = Pick<
	EditorProps,
	| 'autoformattingProvider'
	| 'emojiProvider'
	| 'mentionProvider'
	| 'taskDecisionProvider'
	| 'contextIdentifierProvider'
	| 'searchProvider'
	| 'macroProvider'
	| 'activityProvider'
	| 'collabEdit'
	| 'collabEditProvider'
	| 'presenceProvider'
	| 'legacyImageUploadProvider'
>;

type RequiredProviders = Complete<
	Omit<
		Providers,
		| 'reactionsStore'
		| 'profilecardProvider'
		| 'extensionProvider'
		| 'quickInsertProvider'
		| 'cardProvider'
		| 'mediaProvider'
	>
>;

export default function getProvidersFromEditorProps({
	autoformattingProvider,
	emojiProvider,
	mentionProvider,
	legacyImageUploadProvider,
	taskDecisionProvider,
	contextIdentifierProvider,
	searchProvider,
	macroProvider,
	activityProvider,
	collabEdit,
	collabEditProvider,
	presenceProvider,
}: EditorProviderProps): RequiredProviders {
	return {
		emojiProvider: emojiProvider,
		mentionProvider: mentionProvider,
		autoformattingProvider: autoformattingProvider,
		activityProvider: activityProvider,
		imageUploadProvider: legacyImageUploadProvider,
		taskDecisionProvider: taskDecisionProvider,
		contextIdentifierProvider: contextIdentifierProvider,
		searchProvider: searchProvider,
		presenceProvider: presenceProvider,
		macroProvider: macroProvider,
		collabEditProvider: collabEdit?.provider ? collabEdit.provider : collabEditProvider,
	};
}
