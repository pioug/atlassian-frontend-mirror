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
