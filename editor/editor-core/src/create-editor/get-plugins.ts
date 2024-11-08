import type { IntlShape } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ReactHookFactory, UIComponentFactory } from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { Dispatch, EventDispatcher } from '../event-dispatcher';
import type { FeatureFlags } from '../types/feature-flags';
import type { MarkConfig, NodeConfig } from '../types/pm-config';

export type LightPMPluginFactoryParams = {
	// We can type this safe, we already remove the real code from this types
	schema: Schema;
	dispatch: Dispatch;
	eventDispatcher: EventDispatcher;
	providerFactory: ProviderFactory;
	// We dont use this for now
	props: {};
	prevProps?: {};
	portalProviderAPI: PortalProviderAPI;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	featureFlags: FeatureFlags;
	getIntl: () => IntlShape;
};
export type LightPMPluginFactory = (params: LightPMPluginFactoryParams) => SafePlugin | undefined;
export type LightPMPlugin = {
	name: string;
	plugin: LightPMPluginFactory;
};

export type OnEditorViewStateUpdated = (props: {
	readonly originalTransaction: Readonly<Transaction>;
	readonly transactions: ReadonlyArray<Transaction>;
	readonly oldEditorState: Readonly<EditorState>;
	readonly newEditorState: Readonly<EditorState>;
}) => void;

export interface LightEditorPlugin {
	name: string;
	marks?: () => MarkConfig[];
	nodes?: () => NodeConfig[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pmPlugins?: (pluginOptions?: any) => Array<LightPMPlugin>;
	contentComponent?: UIComponentFactory;
	usePluginHook?: ReactHookFactory;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pluginsOptions?: Record<string, any>;
	onEditorViewStateUpdated?: OnEditorViewStateUpdated;
}
