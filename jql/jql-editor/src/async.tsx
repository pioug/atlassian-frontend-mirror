import React, { type ComponentType } from 'react';

import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import { withErrorBoundary } from './ui/error-boundary';
import { withIntlProvider } from './ui/intl-provider';
import { JQLEditorReadOnly } from './ui/jql-editor-layout';
import { type JQLEditorUIProps } from './ui/jql-editor/types';
import { type JQLEditorProps } from './ui/types';

const JQLEditor = lazyForPaint<ComponentType<JQLEditorUIProps>>(
  () =>
    import(/* webpackChunkName: "async-jql-editor" */ './ui/jql-editor').then(
      ({ default: JQLEditorUI }) => JQLEditorUI,
    ),
  { ssr: false },
);

export const JQLEditorAsync = withIntlProvider<JQLEditorProps>(
  withErrorBoundary<JQLEditorUIProps>((props: JQLEditorUIProps) => {
    return (
      <LazySuspense
        fallback={
          <JQLEditorReadOnly
            query={props.query}
            isSearch={!!props.onSearch}
            isCompact={props.isCompact}
          />
        }
      >
        <JQLEditor {...props} />
      </LazySuspense>
    );
  }),
);
