// Ignored via go/ees005
// eslint-disable-next-line require-await
export default async (appKey: string): Promise<void> => {
	if (!window.Dropbox) {
		// The dropbox script is in no way typescript, and is not our code
		// It attached the `Dropbox` property to window.
		// @ts-ignore
		return import('./dropboxscript').then(() => {
			window.Dropbox.appKey = appKey;
		});
	} else {
		window.Dropbox.appKey = appKey;
		return Promise.resolve();
	}
};
