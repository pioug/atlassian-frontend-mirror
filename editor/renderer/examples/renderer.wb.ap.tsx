import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './0-basic';
import FullPageExample from './0-full-page';
import FullPageWithCustomPanelExample from './0-full-page-with-custom-panel';
import FullPageWithFixedSizeMediaExample from './0-full-page-with-fixed-size-media';
import FullPageWithI18nExample from './0-full-page-with-i18n';
import FullPageWithMediaCaptionExample from './0-full-page-with-media-caption';
import FullPageWithMediaInlineExample from './0-full-page-with-media-inline';
import FullPageWithSpecBasedValidatorExample from './0-full-page-with-spec-based-validator';
import FullPageWithUgcScrubberExample from './0-full-page-with-ugc-scrubber';
import FullPageWithoutMediaCaptionExample from './0-full-page-without-media-caption';
import FullWidthExample from './0-full-width';
import MultiBodiedExtensionExample from './0-multi-bodied-extension';
import WithProvidersExample from './1-with-providers';
import WithProvidersAndPortalExample from './2-with-providers-and-portal';
import WithProvidersAndPortalAndExtensionExample from './3-with-providers-and-portal-and-extension';
import WithTextSerializerExample from './5-with-text-serializer';
import DacViewerExample from './7-dac-viewer';
import ExternalImagesExample from './8-external-images';
import MediaLayoutExample from './8-media-layout';
import MediaWithLinkExample from './8-media-with-link';
import ResizedMediaLayoutExample from './8-resized-media-layout';
import TableLayoutExample from './9-table-layout';
import ColumnLayoutExample from './10-column-layout';
import ExtensionLayoutExample from './11-extension-layout';
import OverflowExample from './11-overflow';
import StickyHeadersExample from './12-sticky-headers';
import SmartCardExample from './13-smart-card';
import SmartCardDatasourceExample from './13-smart-card-datasource';
import SmartCardWithEventHandlersExample from './13-smart-card-with-event-handlers';
import SmartCardWithFrameStyleExample from './13-smart-card-with-frameStyle';
import HeaderIdsExample from './14-header-ids';
import NestedHeadersInsideExpandExample from './14-nested-headers-inside-expand';
import TruncatedExample from './15-truncated';
import TruncatedCustomHeightExample from './16-truncated-custom-height';
import UserTestingExample from './17-user-testing';
import ListOfCommentsExample from './18-list-of-comments';
import FullPageWithoutExpandExample from './19-full-page-without-expand';
import RendererActionsExample from './20-renderer-actions';
import AnnotationsExample from './21-annotations';
import AnnotationsNewExample from './21-annotations-new';
import AnnotationsNewPlaywrightExample from './21-annotations-new-playwright';
import AnnotationsWithManagerExample from './21-annotations-with-manager';
import PlaceholderEnabledExample from './22-placeholder-enabled';
import WithMockTemplateVariablesExample from './23-with-mock-template-variables';
import TextHighlighterApiExample from './24-text-highlighter-api';
import NestedTablesExample from './25-nested-tables';
import TestingExample from './99-testing';
import TestingWithClickToEditExample from './100-testing-with-click-to-edit';
import MediaSsrExample from './101-media-ssr';
import SmartCardSsrExample from './102-smart-card-ssr';
import LinkWithSafetyCheckExample from './103-link-with-safety-check';
import WithInlineEditExample from './104-with-inline-edit';
import DeepLinkTargetExample from './105-deep-link-target';
import AddTelepointerExample from './200-add-telepointer';

export const Basic: WorkbenchExample<typeof BasicExample> = wb(BasicExample);
export const FullPageWithCustomPanel: WorkbenchExample<typeof FullPageWithCustomPanelExample> = wb(
	FullPageWithCustomPanelExample,
);
export const FullPageWithFixedSizeMedia: WorkbenchExample<
	typeof FullPageWithFixedSizeMediaExample
> = wb(FullPageWithFixedSizeMediaExample);
export const FullPageWithI18n: WorkbenchExample<typeof FullPageWithI18nExample> =
	wb(FullPageWithI18nExample);
export const FullPageWithMediaCaption: WorkbenchExample<typeof FullPageWithMediaCaptionExample> =
	wb(FullPageWithMediaCaptionExample);
export const FullPageWithMediaInline: WorkbenchExample<typeof FullPageWithMediaInlineExample> = wb(
	FullPageWithMediaInlineExample,
);
export const FullPageWithSpecBasedValidator: WorkbenchExample<
	typeof FullPageWithSpecBasedValidatorExample
> = wb(FullPageWithSpecBasedValidatorExample);
export const FullPageWithUgcScrubber: WorkbenchExample<typeof FullPageWithUgcScrubberExample> = wb(
	FullPageWithUgcScrubberExample,
);
export const FullPageWithoutMediaCaption: WorkbenchExample<
	typeof FullPageWithoutMediaCaptionExample
> = wb(FullPageWithoutMediaCaptionExample);
export const FullPage: WorkbenchExample<typeof FullPageExample> = wb(FullPageExample);
export const FullWidth: WorkbenchExample<typeof FullWidthExample> = wb(FullWidthExample);
export const MultiBodiedExtension: WorkbenchExample<typeof MultiBodiedExtensionExample> = wb(
	MultiBodiedExtensionExample,
);
export const WithProviders: WorkbenchExample<typeof WithProvidersExample> =
	wb(WithProvidersExample);
