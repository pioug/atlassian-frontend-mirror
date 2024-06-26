<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/jql-editor-common"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
import { JQLClause } from '@atlaskit/jql-autocomplete';
import { Observable } from 'rxjs/Observable';

// @public (undocumented)
export const ANALYTICS_CHANNEL = 'jql-editor';

// @public (undocumented)
export type AnalyticsAttributes = Record<string, AnalyticsValue>;

// @public (undocumented)
type AnalyticsValue =
	| PrimitiveAttribute
	| PrimitiveAttribute[]
	| Record<string, PrimitiveAttribute | PrimitiveAttribute[]>;

// @public (undocumented)
export type AutocompleteOption = {
	name: string;
	value: string;
	isDeprecated?: boolean;
	deprecatedSearcherKey?: string;
	fieldType?: string;
	valueType?: AutocompleteValueType;
	isListFunction?: boolean;
	nameOnRichInlineNode?: string;
};

// @public (undocumented)
export type AutocompleteOptions = AutocompleteOption[];

// @public (undocumented)
export type AutocompleteProvider = {
	onFields: (query?: string, clause?: JQLClause) => Observable<AutocompleteOptions>;
	onOperators: (query?: string, field?: string) => Observable<AutocompleteOptions>;
	onValues: (query?: string, field?: string) => Observable<AutocompleteOptions>;
	onFunctions: (
		query?: string,
		field?: string,
		isListOperator?: boolean,
	) => Observable<AutocompleteOptions>;
};

// @public (undocumented)
export type AutocompleteValueType = 'user';

// @public (undocumented)
export enum EventType {
	// (undocumented)
	OPERATIONAL = 'operational',
	// (undocumented)
	SCREEN = 'screen',
	// (undocumented)
	TRACK = 'track',
	// (undocumented)
	UI = 'ui',
}

// @public (undocumented)
export type JqlAnalyticsEvent<Action, ActionSubject, ActionSubjectId> = {
	action: Action;
	actionSubject: ActionSubject;
	actionSubjectId?: ActionSubjectId;
	attributes?: AnalyticsAttributes;
	eventType: EventType;
};

export { JQLClause };

// @public (undocumented)
type PrimitiveAttribute = boolean | number | string;

// @public (undocumented)
export const useJqlPackageAnalytics: <Action, ActionSubject, ActionSubjectId>(
	analyticsSource: string,
	packageName: string,
	packageVersion: string,
	analyticsChannel: string,
) => {
	createAndFireAnalyticsEvent: (
		payload: JqlAnalyticsEvent<Action, ActionSubject, ActionSubjectId>,
	) => void;
};

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
	"react": "^16.8.0"
}
```

<!--SECTION END: Peer Dependencies-->
