import type { IntlShape } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { Dispatch, EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	FeatureFlags,
	MarkConfig,
	NodeConfig,
	ReactHookFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

export type LightPMPluginFactoryParams = {
	dispatch: Dispatch;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	eventDispatcher: EventDispatcher;
	featureFlags: FeatureFlags;
	getIntl: () => IntlShape;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	portalProviderAPI: PortalProviderAPI;
	prevProps?: Object;
	// We dont use this for now
	props: Object;
	providerFactory: ProviderFactory;
	// We can type this safe, we already remove the real code from this types
	schema: Schema;
};
export type LightPMPluginFactory = (params: LightPMPluginFactoryParams) => SafePlugin | undefined;
export type LightPMPlugin = {
	name: string;
	plugin: LightPMPluginFactory;
};

export type OnEditorViewStateUpdated = (props: {
	readonly newEditorState: Readonly<EditorState>;
	readonly oldEditorState: Readonly<EditorState>;
	readonly originalTransaction: Readonly<Transaction>;
	readonly transactions: ReadonlyArray<Transaction>;
}) => void;

export interface LightEditorPlugin {
	contentComponent?: UIComponentFactory;
	marks?: () => MarkConfig[];
	name: string;
	nodes?: () => NodeConfig[];
	onEditorViewStateUpdated?: OnEditorViewStateUpdated;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pluginsOptions?: Record<string, any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pmPlugins?: (pluginOptions?: any) => Array<LightPMPlugin>;
	usePluginHook?: ReactHookFactory;
}
