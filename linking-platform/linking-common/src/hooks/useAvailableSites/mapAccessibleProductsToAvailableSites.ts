import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type AccessibleProduct, type AvailableSite } from './types';

export const mapAccessibleProductsToAvailableSites: any = (
	data: AccessibleProduct,
): AvailableSite[] => {
	const sites: AvailableSite[] = [];

	data.products.forEach((product) => {
		product.workspaces.forEach((workspace) => {
			const currentSite = sites.find((site) => site.cloudId === workspace.cloudId);
			if (currentSite) {
				currentSite.products.push(product.productId);
				return currentSite;
			}
			sites.push({
				avatarUrl: workspace.workspaceAvatarUrl,
				cloudId: workspace.cloudId,
				displayName: fg('platform_lp_sllv_display_name_fallback')
					? workspace.workspaceDisplayName || workspace.cloudUrl
					: (workspace.workspaceDisplayName as string),
				products: [product.productId],
				url: workspace.cloudUrl,
			});
		});
	});
	return sites;
};
