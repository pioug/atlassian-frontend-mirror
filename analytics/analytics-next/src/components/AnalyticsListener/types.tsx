import { type AnalyticsReactContextInterface } from '@atlaskit/analytics-next-stable-react-context';

import type UIAnalyticsEvent from '../../events/UIAnalyticsEvent';

export type AnalyticsListenerFunction = (
	props: {
		/** The channel to listen for events on. */
		channel?: string;
		/** Children! */
		children?: React.ReactNode;
		/** A function which will be called when an event is fired on this Listener's
		 * channel. It is passed the event and the channel as arguments. */
		onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
	},
	context?: AnalyticsReactContextInterface,
) => JSX.Element;
