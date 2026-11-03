import React from 'react';

import { renderToString } from 'react-dom/server';

import noop from '@atlaskit/ds-lib/noop';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Breadcrumbs, { BreadcrumbsItem } from '../../../index';

describe('Breadcrumbs SSR with refresh enabled', () => {
	describe('Breadcrumbs SSR', () => {
		it('does not hide the breadcrumb list before client-side measurement', () => {
			passGate('platform_dst_breadcrumbs-refresh');

			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(noop);

			try {
				const view = renderToString(
					<Breadcrumbs testId="breadcrumbs">
						<BreadcrumbsItem href="/one" text="One" />
						<BreadcrumbsItem href="/two" text="Two" />
						<BreadcrumbsItem href="/three" text="Three" />
					</Breadcrumbs>,
				);

				expect(view).toContain('data-testid="breadcrumbs"');
				expect(view).not.toContain('visibility:hidden');
			} finally {
				consoleErrorSpy.mockRestore();
			}
		});
	});
});
