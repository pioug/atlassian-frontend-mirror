/* eslint-disable @atlassian/testing-library/prefer-atlassian-testing-library */

import React, { useContext, useLayoutEffect } from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, waitFor } from '@atlassian/testing-library';

import { SpotlightContext } from '../../controllers/context';
import { PopoverProvider } from '../popover-provider';
import { PopoverTarget } from './index';

const TargetRefProbe = ({ onRef }: { onRef: (element: HTMLElement | null) => void }) => {
	const { target } = useContext(SpotlightContext);

	useLayoutEffect(() => {
		onRef(target.ref.current);
	}, [onRef, target.ref]);

	return null;
};

describe('PopoverTarget', () => {
	ffTest.on('platform-dst-top-layer-spotlight', 'with top-layer positioning enabled', () => {
		it('stores the target wrapper ref in spotlight context', async () => {
			const onRef = jest.fn();

			render(
				<PopoverProvider>
					<PopoverTarget>Target</PopoverTarget>
					<TargetRefProbe onRef={onRef} />
				</PopoverProvider>,
			);

			await waitFor(() => {
				expect(onRef).toHaveBeenLastCalledWith(expect.any(HTMLDivElement));
			});
		});
	});
});
