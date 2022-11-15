import { JsonLd } from 'json-ld-types';
import { InvokeClientOpts, InvokeServerOpts } from './invoke-opts';

export type InvokeHandler = (
  opts: InvokeClientOpts | InvokeServerOpts,
) => Promise<JsonLd.Response | void>;
