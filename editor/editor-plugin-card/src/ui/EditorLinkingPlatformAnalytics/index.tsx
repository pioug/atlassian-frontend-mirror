import React from 'react';

import {
	EditorSmartCardProvider,
	EditorSmartCardProviderValueGuard,
} from '@atlaskit/link-provider';

import { EditorAnalyticsContext } from '../EditorAnalyticsContext';

import type { AnalyticsBindingsProps } from './common';
import { DatasourceEventsBinding } from './DatasourceEvents';
import { LinkEventsBinding } from './LinkEvents';

// eslint-disable-next-line @repo/internal/react/no-class-components
export class EditorLinkingPlatformAnalytics extends React.PureComponent<AnalyticsBindingsProps> {
	render() {
		return (
			<EditorSmartCardProvider>
				<EditorSmartCardProviderValueGuard>
					<EditorAnalyticsContext editorView={this.props.editorView}>
						<LinkEventsBinding
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...this.props}
						/>
						<DatasourceEventsBinding
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...this.props}
						/>
					</EditorAnalyticsContext>
				</EditorSmartCardProviderValueGuard>
			</EditorSmartCardProvider>
		);
	}
}
