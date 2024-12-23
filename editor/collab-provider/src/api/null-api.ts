// A mock for the actual Api class designed for the experiment teammate presence (ATLAS-53155)
export class NullApi {
	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	async addComment(): Promise<
		| {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				message: any;
		  }
		| undefined
	> {
		return;
	}
}
