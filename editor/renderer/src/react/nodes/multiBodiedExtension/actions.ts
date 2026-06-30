import React from 'react';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { MultiBodiedExtensionActions } from '@atlaskit/editor-common/extensions';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MBEChangeActiveAnalyticsEvent } from '../../../analytics/events';

type ActionsProps = {
	// Allows MBE macro to render bodies; see RFC: https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4843571091/Editor+RFC+064+MultiBodiedExtension+Extensibility
	allowBodiedOverride: boolean;
	children: React.ReactNode;
	childrenContainer: React.ReactNode;
	extensionKey?: string;
	extensionType?: string;
	fireAnalyticsEvent?: (event: MBEChangeActiveAnalyticsEvent) => void;
	updateActiveChild: (index: number) => void;
};

export const useMultiBodiedExtensionActions = ({
	updateActiveChild,
	children,
	allowBodiedOverride,
	childrenContainer,
	extensionKey = '',
	extensionType = '',
	fireAnalyticsEvent,
}: ActionsProps): MultiBodiedExtensionActions => {
	return React.useMemo(() => {
		return {
			changeActive(index: number) {
				if (!Number.isInteger(index)) {
					return false;
				}

				updateActiveChild(index);
				if (fg('confluence_frontend_native_tabs_extension')) {
					fireAnalyticsEvent?.({
						action: ACTION.CHANGE_ACTIVE,
						actionSubject: ACTION_SUBJECT.MULTI_BODIED_EXTENSION,
						attributes: {
							extensionType,
							extensionKey,
						},
						eventType: EVENT_TYPE.TRACK,
					});
				}
				return true;
			},
			addChild() {
				return false;
			},
			getChildrenCount(): number {
				return children && Array.isArray(children) ? children.length : 0;
			},
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			removeChild(_index: number) {
				return false;
			},
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			reorderChildren(_fromIndex: number, _toIndex: number) {
				return false;
			},
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			updateParameters(_parameters): boolean {
				return false;
			},
			getChildren(): never[] {
				return [];
			},
			getChildrenContainer() {
				return allowBodiedOverride ? childrenContainer : null;
			},
		};
	}, [
		updateActiveChild,
		children,
		allowBodiedOverride,
		childrenContainer,
		extensionKey,
		extensionType,
		fireAnalyticsEvent,
	]);
};
