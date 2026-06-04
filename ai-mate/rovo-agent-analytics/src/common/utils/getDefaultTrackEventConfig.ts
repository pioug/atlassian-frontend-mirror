export const getDefaultTrackEventConfig = (): {
	eventType: string;
	tags: string[];
} => ({
	eventType: 'track',
	tags: ['atlaskit'],
});
