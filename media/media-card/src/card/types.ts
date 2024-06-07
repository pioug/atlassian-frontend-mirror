import { type ReactElement, type RefObject } from 'react';
import type React from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { WithMediaClientConfigProps } from '@atlaskit/media-client-react';
import type { CardBaseProps } from './card';

import { type CardDimensions } from '../types';

export type InlinePlayerWrapperProps = {
	testId?: string;
	dimensions?: CardDimensions;
	selected: { selected?: boolean | undefined };
	onClick?: (event: React.MouseEvent<HTMLDivElement>, analyticsEvent?: UIAnalyticsEvent) => void;
	innerRef?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | undefined;
	children?: JSX.Element[] | ReactElement<any, any> | null | any;
};

export type CardWithMediaClientConfigProps = WithMediaClientConfigProps<CardBaseProps>;
