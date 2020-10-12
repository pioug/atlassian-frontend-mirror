import { AnalyticsReactContextInterface } from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../events/UIAnalyticsEvent';

export type AnalyticsListenerFunction = (
  props: {
    /** Children! */
    children?: React.ReactNode;
    /** The channel to listen for events on. */
    channel?: string;
    /** A function which will be called when an event is fired on this Listener's
     * channel. It is passed the event and the channel as arguments. */
    onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
  },
  context?: AnalyticsReactContextInterface,
) => JSX.Element;
