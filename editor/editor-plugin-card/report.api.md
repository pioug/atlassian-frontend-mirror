<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/editor-plugin-card"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
import type { ACTION } from '@atlaskit/editor-common/analytics';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import type { CardOptions } from '@atlaskit/editor-common/card';
import type { CardPluginActions } from '@atlaskit/editor-common/card';
import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import type { CardReplacementInputMethod } from '@atlaskit/editor-common/card';
import type { DatasourceModalType } from '@atlaskit/editor-common/types';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { LinkPickerOptions } from '@atlaskit/editor-common/types';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { Node as Node_2 } from '@atlaskit/editor-prosemirror/model';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { SmartLinkEvents } from '@atlaskit/smart-card';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

// @public (undocumented)
type CardInfo = {
	title?: string;
	url?: string;
	pos: number;
};

// @public (undocumented)
export type CardPlugin = NextEditorPlugin<
	'card',
	{
		pluginConfiguration: CardPluginOptions;
		dependencies: [
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			WidthPlugin,
			DecorationsPlugin,
			GridPlugin,
			FloatingToolbarPlugin,
			HyperlinkPlugin,
		];
		sharedState: CardPluginState | null;
		actions: CardPluginActions;
	}
>;

// @public
export const cardPlugin: CardPlugin;

// @public (undocumented)
type CardPluginEvent = DatasourceEvent | LinkEvent;

// @public (undocumented)
type CardPluginOptions = CardOptions & {
	editorAppearance?: EditorAppearance;
	platform: 'web';
	fullWidthMode?: boolean;
	linkPicker?: LinkPickerOptions;
	cardPluginEvents?: EditorCardPluginEvents<CardPluginEvent>;
};

// @public (undocumented)
type CardPluginState = {
	requests: Request_2[];
	provider: CardProvider | null;
	cards: CardInfo[];
	showLinkingToolbar: boolean;
	smartLinkEvents?: SmartLinkEvents;
	editorAppearance?: EditorAppearance;
	showDatasourceModal: boolean;
	datasourceModalType?: DatasourceModalType;
	datasourceTableRef?: HTMLElement;
	layout?: DatasourceTableLayout;
	inlineCardAwarenessCandidatePosition?: number;
	overlayCandidatePosition?: number;
	removeOverlay?: () => void;
	selectedInlineLinkPosition?: number;
	allowEmbeds?: boolean;
	allowBlockCards?: boolean;
};

// @public (undocumented)
type DatasourceCreatedEvent = {
	event: EVENT.CREATED;
	subject: EVENT_SUBJECT.DATASOURCE;
	data: Metadata_2;
};

// @public (undocumented)
type DatasourceDeletedEvent = {
	event: EVENT.DELETED;
	subject: EVENT_SUBJECT.DATASOURCE;
	data: Metadata_2;
};

// @public (undocumented)
type DatasourceEvent = DatasourceCreatedEvent | DatasourceDeletedEvent | DatasourceUpdatedEvent;

// @public (undocumented)
type DatasourceTableLayout = 'center' | 'full-width' | 'wide';

// @public (undocumented)
type DatasourceUpdatedEvent = {
	event: EVENT.UPDATED;
	subject: EVENT_SUBJECT.DATASOURCE;
	data: Metadata_2<UpdateMetadata>;
};

// @public (undocumented)
type EditorCardPluginEvents<T> = {
	push: (...events: T[]) => void;
	subscribe: (listener: Subscriber<T>) => () => void;
	flush: () => void;
	getSize: () => number;
};

// @public (undocumented)
enum EVENT {
	// (undocumented)
	CREATED = 'created',
	// (undocumented)
	DELETED = 'deleted',
	// (undocumented)
	UPDATED = 'updated',
}

// @public (undocumented)
enum EVENT_SUBJECT {
	// (undocumented)
	DATASOURCE = 'datasource',
	// (undocumented)
	LINK = 'link',
}

// @public
type LinkCreatedEvent = {
	event: EVENT.CREATED;
	subject: EVENT_SUBJECT.LINK;
	data: Metadata_2;
};

// @public (undocumented)
type LinkDeletedEvent = {
	event: EVENT.DELETED;
	subject: EVENT_SUBJECT.LINK;
	data: Metadata_2;
};

// @public (undocumented)
type LinkEvent = LinkCreatedEvent | LinkDeletedEvent | LinkUpdatedEvent;

// @public (undocumented)
type LinkUpdatedEvent = {
	event: EVENT.UPDATED;
	subject: EVENT_SUBJECT.LINK;
	data: Metadata_2<UpdateMetadata>;
};

// @public (undocumented)
type Metadata_2<T = {}> = {
	node: Node_2;
	isUndo?: boolean;
	isRedo?: boolean;
	action?: string;
	inputMethod?: string;
	sourceEvent?: unknown;
	nodeContext?: string;
} & T;

// @public (undocumented)
type Request_2 = {
	pos: number;
	url: string;
	appearance: CardAppearance;
	compareLinkText: boolean;
	source: CardReplacementInputMethod;
	previousAppearance?: 'url' | CardAppearance;
	analyticsAction?: ACTION;
	shouldReplaceLink?: boolean;
	sourceEvent?: UIAnalyticsEvent | null | undefined;
};
export { Request_2 as Request };

// @public (undocumented)
type Subscriber<T> = (event: T) => void;

// @public (undocumented)
type UpdateMetadata = {
	previousDisplay?: string;
};

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
	"@atlaskit/link-provider": "^1.6.2",
	"react": "^16.8.0",
	"react-intl-next": "npm:react-intl@^5.18.1"
}
```

<!--SECTION END: Peer Dependencies-->
