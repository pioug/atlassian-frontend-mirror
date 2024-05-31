import React from 'react';

import PropTypes from 'prop-types';

import { EditorAnalyticsContext } from '../EditorAnalyticsContext';

import type { AnalyticsBindingsProps } from './common';
import { DatasourceEventsBinding } from './DatasourceEvents';
import { LinkEventsBinding } from './LinkEvents';

// eslint-disable-next-line @repo/internal/react/no-class-components
export class EditorLinkingPlatformAnalytics extends React.PureComponent<AnalyticsBindingsProps> {
	static contextTypes = {
		contextAdapter: PropTypes.object,
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	context: any;

	render() {
		const cardContext = this.context?.contextAdapter?.card;

		/**
		 * The analytics hook needs to be able to communicate with the card context
		 * If we can't access it, don't mount the event bindings
		 * This effectively entirely disables all tracking behaviour
		 */
		if (!cardContext?.value) {
			return null;
		}
		return (
			<cardContext.Provider value={cardContext.value}>
				<EditorAnalyticsContext editorView={this.props.editorView}>
					<LinkEventsBinding {...this.props} />
					<DatasourceEventsBinding {...this.props} />
				</EditorAnalyticsContext>
			</cardContext.Provider>
		);
	}
}
