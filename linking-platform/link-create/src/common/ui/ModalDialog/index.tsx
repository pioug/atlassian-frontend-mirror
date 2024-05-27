import React, { useEffect } from 'react';

import { AnalyticsContext, useAnalyticsEvents } from '@atlaskit/analytics-next';
import ModalDialog from '@atlaskit/modal-dialog';

import { ANALYTICS_CHANNEL } from '../../constants';
import createEventPayload, {
  type AnalyticsEventAttributes,
} from '../../utils/analytics/analytics.codegen';
import { ScreenViewedEvent } from '../../utils/analytics/components';

type ModalProps = React.ComponentProps<typeof ModalDialog> & {
  screen: keyof {
    [Key in keyof AnalyticsEventAttributes as Key extends `screen.${infer ScreenName}.viewed`
      ? ScreenName
      : never]: any;
  };
};

const ModalOpenCloseEvents = () => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  useEffect(() => {
    //will fire when modal is mounted
    createAnalyticsEvent(
      createEventPayload(`ui.modalDialog.opened.linkCreate`, {}),
    ).fire(ANALYTICS_CHANNEL);

    //will fire when modal is unmounted
    return () => {
      createAnalyticsEvent(
        createEventPayload(`ui.modalDialog.closed.linkCreate`, {}),
      ).fire(ANALYTICS_CHANNEL);
    };
  }, [createAnalyticsEvent]);

  return null;
};

/**
 * AkModal component with built-in analytics for screen event + open + close events + source context
 */
export const Modal = ({ screen, children, ...props }: ModalProps) => {
  return (
    <ModalDialog {...props}>
      <AnalyticsContext data={{ source: screen, component: 'modal' }}>
        <ScreenViewedEvent screen={screen} />
        <ModalOpenCloseEvents />
        {children}
      </AnalyticsContext>
    </ModalDialog>
  );
};
