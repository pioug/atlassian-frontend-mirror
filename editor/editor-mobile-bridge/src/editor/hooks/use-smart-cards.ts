import { useMemo } from 'react';
import { type CardProvider } from '@atlaskit/editor-common/provider-factory';
import { type EditorProps } from '@atlaskit/editor-core';

export function useSmartCards(cardProvider: Promise<CardProvider>): EditorProps['smartLinks'] {
	return useMemo(() => {
		return {
			provider: cardProvider,
			allowEmbeds: true,
			allowBlockCards: true,
			allowResizing: false,
		};
	}, [cardProvider]);
}
