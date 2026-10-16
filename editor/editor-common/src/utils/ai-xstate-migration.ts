import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * Whether the editor AI xstate migration is enabled for the current product.
 *
 * The migration is rolled out via two product-specific experiments:
 * - `platform_editor_ai_xstate_migration` (Confluence), a legacy editor experiment
 *   read via `@atlaskit/tmp-editor-statsig`
 * - `platform_editor_ai_xstate_migration_jira` (Jira), a platform feature experiment
 *   read via `@atlaskit/platform-feature-experiments`
 *
 * Use this helper instead of checking either experiment directly so every call site
 * stays consistent across products. Use `isAiXstateMigrationEnabledNoExposure` from
 * `@atlaskit/editor-common/ai-xstate-migration-no-exposure` when exposure must not fire.
 *
 * Cleanup: only remove this helper (and replace its call sites with `true`) once
 * BOTH experiments have shipped. Cleaning up the Confluence experiment alone by
 * replacing it with `true` would also force the migration on for Jira.
 *
 * Note: This method fires exposure for the evaluated experiment(s).
 */
export const isAiXstateMigrationEnabled = (): boolean =>
	expValEquals('platform_editor_ai_xstate_migration', 'isEnabled', true) ||
	isExperimentEnabled('platform_editor_ai_xstate_migration_jira');
