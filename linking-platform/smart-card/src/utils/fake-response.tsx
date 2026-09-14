import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { mocks } from './mocks';

export const fakeResponse = (): Promise<JsonLd.Response<JsonLd.Data.BaseData>> =>
	Promise.resolve(mocks.success);
