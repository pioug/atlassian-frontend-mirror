import { type JsonLd } from '@atlaskit/json-ld-types';

import { type InvokeClientOpts, type InvokeServerOpts } from './invoke-opts';

export type InvokeHandler = (
	opts: InvokeClientOpts | InvokeServerOpts,
) => Promise<JsonLd.Response | void>;
