import { type ReactElement, type RefObject } from 'react';
import type React from 'react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import type { WithMediaClientConfigProps } from '@atlaskit/media-client-react/with-media-client';

import { type CardDimensions } from '../types';
import type { CardBaseProps } from './CardBase';

export type InlinePlayerWrapperProps = {
	testId?: string;
	dimensions?: CardDimensions;
	selected?: boolean;
	onClick?: (event: React.MouseEvent<HTMLDivElement>, analyticsEvent?: UIAnalyticsEvent) => void;
	innerRef?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | undefined;
	children?: JSX.Element[] | ReactElement<any, any> | null | any;
};

export type SsrItemDetails = {
	filename: string;
	mimetype: string;
	createdDate: number;
};

export type CardWithMediaClientConfigProps = WithMediaClientConfigProps<CardBaseProps>;
