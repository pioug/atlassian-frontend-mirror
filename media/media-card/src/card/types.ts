import React, { MouseEvent, ReactElement, RefObject } from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { CardDimensions } from '../types';
import { BreakpointSizeValue } from '../utils/breakpoint';

export interface WrapperProps {
  testId?: string;
  shouldUsePointerCursor?: boolean;
  dimensions?: CardDimensions;
  breakpointSize?: BreakpointSizeValue;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  innerRef?: RefObject<HTMLDivElement>;
  children?: JSX.Element;
}

export type InlinePlayerWrapperProps = {
  testId?: string;
  dimensions?: CardDimensions;
  selected: { selected?: boolean | undefined };
  onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  innerRef?:
    | RefObject<HTMLDivElement>
    | ((instance: HTMLDivElement | null) => void)
    | undefined;
  children?: JSX.Element[] | ReactElement<any, any> | null | any;
};
