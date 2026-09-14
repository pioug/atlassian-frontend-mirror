import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SimpleEmojiExample from './00-simple-emoji';
import SkinToneEmojiByShortcutExample from './01-skin-tone-emoji-by-shortcut';
import ContentResourcedEmojiExample from './02-content-resourced-emoji';
import StandardEmojiTypeaheadExample from './03-standard-emoji-typeahead';
import InlineEmojiTypeaheadWithUsageExample from './04-inline-emoji-typeahead-with-usage';
import StandardEmojiPickerWithUploadExample from './05-standard-emoji-picker-with-upload';
import EmojiPickerWithUsageExample from './06-emoji-picker-with-usage';
import ResourcedEmojiRealEmojiResourceExample from './07-resourced-emoji-real-emoji-resource';
import BigResourcedEmojiRealEmojiResourceExample from './08-big-resourced-emoji-real-emoji-resource';
import PickerWithRealEmojiResourceExample from './09-picker-with-real-emoji-resource';
import TypeaheadWithRealEmojiResourceExample from './10-typeahead-with-real-emoji-resource';
import EmojiPreviewWithDescriptionExample from './11-emoji-preview-with-description';
import EmojiPreviewWithLongNameDescriptionExample from './12-emoji-preview-with-long-name-description';
import EmojiTypeaheadListExample from './13-emoji-typeahead-list';
import EmojiPickerListExample from './14-emoji-picker-list';
import CategorySelectorExample from './15-category-selector';
import ToneSelectorExample from './16-tone-selector';
import EmojiUploadPreviewExample from './17-emoji-upload-preview';
import EmojiUploadPreviewErrorExample from './18-emoji-upload-preview-error';
import EmojiUploaderWithUploadExample from './19-emoji-uploader-with-upload';
import EmojiSsrHydrationExample from './20-emoji-ssr-hydration';
import EmojiUfoWithRealResourceExample from './21-emoji-ufo-with-real-resource';
import ResourcedEmojiRealResourceBackendExample from './22-resourced-emoji-real-resource-backend';
import OptimisticEmojiExample from './23-optimistic-emoji';
import SpriteEmojiExample from './23-sprite-emoji';
import EmojiPlaceholderExample from './24-emoji-placeholder';
import FlickingIssueDemoExample from './24-flicking-issue-demo';
import EmojiPickerSizesExample from './25-emoji-picker-sizes';
import EmojiCommonProviderWithRealBackendExample from './26-emoji-common-provider-with-real-backend';
import EmojiPickerInFormExample from './27-emoji-picker-in-form';
import EmojiUploaderDisableFocusLockExample from './28-emoji-uploader-disable-focus-lock';

export const SimpleEmoji: WorkbenchExample = wb(SimpleEmojiExample);
export const SkinToneEmojiByShortcut: WorkbenchExample = wb(SkinToneEmojiByShortcutExample);
export const ContentResourcedEmoji: WorkbenchExample = wb(ContentResourcedEmojiExample);
export const StandardEmojiTypeahead: WorkbenchExample = wb(StandardEmojiTypeaheadExample);
export const InlineEmojiTypeaheadWithUsage: WorkbenchExample = wb(
	InlineEmojiTypeaheadWithUsageExample,
);
export const StandardEmojiPickerWithUpload: WorkbenchExample = wb(
	StandardEmojiPickerWithUploadExample,
);
export const EmojiPickerWithUsage: WorkbenchExample = wb(EmojiPickerWithUsageExample);
export const ResourcedEmojiRealEmojiResource: WorkbenchExample = wb(
	ResourcedEmojiRealEmojiResourceExample,
);
export const BigResourcedEmojiRealEmojiResource: WorkbenchExample = wb(
	BigResourcedEmojiRealEmojiResourceExample,
);
export const PickerWithRealEmojiResource: WorkbenchExample = wb(PickerWithRealEmojiResourceExample);
export const TypeaheadWithRealEmojiResource: WorkbenchExample = wb(
	TypeaheadWithRealEmojiResourceExample,
);
export const EmojiPreviewWithDescription: WorkbenchExample = wb(EmojiPreviewWithDescriptionExample);
export const EmojiPreviewWithLongNameDescription: WorkbenchExample = wb(
	EmojiPreviewWithLongNameDescriptionExample,
);
export const EmojiTypeaheadList: WorkbenchExample = wb(EmojiTypeaheadListExample);
export const EmojiPickerList: WorkbenchExample = wb(EmojiPickerListExample);
export const CategorySelector: WorkbenchExample = wb(CategorySelectorExample);
export const ToneSelector: WorkbenchExample = wb(ToneSelectorExample);
export const EmojiUploadPreview: WorkbenchExample = wb(EmojiUploadPreviewExample);
export const EmojiUploadPreviewError: WorkbenchExample = wb(EmojiUploadPreviewErrorExample);
export const EmojiUploaderWithUpload: WorkbenchExample = wb(EmojiUploaderWithUploadExample);
export const EmojiSsrHydration: WorkbenchExample = wb(EmojiSsrHydrationExample);
export const EmojiUfoWithRealResource: WorkbenchExample = wb(EmojiUfoWithRealResourceExample);
export const ResourcedEmojiRealResourceBackend: WorkbenchExample = wb(
	ResourcedEmojiRealResourceBackendExample,
);
export const OptimisticEmoji: WorkbenchExample = wb(OptimisticEmojiExample);
export const SpriteEmoji: WorkbenchExample = wb(SpriteEmojiExample);
export const EmojiPlaceholder: WorkbenchExample = wb(EmojiPlaceholderExample);
export const FlickingIssueDemo: WorkbenchExample = wb(FlickingIssueDemoExample);
export const EmojiPickerSizes: WorkbenchExample = wb(EmojiPickerSizesExample);
export const EmojiCommonProviderWithRealBackend: WorkbenchExample = wb(
	EmojiCommonProviderWithRealBackendExample,
);
export const EmojiPickerInForm: WorkbenchExample = wb(EmojiPickerInFormExample);
export const EmojiUploaderDisableFocusLock: WorkbenchExample = wb(
	EmojiUploaderDisableFocusLockExample,
);
