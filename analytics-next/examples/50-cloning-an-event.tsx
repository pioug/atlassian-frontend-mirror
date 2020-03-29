import React, { FC, MouseEvent } from 'react';
import {
  AnalyticsListener,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  UIAnalyticsEvent,
} from '../src';

interface ButtonProps extends WithAnalyticsEventsProps {
  onClick?: (
    e: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
}

const Button: FC<ButtonProps> = ({ createAnalyticsEvent, ...props }) => (
  <button {...props} />
);

const AtlaskitButton = withAnalyticsEvents({
  onClick: create => {
    create({ action: 'click', version: '1.2.3' }).fire('atlaskit');
    return create({ action: 'click' });
  },
})(Button);

interface MediaProps {
  onClick: (
    e: MouseEvent<HTMLButtonElement>,
    analyticsEvent: UIAnalyticsEvent | null,
  ) => void;
}

const MediaComponent: FC<MediaProps> = props => {
  const onClick = (
    e: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    const publicEvent = analyticsEvent!.update({ action: 'submit' }).clone();
    analyticsEvent!.update({ value: 'some media-related data' }).fire('media');

    props.onClick(e, publicEvent);
  };

  return <AtlaskitButton {...props} onClick={onClick} />;
};

interface JiraProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const JiraApp: FC<JiraProps> = props => {
  const onClick = (
    e: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent | null,
  ) => {
    if (analyticsEvent) {
      analyticsEvent
        .update({ action: 'issue-updated', issueId: 123 })
        .fire('jira');
    }

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <MediaComponent {...props} onClick={onClick}>
      Click me
    </MediaComponent>
  );
};

const onEvent = (event: UIAnalyticsEvent, channel: string = 'undefined') => {
  console.log(
    `Received event on ${channel.toUpperCase()} channel. Payload:`,
    event.payload,
  );
};

export default () => (
  <AnalyticsListener channel="jira" onEvent={onEvent}>
    <AnalyticsListener channel="media" onEvent={onEvent}>
      <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
        <JiraApp />
      </AnalyticsListener>
    </AnalyticsListener>
  </AnalyticsListener>
);
