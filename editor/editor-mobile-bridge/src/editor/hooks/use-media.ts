import { useMemo } from 'react';
import MobilePicker from '../MobileMediaPicker';
import { type MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { type EditorProps } from '@atlaskit/editor-core';

export function useMedia(
  mediaProvider: Promise<MediaProvider>,
): EditorProps['media'] {
  return useMemo(() => {
    return {
      customMediaPicker: new MobilePicker(),
      provider: mediaProvider,
      allowMediaSingle: true,
      allowAltTextOnImages: true,
      allowAdvancedToolBarOptions: true,
    };
  }, [mediaProvider]);
}
