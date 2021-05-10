import { Schema } from 'prosemirror-model';
import { Plugin, Transaction, EditorState } from 'prosemirror-state';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EventDispatcher, Dispatch } from '../event-dispatcher';
import { MarkConfig, NodeConfig } from '../types/pm-config';
import { EditorReactContext } from '../types/editor-react-context';
import { FeatureFlags } from '../types/feature-flags';

export type LightPMPluginFactoryParams = {
  // We can type this safe, we already remove the real code from this types
  schema: Schema;
  dispatch: Dispatch;
  eventDispatcher: EventDispatcher;
  providerFactory: ProviderFactory;
  // We dont use this for now
  props: {};
  prevProps?: {};
  portalProviderAPI: any;
  reactContext: () => EditorReactContext;
  dispatchAnalyticsEvent: any;
  featureFlags: FeatureFlags;
};
export type LightPMPluginFactory = (
  params: LightPMPluginFactoryParams,
) => Plugin | undefined;
export type LightPMPlugin = {
  name: string;
  plugin: LightPMPluginFactory;
};

export type OnEditorViewStateUpdated = (props: {
  readonly originalTransaction: Readonly<Transaction>;
  readonly transactions: Transaction[];
  readonly oldEditorState: Readonly<EditorState>;
  readonly newEditorState: Readonly<EditorState>;
}) => void;

export interface LightEditorPlugin {
  name: string;
  marks?: () => MarkConfig[];
  nodes?: () => NodeConfig[];
  pmPlugins?: (pluginOptions?: any) => Array<LightPMPlugin>;
  pluginsOptions?: Record<string, any>;
  onEditorViewStateUpdated?: OnEditorViewStateUpdated;
}
