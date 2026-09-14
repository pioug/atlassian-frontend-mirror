import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { BatchResponse } from '@atlaskit/link-provider/responses';
import CardClient from '@atlaskit/link-provider/client';

export const fakeFactory: any = (
	implementation: (url: string) => Promise<JsonLd.Response>,
	implementationPost: () => Promise<JsonLd.Response>,
	implementationPrefetch: () => Promise<JsonLd.Response | undefined>,
	implementationAri: (aris: string[]) => Promise<BatchResponse>,
) =>
	class CustomClient extends CardClient {
		async fetchData(url: string) {
			return await implementation(url);
		}
		async postData() {
			return await implementationPost();
		}
		async prefetchData() {
			return await implementationPrefetch();
		}
		async fetchDataAris(aris: string[]) {
			return await implementationAri(aris);
		}
	};
