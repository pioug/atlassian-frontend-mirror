import { JsonLd } from 'json-ld-types';
import { AnyAction } from 'redux';
import Environments from './environments';

export interface InvokePayload<T> {
  key: string;
  context?: string;
  action: T;
}

export type InvocationSearchPayload = {
  query: string;
  context?: InvocationContext;
};

export type InvocationContext = {
  /**
   * The parent context of the resource on which this action is being invoked.
   * See `InvocationSearchRequest` in ORS `openapi.yml`.
   */
  id: string;
};

export type CardAppearance = 'inline' | 'block' | 'embed';

export type CardActionType =
  | 'pending'
  | 'resolving'
  | 'resolved'
  | 'errored'
  | 'fallback'
  | 'reloading'
  | 'metadata';

export type CardType =
  | 'pending'
  | 'resolving'
  | 'resolved'
  | 'errored'
  | 'fallback'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found';

export type MetadataStatus = 'pending' | 'resolved' | 'errored';

export interface CardAction<T = JsonLd.Response> extends AnyAction {
  type: CardActionType;
  url: string;
  payload?: T;
  metadataStatus?: MetadataStatus;
}
export interface ServerActionOpts {
  type: string;
  payload: ServerActionPayload;
}
export interface ServerActionPayload {
  id: string;
  context?: JsonLd.Primitives.Object | JsonLd.Primitives.Link;
}

export interface InlineCardAdf {
  type: 'inlineCard';
  attrs: {
    url: string;
  };
}
export interface BlockCardAdf {
  type: 'blockCard';
  attrs: {
    url: string;
  };
}
export interface EmbedCardAdf {
  type: 'embedCard';
  attrs: {
    url: string;
    layout: 'wide';
  };
}

export interface DatasourceAdfTableView {
  type: 'table';
  properties?: {
    columns: { key: string; width?: number }[];
  };
}
// TODO Remove me when next View be added. I am here as an example of intent
// export interface DatasourceAdfSomethingView {
//   type: 'something';
//   properties: {
//     blah: string[];
//   };
// }

export interface Datasource<
  P extends Record<string, unknown> = Record<string, unknown>,
> {
  id: string;
  parameters: P;
  views: DatasourceAdfView[];
}

export type DatasourceAdfView =
  DatasourceAdfTableView /*| DatasourceAdfSomethingView*/;

export interface DatasourceAdf<
  P extends Record<string, unknown> = Record<string, unknown>,
> {
  type: 'blockCard';
  attrs: {
    url?: string;
    datasource: Datasource<P>;
  };
}
export type CardAdf = InlineCardAdf | BlockCardAdf | EmbedCardAdf;

export type EnvironmentsKeys = keyof typeof Environments;

export {
  type AvailableSite,
  AvailableSitesProductType,
} from './hooks/useAvailableSites/types';
