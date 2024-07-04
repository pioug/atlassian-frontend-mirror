import React from 'react';
import { mount } from 'enzyme';
import { Shortcut } from '../..';

describe('Shortcut', () => {
	const originalEventListener = document.addEventListener;

	afterEach(() => {
		document.addEventListener = originalEventListener;
	});

	it('should de-register the key event listener on unmount', () => {
		document.removeEventListener = (name: string) => {
			expect(name).toEqual('keyup');
		};

		const el = mount(
			<div>
				<Shortcut code={'ArrowLeft'} handler={() => {}} eventType={'keyup'} />
			</div>,
		);

		el.unmount();
	});

	// FIXME: Jest upgrade causes this error
	// Expected done to be called once, but it was called multiple times.
	it.skip('should execute handler', (done) => {
		mount(
			<div>
				<Shortcut code={'ArrowLeft'} handler={done} eventType={'keyup'} />
			</div>,
		);

		const e = new KeyboardEvent('keyup', {
			bubbles: true,
			cancelable: true,
			code: 'ArrowLeft',
		} as any);
		document.dispatchEvent(e);
		expect(document.dispatchEvent(e)).toBeTruthy();
	});
});
