import React, { useCallback } from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { EditorProps } from './internal/editor-props-type';
import { MobileAppearance } from '../../ui/AppearanceComponents/Mobile';
import {
  EditorSharedConfigConsumer,
  Editor,
  EditorContent,
  EditorSharedConfig,
} from './Editor';
import { useCreateAnalyticsHandler } from './internal/hooks/use-analytics';
import { ContextAdapter } from '../../nodeviews/context-adapter';

export interface MobileEditorProps extends EditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

export function MobileEditor(
  props: MobileEditorProps & WithAnalyticsEventsProps,
) {
  const { maxHeight, createAnalyticsEvent } = props;
  const handleAnalyticsEvent = useCreateAnalyticsHandler(createAnalyticsEvent);
  const renderWithConfig = useCallback(
    (config: EditorSharedConfig | null) => {
      return (
        <MobileAppearance
          editorView={config && config.editorView}
          maxHeight={maxHeight}
        >
          <EditorContent />
        </MobileAppearance>
      );
    },
    [maxHeight],
  );

  return (
    <ContextAdapter>
      <Editor {...props} onAnalyticsEvent={handleAnalyticsEvent}>
        <EditorSharedConfigConsumer>
          {renderWithConfig}
        </EditorSharedConfigConsumer>
      </Editor>
    </ContextAdapter>
  );
}

MobileEditor.displayName = 'MobileEditor';

export const Mobile = withAnalyticsEvents()(MobileEditor);
