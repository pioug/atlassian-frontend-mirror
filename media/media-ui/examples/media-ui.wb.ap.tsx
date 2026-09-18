import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TimeRangeExample from './2-time-range';
import GetImageOrientationExample from './get-image-orientation';
import MediaImageLazyLoadingExample from './media-image-lazy-loading';
import MediaInlineCardsExample from './media-inline-cards';
import MediaWithTextExample from './media-with-text.vr.ap';
import ReadImageMetadataExample from './read-image-metadata';
import VrMediaInlineCardTextWrapExample from './vr-media-inline-card-text-wrap.vr.ap';
import VrMediaInlineCardExample from './vr-media-inline-card.vr.ap';

export const TimeRange: WorkbenchExample = wb(TimeRangeExample);
export const GetImageOrientation: WorkbenchExample = wb(GetImageOrientationExample);
export const MediaImageLazyLoading: WorkbenchExample = wb(MediaImageLazyLoadingExample);
export const MediaInlineCards: WorkbenchExample = wb(MediaInlineCardsExample);
export const MediaWithText: WorkbenchExample = wb(MediaWithTextExample);
export const ReadImageMetadata: WorkbenchExample = wb(ReadImageMetadataExample);
export const VrMediaInlineCardTextWrap: WorkbenchExample = wb(VrMediaInlineCardTextWrapExample);
export const VrMediaInlineCard: WorkbenchExample = wb(VrMediaInlineCardExample);
