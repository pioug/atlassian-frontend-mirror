import { Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { IntlShape } from 'react-intl-next';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  ReactHookFactory,
  UIComponentFactory,
} from '@atlaskit/editor-common/types';

import { Dispatch, EventDispatcher } from '../event-dispatcher';
import { EditorReactContext } from '../types/editor-react-context';
import { FeatureFlags } from '../types/feature-flags';
import { MarkConfig, NodeConfig } from '../types/pm-config';

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
  getIntl: () => IntlShape;
};
export type LightPMPluginFactory = (
  params: LightPMPluginFactoryParams,
) => SafePlugin | undefined;
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
  pmPlugins?: (pluginOptions?: any) => Array<LightPMPlugin>;
  contentComponent?: UIComponentFactory;
  usePluginHook?: ReactHookFactory;
  pluginsOptions?: Record<string, any>;
  onEditorViewStateUpdated?: OnEditorViewStateUpdated;
}
