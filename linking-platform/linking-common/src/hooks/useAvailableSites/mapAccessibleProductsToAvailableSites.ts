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
				displayName: workspace.workspaceDisplayName || workspace.cloudUrl,
				products: [product.productId],
				url: workspace.cloudUrl,
			});
		});
	});
	return sites;
};
