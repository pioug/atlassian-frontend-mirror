import type { IntlShape } from 'react-intl';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import type { MediaPluginOptions } from '../types';

import { ReactMediaGroupNode } from './mediaGroup';

export const lazyMediaGroupView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	options: MediaPluginOptions | undefined = {},
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	intl?: IntlShape,
): NodeViewConstructor => {
	return ReactMediaGroupNode(portalProviderAPI, eventDispatcher, providerFactory, options, api, intl);
};
