import React from 'react';

import { type IntlShape, type WithIntlProps, injectIntl } from 'react-intl';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import { type MentionProvider } from '../../api/MentionResource';
import { type PresenceProvider } from '../../api/PresenceResource';
import { type OnMentionEvent } from '../../types';
import { MentionPicker } from './MentionPicker';

export interface OnOpen {
	(): void;
}

export interface OnClose {
	(): void;
}

export type Position = 'above' | 'below' | 'auto';

export interface Props {
	offsetX?: number;
	offsetY?: number;
	onClose?: OnClose;

	onOpen?: OnOpen;
	onSelection?: OnMentionEvent;
	position?: Position;

	presenceProvider?: PresenceProvider;
	query?: string;
	resourceProvider: MentionProvider;
	target?: string;
	zIndex?: number | string;
}

export interface State {
	info?: string;
	visible: boolean;
}

const MentionPickerWithIntl = injectIntl(MentionPicker, { forwardRef: true });

// oxlint-disable-next-line eslint/no-redeclare
export const MentionPickerWithAnalytics: React.ForwardRefExoticComponent<
	Omit<
		Omit<
			WithIntlProps<
				React.PropsWithChildren<
					Props &
						WithAnalyticsEventsProps & {
							intl: IntlShape;
						}
				>
			>,
			'ref'
		> &
			React.RefAttributes<any>,
		keyof WithAnalyticsEventsProps
	> &
		React.RefAttributes<any>
> = withAnalyticsEvents({})(MentionPickerWithIntl);

// Merges with the `const` above so that `MentionPickerWithAnalytics` is usable in a type
// position as the component instance type (e.g. for refs). Both halves of a declaration
// merge must live in the same module, so this alias cannot be split out.
export type MentionPickerWithAnalytics = MentionPicker;

export default MentionPickerWithAnalytics;
