import { Action } from 'react-sweet-state';

import { getJastFromState } from '../../plugins/jql-ast';
import { replaceRichInlineNodes } from '../../plugins/rich-inline-nodes/util/replace-nodes-transaction';
import { actions } from '../index';
import { HydratedValuesMap, Props, State } from '../types';

import { ValidQueryVisitor } from './util';

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

      const hydratedValuesMap: HydratedValuesMap = Object.entries(
        newHydratedValues,
      ).reduce((map, [fieldName, values]) => {
        const valueMap = new Map(oldHydratedValues[fieldName]);
        values.forEach(value => {
          valueMap.set(value.id, value);
        });
        return {
          ...map,
          [fieldName]: valueMap,
        };
      }, {});

      setState({
        hydratedValues: hydratedValuesMap,
      });

      dispatch(replaceHydratedValuesWithRichInlineNodes());
    } catch (error) {
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
