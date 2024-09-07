// A mock for the actual Api class designed for the experiment teammate presence (ATLAS-53155)
export class NullApi {
	async addComment(): Promise<
		| {
				message: any;
		  }
		| undefined
	> {
		return;
	}
}
