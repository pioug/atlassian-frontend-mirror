import React, { MouseEvent } from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { CardDimensions, CardAppearance } from '../../../types';
import { Breakpoint } from '../common';
import { MediaCardCursor } from '../../../types';

export interface WrapperProps {
  testId?: string;
  breakpoint: Breakpoint;
  mediaCardCursor?: MediaCardCursor;
  dimensions?: CardDimensions;
  appearance?: CardAppearance;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  mediaType?: string;
  disableOverlay: boolean;
  displayBackground: boolean;
  selected: boolean;
  isPlayButtonClickable: boolean;
  isTickBoxSelectable: boolean;
  shouldDisplayTooltip: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
  children?: JSX.Element;
}
