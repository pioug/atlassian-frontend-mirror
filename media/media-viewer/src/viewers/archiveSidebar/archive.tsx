/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

import React from 'react';

import { type ZipEntry } from 'unzipit';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import type { ArchiveViewerError } from '../../ArchiveViewerError';
import { ArchiveViewerBase } from './archive-viewer-base';
import { type ArchiveViewerProps } from './types';

export type Props = ArchiveViewerProps & WithAnalyticsEventsProps;

export type Content = {
	src?: string;
	name?: string;
	isDirectory?: boolean;
	selectedArchiveEntry?: ZipEntry;
	hasLoadedEntries?: boolean;
	error?: ArchiveViewerError;
	codeViewerSrc?: string;
	isCodeMimeType?: boolean;
};

export const ArchiveViewer: React.ForwardRefExoticComponent<
	Omit<ArchiveViewerProps, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>
> = withAnalyticsEvents()(ArchiveViewerBase);
