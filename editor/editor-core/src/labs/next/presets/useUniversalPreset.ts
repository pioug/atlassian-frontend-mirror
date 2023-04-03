import { useLayoutEffect, useState } from 'react';
import { EditorProps } from '../../../types/editor-props';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { usePreviousState } from '@atlaskit/editor-common/hooks';
import { createPreset } from '../../../create-editor/create-plugins-list';
import { shouldRecreatePreset } from '../../../create-editor/preset-utils';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';

interface PresetProps {
  props: EditorProps;
}

export default function useUniversalPreset({ props }: PresetProps) {
  const { createAnalyticsEvent } = useAnalyticsEvents();
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
    setPreset(createPreset(props, previousEditorProps, createAnalyticsEvent));
  }, [props, previousEditorProps, createAnalyticsEvent]);
  return preset;
}
