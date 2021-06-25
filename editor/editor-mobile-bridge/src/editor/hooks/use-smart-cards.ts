import { useMemo } from 'react';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';
import { EditorProps } from '@atlaskit/editor-core';

export function useSmartCards(
  cardProvider: Promise<CardProvider>,
): EditorProps['smartLinks'] {
  return useMemo(() => {
    return {
      provider: cardProvider,
      allowEmbeds: true,
      allowBlockCards: true,
      allowResizing: false,
    };
  }, [cardProvider]);
}
