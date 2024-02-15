/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useEffect, useRef } from 'react';

import SpinnerIcon from '@atlaskit/spinner';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { FileDetails } from '@atlaskit/media-client';
import { createAndFireMediaCardEvent } from '../../../utils/analytics';
import { IconWrapper } from '../../ui/iconWrapper/iconWrapper';
import { useBreakpoint } from '../../useBreakpoint';
import { CardViewWrapper, SharedCardViewProps } from './cardViewWrapper';

export type LoadingCardViewProps = SharedCardViewProps &
  WithAnalyticsEventsProps & {
    metadata?: FileDetails;
    disableAnimation?: boolean;
    readonly innerRef?: (instance: HTMLDivElement | null) => void;
  };

const LoadingCardViewBase = (props: LoadingCardViewProps) => {
  const { dimensions, metadata, disableOverlay, innerRef } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint(dimensions?.width, divRef);

  useEffect(() => {
    innerRef && !!divRef.current && innerRef(divRef.current);
  }, [innerRef]);

  const { name } = metadata || {};
  const hasTitleBox = !disableOverlay && !!name;

  return (
    <CardViewWrapper
      {...props}
      metadata={metadata}
      breakpoint={breakpoint}
      ref={divRef}
    >
      <IconWrapper breakpoint={breakpoint} hasTitleBox={hasTitleBox}>
        <SpinnerIcon testId="media-card-loading" />
      </IconWrapper>
    </CardViewWrapper>
  );
};

// TODO: check if analytics is correct

export const LoadingCardView = withAnalyticsEvents({
  onClick: createAndFireMediaCardEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'mediaCard',
    attributes: {},
  }),
})(LoadingCardViewBase);
