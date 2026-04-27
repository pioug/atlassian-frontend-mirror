import React, { type ComponentType } from 'react';

// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import { fg } from '@atlaskit/platform-feature-flags';

import { withErrorBoundary } from './ui/error-boundary';
import { withIntlProvider } from './ui/intl-provider';
import { JQLEditorReadOnly } from './ui/jql-editor-layout';
import { type JQLEditorUIProps } from './ui/jql-editor/types';
// eslint-disable-next-line import/order
import { type JQLEditorProps } from './ui/types';
// eslint-disable-next-line import/order
import type { Cleanup } from 'react-loosely-lazy/dist/types/cleanup';

const JQLEditor = lazyForPaint<ComponentType<JQLEditorUIProps>>(
	() =>
		import(/* webpackChunkName: "@atlassian/async-jql-editor-ui" */ './ui/jql-editor').then(
			({ default: JQLEditorUI }) => JQLEditorUI,
		),
	{ ssr: false },
);

export const preloadJQLEditor = (): Cleanup => JQLEditor.preload();

export const JQLEditorAsync: (props: JQLEditorProps) => React.JSX.Element = withIntlProvider<JQLEditorProps>(
	withErrorBoundary<JQLEditorUIProps>((props: JQLEditorUIProps) => {
		return (
			<LazySuspense
				fallback={
					<JQLEditorReadOnly
						query={props.query}
						isSearch={!!props.onSearch}
						isCompact={props.isCompact}
						{...(fg('list_lovability_improving_filters') ? { defaultRows: props.defaultRows } : {})}
					/>
				}
			>
				<JQLEditor {...props} />
			</LazySuspense>
		);
	}),
);
