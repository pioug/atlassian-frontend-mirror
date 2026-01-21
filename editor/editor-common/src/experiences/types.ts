import { EXPERIENCE_ID } from "./consts";

/**
 * Allow any additional custom metadata to be attached to experience events.
 */
export type CustomExperienceMetadata = {
	[key: string]: string | number | boolean | CustomExperienceMetadata | undefined;
};

/**
 * Represents the state of an experience throughout its lifecycle.
 */
export type ExperienceState = 'pending' | 'started' | 'aborted' | 'failed' | 'succeeded';

/*
* ID for the the experience. These are broad experiences used for SLOs for all of editor, not at individual feature level.
*/
const EXPERIENCE_IDS = Object.values(EXPERIENCE_ID);

export type ExperienceId = typeof EXPERIENCE_IDS[number];
