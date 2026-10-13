import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';

const MEDIA_DROP_POSITION_EXPERIMENT = 'platform_editor_media_drop_position';

/**
 * Enrols the user and returns whether they are in the test cohort.
 *
 * Called only from the dropzone's drag-enter and drop callbacks, which fire exclusively for
 * accepted external file interactions, so both cohorts enrol at the same point.
 */
export const exposeMediaDropPosition = (): boolean =>
	isExperimentEnabled(MEDIA_DROP_POSITION_EXPERIMENT);

/**
 * Returns whether the user is in the test cohort without enrolling them.
 *
 * Used by the render, transaction and decoration paths, which run for every editor user on
 * every transaction and would otherwise enrol people who never drag a file. Enrolment happens
 * in {@link exposeMediaDropPosition}.
 */
export const isMediaDropPositionEnabled = (): boolean =>
	UNSAFE_expValNoExposure(MEDIA_DROP_POSITION_EXPERIMENT, 'isEnabled', false) === true;
