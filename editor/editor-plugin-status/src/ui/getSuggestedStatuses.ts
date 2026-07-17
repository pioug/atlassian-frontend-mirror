import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { StatusType } from '../types';

export type SuggestedStatus = StatusType & {
	displayText: string;
};

type SuggestedStatusWithDistance = SuggestedStatus & {
	distance: number;
};

type GetSuggestedStatusesArgs = {
	currentPos: number;
	currentStatus: Pick<StatusType, 'color' | 'localId' | 'text'>;
	doc: PMNode;
	limit?: number;
	shouldUppercaseText?: boolean;
};

export const MAX_SUGGESTED_STATUSES = 7;

const getStatusKey = ({ color, text }: Pick<StatusType, 'color' | 'text'>) =>
	`${color}:${text.trim().toLowerCase()}`;

const getDisplayText = (status: StatusType, shouldUppercaseText: boolean) =>
	shouldUppercaseText && status.style !== 'mixedCase' ? status.text.toUpperCase() : status.text;

export const getSuggestedStatuses = ({
	currentPos,
	currentStatus,
	doc,
	limit = MAX_SUGGESTED_STATUSES,
	shouldUppercaseText = false,
}: GetSuggestedStatusesArgs): SuggestedStatus[] => {
	const closestStatusesByKey = new Map<string, SuggestedStatusWithDistance>();
	const currentStatusKey = getStatusKey(currentStatus);

	doc.descendants((node, pos) => {
		if (node.type.name !== 'status' || pos === currentPos) {
			return;
		}

		const text = typeof node.attrs.text === 'string' ? node.attrs.text.trim() : '';
		if (!text) {
			return;
		}

		const status: StatusType = {
			color: node.attrs.color,
			localId: node.attrs.localId,
			style: node.attrs.style,
			text,
		};
		const statusKey = getStatusKey(status);

		if (status.localId === currentStatus.localId || statusKey === currentStatusKey) {
			return;
		}

		const existingStatus = closestStatusesByKey.get(statusKey);
		const nextStatus: SuggestedStatusWithDistance = {
			...status,
			distance: Math.abs(pos - currentPos),
			displayText: getDisplayText(status, shouldUppercaseText),
		};

		if (!existingStatus || nextStatus.distance < existingStatus.distance) {
			closestStatusesByKey.set(statusKey, nextStatus);
		}
	});

	return Array.from(closestStatusesByKey.values())
		.sort((statusA, statusB) => {
			if (statusA.distance !== statusB.distance) {
				return statusA.distance - statusB.distance;
			}

			if (statusA.displayText !== statusB.displayText) {
				return statusA.displayText.localeCompare(statusB.displayText);
			}

			return statusA.color.localeCompare(statusB.color);
		})
		.slice(0, limit)
		.map(({ distance: _distance, ...status }) => status);
};
