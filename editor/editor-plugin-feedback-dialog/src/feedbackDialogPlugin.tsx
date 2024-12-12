import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconFeedback } from '@atlaskit/editor-common/quick-insert';
import type { FeedbackInfo } from '@atlaskit/editor-common/types';

import type { FeedbackDialogPlugin } from './feedbackDialogPluginType';
import loadJiraCollectorDialogScript from './ui/loadJiraCollectorDialogScript';

let showJiraCollectorDialog: () => void;
let feedbackInfoHash: string;
let defaultFeedbackInfo: FeedbackInfo;

const hashFeedbackInfo = (feedbackInfo: FeedbackInfo): string => {
	const { product, packageName, packageVersion, labels } = feedbackInfo;
	return [product, packageName, packageVersion, ...(labels || [])].join('|');
};

export const openFeedbackDialog = async (feedbackInfo?: FeedbackInfo) =>
	// eslint-disable-next-line no-async-promise-executor
	new Promise(async (resolve, reject) => {
		const combinedFeedbackInfo = {
			// default value assignment
			...{
				product: 'n/a',
				labels: [],
				packageName: '',
				packageVersion: '',
				coreVersion: '',
				sessionId: '',
				contentId: '',
				tabId: '',
			},
			...defaultFeedbackInfo,
			...feedbackInfo,
		};
		const newFeedbackInfoHash = hashFeedbackInfo(combinedFeedbackInfo);

		if (!showJiraCollectorDialog || feedbackInfoHash !== newFeedbackInfoHash) {
			try {
				showJiraCollectorDialog = await loadJiraCollectorDialogScript(
					[combinedFeedbackInfo.product, ...combinedFeedbackInfo.labels],
					combinedFeedbackInfo.packageName,
					combinedFeedbackInfo.coreVersion,
					combinedFeedbackInfo.packageVersion,
					combinedFeedbackInfo.sessionId,
					combinedFeedbackInfo.contentId,
					combinedFeedbackInfo.tabId,
				);

				feedbackInfoHash = newFeedbackInfoHash;
			} catch (err) {
				reject(err);
			}
		}

		const timeoutId = window.setTimeout(showJiraCollectorDialog, 0);
		// Return the timoutId for consumers to call clearTimeout if they need to.
		resolve(timeoutId);
	});

export const feedbackDialogPlugin: FeedbackDialogPlugin = ({ config: feedbackInfo, api }) => {
	defaultFeedbackInfo = feedbackInfo ?? {};
	return {
		name: 'feedbackDialog',

		actions: { openFeedbackDialog },

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'feedbackdialog',
					title: formatMessage(messages.feedbackDialog),
					description: formatMessage(messages.feedbackDialogDescription),
					priority: 400,
					keywords: ['bug'],
					icon: () => <IconFeedback />,
					action(insert, state) {
						const tr = insert('');
						openFeedbackDialog(feedbackInfo);

						api?.analytics?.actions.attachAnalyticsEvent({
							action: ACTION.OPENED,
							actionSubject: ACTION_SUBJECT.FEEDBACK_DIALOG,
							attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
							eventType: EVENT_TYPE.UI,
						})(tr);

						return tr;
					},
				},
			],
		},
	};
};
