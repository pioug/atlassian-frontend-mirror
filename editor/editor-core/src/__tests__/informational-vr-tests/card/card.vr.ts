import { snapshotInformational } from '@af/visual-regression';
import {
  EditorCardFullPageInlineAndBlock,
  EditorCardFullWidthInlineAndBlock,
  EditorCardCommentInlineAndBlock,
  EditorCardChromelessInlineAndBlock,
  EditorCardMobileInlineAndBlock,
  EditorCardFullPageWithDatasource,
  EditorCardFullWidthWithDatasource,
  EditorCardCommentWithDatasource,
  EditorCardChromelessWithDatasource,
  EditorCardMobileWithDatasource,
  EditorCardFullPageEmbedNotFound,
} from './card.fixtures';

import {
  prepareSetupForInlineAndBlockCard,
  prepareSetupForCardWithDataSource,
  prepareSetupForEmbedCard,
} from './card.util';

import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';

const FULL_PAGE_TEST_ID = CONTENT_AREA_TEST_ID;
const FULL_WIDTH_TEST_ID = CONTENT_AREA_TEST_ID;
const COMMENT_TEST_ID = 'click-wrapper';
const CHROMELESS_TEST_ID = 'chromeless-editor';
const MOBILE_TEST_ID = 'ak-editor-content-area';

snapshotInformational.skip(EditorCardFullPageInlineAndBlock, {
  description: 'FullPage: displays link with correct appearance',
  selector: {
    byTestId: FULL_PAGE_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForInlineAndBlockCard,
});

snapshotInformational.skip(EditorCardFullWidthInlineAndBlock, {
  description: 'FullWidth: displays link with correct appearance',
  selector: {
    byTestId: FULL_WIDTH_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForInlineAndBlockCard,
});

snapshotInformational.skip(EditorCardCommentInlineAndBlock, {
  description: 'Comment: displays link with correct appearance',
  selector: {
    byTestId: COMMENT_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForInlineAndBlockCard,
});

snapshotInformational.skip(EditorCardChromelessInlineAndBlock, {
  description: 'Chromeless: displays link with correct appearance',
  selector: {
    byTestId: CHROMELESS_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForInlineAndBlockCard,
});

snapshotInformational.skip(EditorCardMobileInlineAndBlock, {
  description: 'Mobile: displays link with correct appearance',
  selector: {
    byTestId: MOBILE_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForInlineAndBlockCard,
});

snapshotInformational.skip(EditorCardFullPageWithDatasource, {
  description: 'FullPage: displays datasource on non-mobile editors',
  selector: {
    byTestId: FULL_PAGE_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForCardWithDataSource,
});

snapshotInformational.skip(EditorCardFullWidthWithDatasource, {
  description: 'FullWidth: displays datasource on non-mobile editors',
  selector: {
    byTestId: FULL_WIDTH_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForCardWithDataSource,
});

snapshotInformational.skip(EditorCardCommentWithDatasource, {
  description: 'Comment: displays datasource on non-mobile editors',
  selector: {
    byTestId: COMMENT_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForCardWithDataSource,
});

snapshotInformational.skip(EditorCardChromelessWithDatasource, {
  description: 'Chromeless: displays datasource on non-mobile editors',
  selector: {
    byTestId: CHROMELESS_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForCardWithDataSource,
});

snapshotInformational.skip(EditorCardMobileWithDatasource, {
  description:
    'Mobile: displays inline fallback instead of datasource tables on mobile',
  selector: {
    byTestId: MOBILE_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  prepare: prepareSetupForCardWithDataSource,
});

snapshotInformational(EditorCardFullPageEmbedNotFound, {
  description:
    'FullPage: Editor card embed notFound displays link with correct appearance',
  selector: {
    byTestId: FULL_PAGE_TEST_ID,
  },
  variants: [
    { name: 'light', environment: { colorScheme: 'light' } },
    { name: 'dark', environment: { colorScheme: 'dark' } },
  ],
  featureFlags: {
    'platform.linking-platform.smart-card.cross-join': true,
  },
  prepare: prepareSetupForEmbedCard(false),
});
