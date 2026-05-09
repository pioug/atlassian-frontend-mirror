import { act, screen } from '@atlassian/testing-library';

import { _resetFlagsForTesting, showFlag } from '../index';

const FLAG_GROUP_MOUNT_POINT_ID = 'smart-link-flags-mount';

describe('showFlag (module-level singleton)', () => {
	beforeEach(() => {
		act(() => {
			_resetFlagsForTesting();
		});
	});

	afterEach(() => {
		act(() => {
			_resetFlagsForTesting();
		});
	});

	it('creates the flag group container on first call', () => {
		expect(document.getElementById(FLAG_GROUP_MOUNT_POINT_ID)).toBeNull();

		act(() => {
			showFlag({ id: 'flag-1', title: 'Hello' });
		});

		expect(document.getElementById(FLAG_GROUP_MOUNT_POINT_ID)).not.toBeNull();
	});

	it('renders a flag with the given title', async () => {
		act(() => {
			showFlag({ id: 'flag-1', title: 'Test Flag' });
		});

		// The first showFlag defers renderToRoot via setTimeout(0) so that
		// ExitingPersistence's useEffect can flip appear=false→true first.
		// Use findByText (async) which waits for the deferred render.
		expect(await screen.findByText('Test Flag')).toBeInTheDocument();
	});

	it('renders multiple flags', async () => {
		act(() => {
			showFlag({ id: 'flag-1', title: 'First Flag' });
		});
		act(() => {
			showFlag({ id: 'flag-2', title: 'Second Flag' });
		});

		expect(await screen.findByText('First Flag')).toBeInTheDocument();
		expect(screen.getByText('Second Flag')).toBeInTheDocument();
	});

	it('replaces a flag with the same id', async () => {
		act(() => {
			showFlag({ id: 'flag-1', title: 'Original' });
		});
		expect(await screen.findByText('Original')).toBeInTheDocument();

		act(() => {
			showFlag({ id: 'flag-1', title: 'Replaced' });
		});

		expect(await screen.findByText('Replaced')).toBeInTheDocument();
		expect(screen.queryByText('Original')).not.toBeInTheDocument();
	});

	it('assigns a random id when none is provided', () => {
		act(() => {
			showFlag({ title: 'No ID Flag' });
		});

		expect(document.getElementById(FLAG_GROUP_MOUNT_POINT_ID)).not.toBeNull();
	});

	it('reuses the existing container on subsequent calls', () => {
		act(() => {
			showFlag({ id: 'flag-1', title: 'First' });
		});
		const container1 = document.getElementById(FLAG_GROUP_MOUNT_POINT_ID);

		act(() => {
			showFlag({ id: 'flag-2', title: 'Second' });
		});
		const container2 = document.getElementById(FLAG_GROUP_MOUNT_POINT_ID);

		expect(container1).toBe(container2);
		expect(document.querySelectorAll(`#${FLAG_GROUP_MOUNT_POINT_ID}`).length).toBe(1);
	});
});
