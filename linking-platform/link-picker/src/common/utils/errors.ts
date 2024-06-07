export class UnauthenticatedError extends Error {
	constructor(
		public iconUrl: string,
		public authUrl: string,
		public description: string,
	) {
		super('The user is not authenticated');
	}
}
