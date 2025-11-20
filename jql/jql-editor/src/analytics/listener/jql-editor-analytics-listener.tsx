/**
 * Adapted from https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/analytics/analytics-listeners/src/fabric/FabricEditorListener.tsx
 * In future if this package is migrated into the Atlassian Frontend repo, then this code and related logic should be
 * moved into @atlaskit/analytics-listeners.
 */

import React, { type ReactNode } from 'react';

import { AnalyticsListener, type UIAnalyticsEventHandler } from '@atlaskit/analytics-next';
import { ANALYTICS_CHANNEL } from '@atlaskit/jql-editor-common';

import { handleEvent } from './handle-event';
import Logger from './helpers/logger';
import { type AnalyticsWebClient } from './types';

export type ListenerProps = {
	children?: ReactNode;
	client?: AnalyticsWebClient | Promise<AnalyticsWebClient>;
	logLevel?: number;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class JQLEditorAnalyticsListener extends React.Component<ListenerProps> {
	logger: Logger;

	constructor(props: ListenerProps) {
		super(props);

		this.logger = new Logger({ logLevel: props.logLevel });
	}

	handleEventWrapper: UIAnalyticsEventHandler = (event) => {
		handleEvent(event, this.logger, this.props.client);
	};

	render(): React.JSX.Element {
		return (
			<AnalyticsListener onEvent={this.handleEventWrapper} channel={ANALYTICS_CHANNEL}>
				{this.props.children}
			</AnalyticsListener>
		);
	}
}
