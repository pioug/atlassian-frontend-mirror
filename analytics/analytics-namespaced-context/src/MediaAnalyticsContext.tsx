import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';
import { MediaFeatureFlags, MediaType } from '@atlaskit/media-common';

export const MEDIA_CONTEXT = 'mediaCtx';

interface AnalyticsFileAttributes {
  fileSource: string;
  fileMediatype?: MediaType;
  fileMimetype?: string;
  fileId?: string;
  fileStatus?:
    | 'error'
    | 'failed-processing'
    | 'processed'
    | 'processing'
    | 'uploading';
  fileSize?: number;
}

export type MediaAnalyticsData = {
  fileAttributes?: AnalyticsFileAttributes;
  featureFlags?: MediaFeatureFlags;
} & Props['data'];

type MediaAnalyticsContextProps = Props & {
  data: MediaAnalyticsData;
};

export const MediaAnalyticsContext: StatelessComponent<MediaAnalyticsContextProps> = createNamespaceContext<
  MediaAnalyticsContextProps
>(MEDIA_CONTEXT, 'MediaAnalyticsContext');
