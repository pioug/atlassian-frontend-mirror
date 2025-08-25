import { type JsonLd } from '@atlaskit/json-ld-types';
import { type AnyAction } from 'redux';
import type Environments from './environments';

export interface InvokePayload<T> {
	action: T;
	context?: string;
	key: string;
}

export type InvocationSearchPayload = {
	context?: InvocationContext;
	query: string;
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
	metadataStatus?: MetadataStatus;
	payload?: T;
	type: CardActionType;
	url: string;
}
export interface ServerActionOpts {
	payload: ServerActionPayload;
	type: string;
}
export interface ServerActionPayload {
	context?: JsonLd.Primitives.Object | JsonLd.Primitives.Link;
	id: string;
}

export interface InlineCardAdf {
	attrs: {
		url: string;
	};
	type: 'inlineCard';
}
export interface BlockCardAdf {
	attrs: {
		url: string;
	};
	type: 'blockCard';
}
export interface EmbedCardAdf {
	attrs: {
		layout: 'wide';
		url: string;
	};
	type: 'embedCard';
}

export interface DatasourceAdfTableViewColumn {
	isWrapped?: boolean;
	key: string;
	width?: number;
}

export interface DatasourceAdfTableView {
	properties?: {
		columns: DatasourceAdfTableViewColumn[];
	};
	type: 'table';
}
// TODO Remove me when next View be added. I am here as an example of intent
// export interface DatasourceAdfSomethingView {
//   type: 'something';
//   properties: {
//     blah: string[];
//   };
// }

export interface Datasource<P extends Record<string, unknown> = Record<string, unknown>> {
	id: string;
	parameters: P;
	views: DatasourceAdfView[];
}

export type DatasourceAdfView = DatasourceAdfTableView /*| DatasourceAdfSomethingView*/;

export interface DatasourceAdf<P extends Record<string, unknown> = Record<string, unknown>> {
	attrs: {
		datasource: Datasource<P>;
		url?: string;
	};
	type: 'blockCard';
}
export type CardAdf = InlineCardAdf | BlockCardAdf | EmbedCardAdf;

export type EnvironmentsKeys = keyof typeof Environments | 'custom';

export { type AvailableSite, AvailableSitesProductType } from './hooks/useAvailableSites/types';

export type ProductType =
	| 'CONFLUENCE'
	| 'ATLAS'
	| 'BITBUCKET'
	| 'TRELLO'
	| 'CSM'
	| 'JSW'
	| 'JWM'
	| 'JSM'
	| 'JPD'
	| 'ELEVATE';
