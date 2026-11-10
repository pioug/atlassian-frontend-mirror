import React, { useContext, useEffect } from 'react';

import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import { mockExp } from '@atlassian/experiment-test-utils/mock-exp';
import { act } from '@atlassian/testing-library/testing-library/react';
import { within } from '@atlassian/testing-library/within';

import ReactSerializer from '../../../../react';
import BodiedExtension from '../../../../react/nodes/bodiedExtension';
import {
	ForgeBodiedExtensionHandoffContext,
	ForgeBodiedExtensionHandoffReadyContext,
} from '../../../../react/nodes/forgeBodiedExtensionHandoffContext';
import type { RendererContext } from '../../../../react/types';

const providers = ProviderFactory.create({});
const serializer = new ReactSerializer({});
const renderPage = (
	hasApp: boolean,
	extensionKey = '7be6519f-6039-4662-a5a4-2e38f785dc0a/f9fff7f6-4e74-44eb-9de4-f0be57852570/static/table-filter',
	app: React.ReactElement = <button>Filter table</button>,
) => {
	const rendererContext: RendererContext = {
		adDoc: { type: 'doc', version: 1, content: [] },
		schema: getSchemaBasedOnStage('stage0'),
	};
	return (
		<>
			<BodiedExtension
				providers={providers}
				serializer={serializer}
				rendererContext={rendererContext}
				extensionHandlers={{
					'com.atlassian.ecosystem': () => (hasApp ? app : null),
				}}
				extensionType="com.atlassian.ecosystem"
				extensionKey={extensionKey}
				localId="table"
				startPos={1}
			>
				<table>
					<tbody>
						<tr>
							<td>Native table body</td>
						</tr>
					</tbody>
				</table>
			</BodiedExtension>
			<p>Content after the macro</p>
		</>
	);
};

describe.each([false, true])('Forge handoff hydration with treatment %s', (isEnabled) => {
	it.each([false, true])(
		'preserves the server DOM through hydration and app readiness (app initially present: %s)',
		async (hasApp) => {
			mockExp('cc_aura_table_filter_cls', { isEnabled });
			const container = document.createElement('div');
			container.innerHTML = renderToString(renderPage(hasApp));
			document.body.appendChild(container);
			const serverHtml = container.innerHTML;
			const queries = within(container);
			const serverBody = queries.queryByText('Native table body');
			const serverSibling = queries.getByText('Content after the macro');
			const onRecoverableError = jest.fn();
			let root: Root | undefined;

			try {
				await act(async () => {
					root = hydrateRoot(container, renderPage(hasApp), { onRecoverableError });
				});
				expect(onRecoverableError).not.toHaveBeenCalled();
				expect(container.innerHTML).toBe(serverHtml);
				expect(queries.getByText('Content after the macro')).toBe(serverSibling);
				if (serverBody) {
					expect(queries.getByText('Native table body')).toBe(serverBody);
				}

				await act(async () => root?.render(renderPage(true)));
				expect(queries.getByRole('button', { name: 'Filter table' })).toBeVisible();
				if (isEnabled) {
					expect(queries.getByText('Native table body')).toBe(serverBody);
				} else {
					expect(queries.queryByText('Native table body')).not.toBeInTheDocument();
				}

				await act(async () => {
					window.dispatchEvent(
						new MessageEvent('message', {
							source: window,
							origin: window.location.origin,
							data: { source: 'forge-extension', type: 'EXTENSION_READY', localId: 'table' },
						}),
					);
				});
				expect(queries.queryByText('Native table body')).not.toBeInTheDocument();
				expect(queries.getByRole('button', { name: 'Filter table' })).toBeVisible();
				expect(queries.getByText('Content after the macro')).toBe(serverSibling);
				expect(onRecoverableError).not.toHaveBeenCalled();
			} finally {
				await act(async () => root?.unmount());
				container.remove();
			}
		},
	);
});

it('hydrates a host-selected UI Kit body and retains it while the lazy renderer is empty', async () => {
	const instances = new Map([['table', 'scroll-ignore']]);
	const EmptyRenderer = () => null;
	const ReadyRenderer = () => {
		const ready = useContext(ForgeBodiedExtensionHandoffReadyContext);
		useEffect(() => {
			if (ready?.localId === 'table') ready.onReady();
		}, [ready]);
		return <button>Client body</button>;
	};
	const page = (hasApp = false, app = <EmptyRenderer />) => (
		<ForgeBodiedExtensionHandoffContext.Provider value={instances}>
			{renderPage(hasApp, 'scroll-ignore', app)}
		</ForgeBodiedExtensionHandoffContext.Provider>
	);
	const container = document.createElement('div');
	container.innerHTML = renderToString(page());
	document.body.appendChild(container);
	const queries = within(container);
	const body = queries.getByText('Native table body');
	const sibling = queries.getByText('Content after the macro');
	const onRecoverableError = jest.fn();
	let root: Root | undefined;
	try {
		await act(async () => {
			root = hydrateRoot(container, page(), { onRecoverableError });
		});
		expect(queries.getByText('Native table body')).toBe(body);
		await act(async () => root?.render(page(true)));
		expect(body).toBeVisible();
		expect(queries.getByText('Content after the macro')).toBe(sibling);
		await act(async () => root?.render(page(true, <ReadyRenderer />)));
		expect(body).not.toBeInTheDocument();
		expect(queries.getByRole('button', { name: 'Client body' })).toBeVisible();
		expect(queries.getByText('Content after the macro')).toBe(sibling);
		expect(onRecoverableError).not.toHaveBeenCalled();
	} finally {
		await act(async () => root?.unmount());
		container.remove();
	}
});
