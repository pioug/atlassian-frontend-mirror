import React, { createRef, useRef } from 'react';

import { render, renderHook } from '@testing-library/react';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import useAutoFocus from '../use-auto-focus';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('useAutoFocus()', () => {
	const Component = ({ autoFocus }: { autoFocus: boolean }) => {
		const ref = useRef<HTMLButtonElement>(null);
		useAutoFocus(ref, autoFocus);
		return <button ref={ref} id="test" type="button" />;
	};

	it('should focus on initial render', () => {
		render(<Component autoFocus />);

		expect(document.activeElement?.id).toEqual('test');
	});

	it('should not focus on initial render', () => {
		render(<Component autoFocus={false} />);

		expect(document.activeElement?.id).not.toEqual('test');
	});

	it('should only focus once', () => {
		const { rerender } = render(<Component autoFocus />);
		document.getElementById('test')?.blur();

		rerender(<Component autoFocus />);

		expect(document.activeElement).toBe(document.body);
	});

	it('should focus with a created ref', () => {
		const Component = ({ autoFocus }: { autoFocus: boolean }) => {
			const ref = createRef<HTMLButtonElement>();
			useAutoFocus(ref, autoFocus);
			return <button ref={ref} id="test" type="button" />;
		};

		render(<Component autoFocus />);

		expect(document.activeElement?.id).toEqual('test');
	});

	it('should not blow up for empty calls', () => {
		expect(() => {
			renderHook(() => {
				const ref = createRef<HTMLElement>();

				useAutoFocus(ref, true);
				useAutoFocus(undefined, true);
			});
		}).not.toThrow();
	});
});
