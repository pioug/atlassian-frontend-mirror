import { useCallback, useMemo } from 'react';

import { useDatasourceClientExtension } from '@atlaskit/link-client-extension/use-data-source-client-extension';
import type {
	AtomicActionExecuteRequest,
	AtomicActionExecuteResponse,
} from '@atlaskit/linking-types/datasource-actions';

import { useDatasourceAnalyticsEvents } from '../../analytics';
import useErrorLogger from '../../hooks/useErrorLogger';
import { useDatasourceItem } from '../index';

import { useAtomicUpdateActionSchema } from './index';
import type { ExecuteFetch } from './index';

/**
 * Given an ARI + fieldKey + integrationKey
 * Returns an executable action that updates a field on the entity if the user has permissions to do so
 *
 * @example
 * ```tsx
 * const { execute } = useExecuteAtomicAction({ ari, fieldKey: 'summary', integrationKey: 'jira' });
 *
 * return <button onClick={() => execute('New summary')}>Update summary</button>;
 * ```
 */
export const useExecuteAtomicAction = ({
	ari,
	fieldKey,
	integrationKey,
}: {
	ari: string;
	fieldKey: string;
	integrationKey: string;
}): {
	execute?: (value: string | number) => Promise<AtomicActionExecuteResponse<unknown>>;
	executeFetch?: ExecuteFetch;
} => {
	const [{ schema, fetchSchema }] = useAtomicUpdateActionSchema({ ari, fieldKey, integrationKey });
	const item = useDatasourceItem({ id: ari });

	const { executeAtomicAction: executeAction, invalidateDatasourceDataCacheByAri } =
		useDatasourceClientExtension();
	const loggerProps = useMemo(
		() => ({
			integrationKey,
		}),
		[integrationKey],
	);
	const { captureError } = useErrorLogger(loggerProps);
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const execute = useCallback(
		(value: string | number) => {
			if (!schema) {
				throw new Error('No action schema found.');
			}

			return executeAction({
				integrationKey,
				actionKey: schema.actionKey,
				parameters: { inputs: { [fieldKey]: value }, target: { ari } },
			})
				.then((resp) => {
					// Force data to refresh after update
					invalidateDatasourceDataCacheByAri(ari);

					fireEvent('operational.actionExecution.success', {
						integrationKey: integrationKey,
						experience: 'datasource',
					});
					return resp;
				})
				.catch((error) => {
					captureError('actionExecution', error);
					// Rethrow up to component for flags and other handling
					throw error;
				});
		},
		[
			schema,
			executeAction,
			integrationKey,
			fieldKey,
			ari,
			invalidateDatasourceDataCacheByAri,
			fireEvent,
			captureError,
		],
	);

	const executeFetch = useCallback(
		<E,>(controlledInputs: AtomicActionExecuteRequest['parameters']['inputs']) => {
			if (!fetchSchema) {
				throw new Error('No supporting action schema found.');
			}

			/**
			 * controlled inputs are useful for search fields, where a variable query is passed to the fetchAction
			 */
			let inputs = controlledInputs;
			if (
				!Object.keys(inputs).length &&
				fetchSchema.inputs &&
				!!Object.keys(fetchSchema.inputs).length
			) {
				const inputKeys = Object.keys(fetchSchema.inputs);
				/**
				 * If present return the input value from the datasource item
				 * e.g. this could be the issueKey or projectId of a Jira issue
				 */
				inputs = inputKeys.reduce<AtomicActionExecuteRequest['parameters']['inputs']>(
					(acc, key: string) => {
						const value = item?.data?.[key]?.data;
						if (typeof value === 'string' || typeof value === 'number') {
							acc[key] = value;
						}
						/**
						 * This allows for the schema and data from the BE to dynamically set the action inputs
						 */
						return acc;
					},
					{},
				);
			}

			// A generic type can allow us here to define the inputs and outputs
			return executeAction({
				integrationKey,
				actionKey: fetchSchema.actionKey,
				parameters: { inputs, target: { ari } },
			})
				.then((resp) => {
					fireEvent('operational.fetchActionExecution.success', {
						integrationKey: integrationKey,
						experience: 'datasource',
					});

					return resp as E;
				})
				.catch((error) => {
					captureError('fetchActionExecution', error);
					// Rethrow up to component for flags and other handling
					throw error;
				});
		},
		[fetchSchema, executeAction, integrationKey, ari, item, fireEvent, captureError],
	);

	return {
		...(schema && { execute }),
		...(fetchSchema && { executeFetch }),
	};
};