export const ColumnLayout: WorkbenchExample<typeof ColumnLayoutExample> = wb(ColumnLayoutExample);
export const TestingWithClickToEdit: WorkbenchExample<typeof TestingWithClickToEditExample> = wb(
	TestingWithClickToEditExample,
);
export const MediaSsr: WorkbenchExample<typeof MediaSsrExample> = wb(MediaSsrExample);
export const SmartCardSsr: WorkbenchExample<typeof SmartCardSsrExample> = wb(SmartCardSsrExample);
export const LinkWithSafetyCheck: WorkbenchExample<typeof LinkWithSafetyCheckExample> = wb(
	LinkWithSafetyCheckExample,
);
export const WithInlineEdit: WorkbenchExample<typeof WithInlineEditExample> =
	wb(WithInlineEditExample);
export const DeepLinkTarget: WorkbenchExample<typeof DeepLinkTargetExample> =
	wb(DeepLinkTargetExample);
export const ExtensionLayout: WorkbenchExample<typeof ExtensionLayoutExample> =
	wb(ExtensionLayoutExample);
export const Overflow: WorkbenchExample<typeof OverflowExample> = wb(OverflowExample);
export const StickyHeaders: WorkbenchExample<typeof StickyHeadersExample> =
	wb(StickyHeadersExample);
export const SmartCardDatasource: WorkbenchExample<typeof SmartCardDatasourceExample> = wb(
	SmartCardDatasourceExample,
);
export const SmartCardWithEventHandlers: WorkbenchExample<
	typeof SmartCardWithEventHandlersExample
> = wb(SmartCardWithEventHandlersExample);
export const SmartCardWithFrameStyle: WorkbenchExample<typeof SmartCardWithFrameStyleExample> = wb(
	SmartCardWithFrameStyleExample,
);
export const SmartCard: WorkbenchExample<typeof SmartCardExample> = wb(SmartCardExample);
export const HeaderIds: WorkbenchExample<typeof HeaderIdsExample> = wb(HeaderIdsExample);
export const NestedHeadersInsideExpand: WorkbenchExample<typeof NestedHeadersInsideExpandExample> =
	wb(NestedHeadersInsideExpandExample);
export const Truncated: WorkbenchExample<typeof TruncatedExample> = wb(TruncatedExample);
export const TruncatedCustomHeight: WorkbenchExample<typeof TruncatedCustomHeightExample> = wb(
	TruncatedCustomHeightExample,
);
export const UserTesting: WorkbenchExample<typeof UserTestingExample> = wb(UserTestingExample);
export const ListOfComments: WorkbenchExample<typeof ListOfCommentsExample> =
	wb(ListOfCommentsExample);
export const FullPageWithoutExpand: WorkbenchExample<typeof FullPageWithoutExpandExample> = wb(
	FullPageWithoutExpandExample,
);
export const WithProvidersAndPortal: WorkbenchExample<typeof WithProvidersAndPortalExample> = wb(
	WithProvidersAndPortalExample,
);
export const RendererActions: WorkbenchExample<typeof RendererActionsExample> =
	wb(RendererActionsExample);
export const AddTelepointer: WorkbenchExample<typeof AddTelepointerExample> =
	wb(AddTelepointerExample);
export const AnnotationsNewPlaywright: WorkbenchExample<typeof AnnotationsNewPlaywrightExample> =
	wb(AnnotationsNewPlaywrightExample);
export const AnnotationsNew: WorkbenchExample<typeof AnnotationsNewExample> =
	wb(AnnotationsNewExample);
export const AnnotationsWithManager: WorkbenchExample<typeof AnnotationsWithManagerExample> = wb(
	AnnotationsWithManagerExample,
);
export const Annotations: WorkbenchExample<typeof AnnotationsExample> = wb(AnnotationsExample);
export const PlaceholderEnabled: WorkbenchExample<typeof PlaceholderEnabledExample> =
	wb(PlaceholderEnabledExample);
export const WithMockTemplateVariables: WorkbenchExample<typeof WithMockTemplateVariablesExample> =
	wb(WithMockTemplateVariablesExample);
export const TextHighlighterApi: WorkbenchExample<typeof TextHighlighterApiExample> =
	wb(TextHighlighterApiExample);
export const NestedTables: WorkbenchExample<typeof NestedTablesExample> = wb(NestedTablesExample);
export const WithProvidersAndPortalAndExtension: WorkbenchExample<
	typeof WithProvidersAndPortalAndExtensionExample
> = wb(WithProvidersAndPortalAndExtensionExample);
export const WithTextSerializer: WorkbenchExample<typeof WithTextSerializerExample> =
	wb(WithTextSerializerExample);
export const DacViewer: WorkbenchExample<typeof DacViewerExample> = wb(DacViewerExample);
export const ExternalImages: WorkbenchExample<typeof ExternalImagesExample> =
	wb(ExternalImagesExample);
export const MediaLayout: WorkbenchExample<typeof MediaLayoutExample> = wb(MediaLayoutExample);
export const MediaWithLink: WorkbenchExample<typeof MediaWithLinkExample> =
	wb(MediaWithLinkExample);
export const ResizedMediaLayout: WorkbenchExample<typeof ResizedMediaLayoutExample> =
	wb(ResizedMediaLayoutExample);
export const TableLayout: WorkbenchExample<typeof TableLayoutExample> = wb(TableLayoutExample);
export const Testing: WorkbenchExample<typeof TestingExample> = wb(TestingExample);
