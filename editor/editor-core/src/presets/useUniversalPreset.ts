import { useLayoutEffect, useState } from 'react';
import type { EditorProps } from '../types/editor-props';

import { usePreviousState } from '@atlaskit/editor-common/hooks';
import { createPreset } from '../create-editor/create-preset';
import { shouldRecreatePreset } from '../create-editor/preset-utils';
import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';

interface PresetProps {
  props: EditorProps;
}

export default function useUniversalPreset({ props }: PresetProps) {
  const previousEditorProps = usePreviousState(props);
  const [preset, setPreset] = useState<EditorPresetBuilder<any, any>>(() =>
    createPreset(props, previousEditorProps),
  );
  useLayoutEffect(() => {
    if (!previousEditorProps) {
      return;
    }

    const recreate = shouldRecreatePreset(previousEditorProps, props);

    if (!recreate) {
      return;
    }
    setPreset(createPreset(props, previousEditorProps));
  }, [props, previousEditorProps]);
  return preset;
}
