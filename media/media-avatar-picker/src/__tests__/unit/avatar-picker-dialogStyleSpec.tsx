import React from 'react';
import { render } from '@atlassian/testing-library';
import { DragZone } from '../../image-navigator/dragZone';

describe('Avatar Picker Styles', () => {
	describe('image-navigator', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = render(<DragZone isDroppingFile={false} showBorder={true} />);
			await expect(container).toBeAccessible();
		});

		it('DragZone is dropping file', () => {
			const { container } = render(<DragZone isDroppingFile={true} showBorder={true} />);

			expect(container).toMatchInlineSnapshot(`
			<div>
			  <style
			    data-cmpld="true"
			  >REDACTED</style>
			  <div
			    class="REDACTED"
			    data-testid="dragzone"
			  />
			</div>
		`);
		});

		it('DragZone is not dropping file', () => {
			const { container } = render(<DragZone isDroppingFile={false} showBorder={true} />);

			expect(container).toMatchInlineSnapshot(`
			<div>
			  <style
			    data-cmpld="true"
			  >REDACTED</style>
			  <div
			    class="REDACTED"
			    data-testid="dragzone"
			  />
			</div>
		`);
		});
	});
});
