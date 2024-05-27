import {type MouseEvent} from 'react';
import type React from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type CardDimensions, type CardAppearance } from '../../../types';
import { type Breakpoint } from '../common';
import { type MediaCardCursor } from '../../../types';

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
