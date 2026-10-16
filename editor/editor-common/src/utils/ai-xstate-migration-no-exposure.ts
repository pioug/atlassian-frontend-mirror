import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

/**
 * Same as `isAiXstateMigrationEnabled` from `@atlaskit/editor-common/ai-xstate-migration`
 * (Confluence `platform_editor_ai_xstate_migration` OR Jira
 * `platform_editor_ai_xstate_migration_jira`), but never fires exposure.
 *
 * Cleanup: only remove once BOTH experiments have shipped.
 */
export const isAiXstateMigrationEnabledNoExposure = (): boolean =>
	expValEqualsNoExposure('platform_editor_ai_xstate_migration', 'isEnabled', true) ||
	UNSAFE_expValNoExposure('platform_editor_ai_xstate_migration_jira', 'isEnabled', false) === true;
