import { snapshot } from '@af/visual-regression';
import {
	SyncBlockGenericError,
	SyncBlockLoadingState,
	SyncBlockNotFound,
	SyncBlockWithParagraphAndPanelRenderer,
	SyncBlockWithPermissionDenied,
} from './sync-block.fixture';

snapshot(SyncBlockWithParagraphAndPanelRenderer, {
	description: 'should render sync block with paragraph and panel',
});

snapshot(SyncBlockWithPermissionDenied, {
	description: 'should render sync block with permission denied error',
});

snapshot(SyncBlockNotFound, { description: 'should render sync block not found error' });

snapshot(SyncBlockGenericError, { description: 'should render sync block generic error' });

snapshot(SyncBlockLoadingState, { description: 'should render sync block loading state' });
