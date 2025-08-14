import { type KeyboardEvent } from 'react';

import { type ActivityItem, type ActivityProvider } from '@atlaskit/activity-provider';

import { type INPUT_METHOD } from '../../analytics';

export type RecentSearchInputTypes = INPUT_METHOD.TYPEAHEAD | INPUT_METHOD.MANUAL;

export interface ChildProps {
	activityProvider: ActivityProvider | null;
	inputProps: {
		// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
		onChange(input: string): void;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
		onKeyDown(event: KeyboardEvent<any>): void;
		// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
		onSubmit(): void;
		value: string;
	};
	currentInputMethod?: RecentSearchInputTypes;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	clearValue(): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	renderRecentList(): React.ReactNode;
}

export interface RecentSearchSubmitOptions {
	text: string;
	url: string;
	inputMethod: RecentSearchInputTypes;
}

export interface RecentSearchProps {
	defaultUrl?: string;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onSubmit(options: RecentSearchSubmitOptions): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onBlur(options: RecentSearchSubmitOptions): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	render(state: ChildProps): React.ReactNode;
	limit?: number;
}

export interface RecentSearchState {
	items: Array<ActivityItem>;
	selectedIndex: number;
	isLoading: boolean;
	url: string;
}

export type LinkSearchListItemData = {
	objectId: string; // ari of a link
	name: string;
	container: string;
	url: string;
	iconUrl?: string | never;
	icon?: React.ReactChild | never;
	lastViewedDate?: Date;
	lastUpdatedDate?: Date;
	prefetch?: boolean; // if the result is prefetced from activity provider
} & ({ iconUrl: string } | { icon: React.ReactChild });
