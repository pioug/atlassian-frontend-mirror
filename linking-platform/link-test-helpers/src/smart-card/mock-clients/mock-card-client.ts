import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient } from '@atlaskit/link-provider';

export class MockCardClient extends CardClient {
	prefetchData(url: string): Promise<JsonLd.Response | undefined> {
		return Promise.resolve(undefined);
	}
}
