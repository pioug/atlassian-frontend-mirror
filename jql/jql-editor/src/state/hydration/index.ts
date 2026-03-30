import { type Action } from 'react-sweet-state';

import { fg } from '@atlaskit/platform-feature-flags';

import { getJastFromState } from '../../plugins/jql-ast';
import { replaceRichInlineNodes } from '../../plugins/rich-inline-nodes/util/replace-nodes-transaction';
import { actions } from '../index';
import { type HydratedValuesMap, type Props, type State } from '../types';

import { normaliseHydrationKey, ValidQueryVisitor } from './util';

export const hydrateQuery =
	(): Action<State, Props, Promise<void>> =>
	async ({ setState, getState, dispatch }, { onHydrate }) => {
		const {
			query,
			hydratedValues: oldHydratedValues,
			enableRichInlineNodes,
			editorState,
		} = getState();

		if (!enableRichInlineNodes || !onHydrate || !query) {
			return;
		}

		let queryToHydrate = query;

		const jast = getJastFromState(editorState);

		// Hydration API will fail for syntactically invalid queries, including partial queries. We do want to hydrate those
		// as well to be able to handle queries like `assignee in (abc-123-def`, so we build an equivalent valid query.
		if (jast.query && jast.errors.length) {
			const visitor = new ValidQueryVisitor();
			queryToHydrate = jast.query.accept(visitor);
		}

		if (!queryToHydrate) {
			return;
		}

		try {
			const newHydratedValues = await onHydrate(queryToHydrate);

			// IMPORTANT: Field name keys must be normalised (unquoted + lowercased) when storing hydrated values.
			// The hydration API returns field names in a canonical format (e.g. 'Project[AtlassianProject]'),
			// but lookup keys from ProseMirror node attributes may differ in quoting and casing
			// (e.g. '"project[atlassianproject]"'). normaliseHydrationKey ensures both storage and lookup use
			// the same key format. See normaliseHydrationKey in ./util.ts.
			const hydratedValuesMap: HydratedValuesMap = Object.entries(newHydratedValues).reduce(
				(map, [fieldName, values]) => {
					const fieldNameToUse = fg('projects_in_jira_eap_drop2')
						? normaliseHydrationKey(fieldName)
						: fieldName;
					const valueMap = new Map(oldHydratedValues[fieldNameToUse]);
					values.forEach((value) => {
						valueMap.set(value.id, value);
					});
					return {
						...map,
						[fieldNameToUse]: valueMap,
					};
				},
				{},
			);

			setState({
				hydratedValues: hydratedValuesMap,
			});

			dispatch(replaceHydratedValuesWithRichInlineNodes());
		} catch {
			// Hydration failed, do nothing
		}
	};

const replaceHydratedValuesWithRichInlineNodes =
	(): Action<State, Props> =>
	({ getState, dispatch }) => {
		const { editorState, hydratedValues } = getState();
		const transaction = replaceRichInlineNodes(editorState, hydratedValues);
		dispatch(actions.onApplyEditorTransaction(transaction));
	};
