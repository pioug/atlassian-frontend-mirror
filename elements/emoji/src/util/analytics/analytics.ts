/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { type SearchSourceTypes } from '../../types';

export const createAndFireEventInElementsChannel: (
	payload: AnalyticsEventPayload,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent =
	createAndFireEvent('fabric-elements');

export type EmojiInsertionAnalytic = (
	source: SearchSourceTypes.PICKER | SearchSourceTypes.TYPEAHEAD,
) => AnalyticsEventPayload;

/**
 * @deprecated Use `import { recordSucceededEmoji } from '@atlaskit/emoji/analytics'` instead.
 */
export { recordSucceededEmoji } from './recordSucceededEmoji';
/**
 * @deprecated Use `import { recordSucceeded } from '@atlaskit/emoji/analytics'` instead.
 */
export { recordSucceeded } from './recordSucceeded';
/**
 * @deprecated Use `import { recordFailedEmoji } from '@atlaskit/emoji/analytics'` instead.
 */
export { recordFailedEmoji } from './recordFailedEmoji';
/**
 * @deprecated Use `import { recordFailed } from '@atlaskit/emoji/analytics'` instead.
 */
export { recordFailed } from './recordFailed';
/**
 * @deprecated Use `import { openedPickerEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { openedPickerEvent } from './openedPickerEvent';
/**
 * @deprecated Use `import { closedPickerEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { closedPickerEvent } from './closedPickerEvent';
/**
 * @deprecated Use `import { pickerClickedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { pickerClickedEvent } from './pickerClickedEvent';
/**
 * @deprecated Use `import { categoryClickedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { categoryClickedEvent } from './categoryClickedEvent';
/**
 * @deprecated Use `import { pickerSearchedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { pickerSearchedEvent } from './pickerSearchedEvent';
/**
 * @deprecated Use `import { toneSelectedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { toneSelectedEvent } from './toneSelectedEvent';
/**
 * @deprecated Use `import { toneSelectorOpenedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { toneSelectorOpenedEvent } from './toneSelectorOpenedEvent';
/**
 * @deprecated Use `import { toneSelectorClosedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { toneSelectorClosedEvent } from './toneSelectorClosedEvent';
/**
 * @deprecated Use `import { uploadBeginButton } from '@atlaskit/emoji/analytics'` instead.
 */
export { uploadBeginButton } from './uploadBeginButton';
/**
 * @deprecated Use `import { uploadConfirmButton } from '@atlaskit/emoji/analytics'` instead.
 */
export { uploadConfirmButton } from './uploadConfirmButton';
/**
 * @deprecated Use `import { uploadCancelButton } from '@atlaskit/emoji/analytics'` instead.
 */
export { uploadCancelButton } from './uploadCancelButton';
/**
 * @deprecated Use `import { uploadSucceededEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { uploadSucceededEvent } from './uploadSucceededEvent';
/**
 * @deprecated Use `import { uploadFailedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { uploadFailedEvent } from './uploadFailedEvent';
/**
 * @deprecated Use `import { aiGenerationStartedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { aiGenerationStartedEvent } from './aiGenerationStartedEvent';
/**
 * @deprecated Use `import { aiGenerationCompletedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { aiGenerationCompletedEvent } from './aiGenerationCompletedEvent';
/**
 * @deprecated Use `import { aiGenerationFailedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { aiGenerationFailedEvent } from './aiGenerationFailedEvent';
/**
 * @deprecated Use `import { deleteBeginEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { deleteBeginEvent } from './deleteBeginEvent';
/**
 * @deprecated Use `import { deleteConfirmEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { deleteConfirmEvent } from './deleteConfirmEvent';
/**
 * @deprecated Use `import { deleteCancelEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { deleteCancelEvent } from './deleteCancelEvent';
/**
 * @deprecated Use `import { selectedFileEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { selectedFileEvent } from './selectedFileEvent';
/**
 * @deprecated Use `import { typeaheadCancelledEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { typeaheadCancelledEvent } from './typeaheadCancelledEvent';
/**
 * @deprecated Use `import { typeaheadSelectedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { typeaheadSelectedEvent } from './typeaheadSelectedEvent';
/**
 * @deprecated Use `import { typeaheadRenderedEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { typeaheadRenderedEvent } from './typeaheadRenderedEvent';
/**
 * @deprecated Use `import { recordSelectionSucceededSli } from '@atlaskit/emoji/analytics'` instead.
 */
export { recordSelectionSucceededSli } from './recordSelectionSucceededSli';
/**
 * @deprecated Use `import { recordSelectionFailedSli } from '@atlaskit/emoji/analytics'` instead.
 */
export { recordSelectionFailedSli } from './recordSelectionFailedSli';
/**
 * @deprecated Use `import { extractErrorInfo } from '@atlaskit/emoji/analytics'` instead.
 */
export { extractErrorInfo } from './extractErrorInfo';
/**
 * @deprecated Use `import { createEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { createEvent } from './createEvent';
/**
 * @deprecated Use `import { Duration } from '@atlaskit/emoji/analytics'` instead.
 */
export type { Duration } from './Duration';
/**
 * @deprecated Use `import { emojiPickerEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { emojiPickerEvent } from './emojiPickerEvent';
/**
 * @deprecated Use `import { skinTones } from '@atlaskit/emoji/analytics'` instead.
 */
export { skinTones } from './skinTones';
/**
 * @deprecated Use `import { getSkinTone } from '@atlaskit/emoji/analytics'` instead.
 */
export { getSkinTone } from './getSkinTone';
/**
 * @deprecated Use `import { skintoneSelectorEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { skintoneSelectorEvent } from './skintoneSelectorEvent';
/**
 * @deprecated Use `import { emojiUploaderEvent } from '@atlaskit/emoji/analytics'` instead.
 */
export { emojiUploaderEvent } from './emojiUploaderEvent';
/**
 * @deprecated Use `import { Attributes } from '@atlaskit/emoji/analytics'` instead.
 */
export type { Attributes } from './Attributes';
/**
 * @deprecated Use `import { CommonAttributes } from '@atlaskit/emoji/analytics'` instead.
 */
export type { CommonAttributes } from './CommonAttributes';
/**
 * @deprecated Use `import { extractCommonAttributes } from '@atlaskit/emoji/analytics'` instead.
 */
export { extractCommonAttributes } from './extractCommonAttributes';
