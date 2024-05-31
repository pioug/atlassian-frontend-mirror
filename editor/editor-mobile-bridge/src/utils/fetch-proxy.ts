import { createPromise } from '../cross-platform-promise';
import { isApple } from './is-apple';

export class FetchProxy {
	private urls: string[] = [];
	// Fetch requires to be binded to the window.
	private globalFetch = window.fetch.bind(window);

	constructor() {
		this.enable();
	}

	add(url: string): void {
		if (this.urls.some((u) => url.startsWith(u))) {
			return;
		}

		this.urls.push(url);
	}

	remove(url: string): void {
		this.urls = this.urls.filter((u) => u !== url);
	}

	getUrlListLength(): number {
		return this.urls.length;
	}

	enable(): void {
		// We should only mock the fetch when we are in IOs, Android intercept the fetch by itself.
		if (!isApple()) {
			return;
		}

		window.fetch = this.nativeFetch;
	}

	nativeFetch = (request: any, options: any) => {
		let url = typeof request === 'string' ? request : request.url;
		// Determine whether its a URL we want native to handle, otherwise continue as normal.
		const shouldMock = this.urls.some((u) => url.startsWith(u));
		if (!shouldMock) {
			return this.globalFetch(request, options);
		}

		return createPromise('nativeFetch', { url, options })
			.submit()
			.then(({ response, status, statusText }) =>
				Promise.resolve(new Response(response, { status, statusText })),
			);
	};

	disable(): void {
		// We never mock when is Android, so we do nothing.
		if (!isApple()) {
			return;
		}
		window.fetch = this.globalFetch;
	}
}

export const fetchProxy = new FetchProxy();
