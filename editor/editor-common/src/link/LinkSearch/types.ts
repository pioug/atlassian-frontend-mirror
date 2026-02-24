import { type KeyboardEvent } from 'react';

import { type ActivityItem, type ActivityProvider } from '@atlaskit/activity-provider';

import { type INPUT_METHOD } from '../../analytics';

export type RecentSearchInputTypes = INPUT_METHOD.TYPEAHEAD | INPUT_METHOD.MANUAL;

export interface ChildProps {
	activityProvider: ActivityProvider | null;
	clearValue: () => void;
	currentInputMethod?: RecentSearchInputTypes;
	inputProps: {
		onChange: (input: string) => void;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onKeyDown: (event: KeyboardEvent<any>) => void;
		onSubmit: () => void;
		value: string;
	};
	renderRecentList: () => React.ReactNode;
}

export interface RecentSearchSubmitOptions {
	inputMethod: RecentSearchInputTypes;
	text: string;
	url: string;
}

export interface RecentSearchProps {
	defaultUrl?: string;
	limit?: number;
	onBlur: (options: RecentSearchSubmitOptions) => void;
	onSubmit: (options: RecentSearchSubmitOptions) => void;
	render: (state: ChildProps) => React.ReactNode;
}

export interface RecentSearchState {
	isLoading: boolean;
	items: Array<ActivityItem>;
	selectedIndex: number;
	url: string;
}

export type LinkSearchListItemData = {
	container: string;
	icon?: React.ReactChild | never;
	iconUrl?: string | never;
	lastUpdatedDate?: Date;
	lastViewedDate?: Date;
	name: string;
	objectId: string; // ari of a link
	prefetch?: boolean; // if the result is prefetced from activity provider
	url: string;
} & ({ iconUrl: string } | { icon: React.ReactChild });
