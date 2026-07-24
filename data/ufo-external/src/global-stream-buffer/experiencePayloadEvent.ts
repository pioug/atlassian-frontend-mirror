import {
	type ExperienceData,
	UFOGlobalEventStreamEventType,
	type UFOGlobalEventStreamExperiencePayload,
} from '../types';

export const experiencePayloadEvent = (
	data: ExperienceData,
): UFOGlobalEventStreamExperiencePayload => {
	return {
		type: UFOGlobalEventStreamEventType.EXPERIENCE_PAYLOAD,
		payload: data,
	};
};
