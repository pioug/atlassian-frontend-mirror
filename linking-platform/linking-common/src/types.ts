import { type JsonLd } from '@atlaskit/json-ld-types';
import { type AnyAction } from 'redux';
import type Environments from './environments';

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

export interface DatasourceAdfTableViewColumn {
	key: string;
	width?: number;
	isWrapped?: boolean;
}

export interface DatasourceAdfTableView {
	type: 'table';
	properties?: {
		columns: DatasourceAdfTableViewColumn[];
	};
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
	type: 'blockCard';
	attrs: {
		url?: string;
		datasource: Datasource<P>;
	};
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
