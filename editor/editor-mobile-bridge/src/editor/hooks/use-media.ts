import { useMemo } from 'react';
import MobilePicker from '../MobileMediaPicker';
import { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { EditorProps } from '@atlaskit/editor-core';

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
