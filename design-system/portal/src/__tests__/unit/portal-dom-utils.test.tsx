import { removePortalParent } from '../../internal/utils/remove-portal-parent';

describe('portal-dom-utils', () => {
	describe('removePortalParent', () => {
		it('removes a direct child element from document.body', () => {
			const parent = document.createElement('div');
			parent.setAttribute('data-testid', 'portal-parent-removal');
			document.body.appendChild(parent);
			expect(document.body.contains(parent)).toBe(true);

			removePortalParent(parent);

			expect(document.body.contains(parent)).toBe(false);
		});
	});
});
