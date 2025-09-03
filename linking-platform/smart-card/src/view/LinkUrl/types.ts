export interface LinkUrlProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	/**
	 * Determines if we want to perform a link safety check. True by default.
	 */
	checkSafety?: boolean;
	/**
	 * Determines if we want to resolve the URL in the background for Rovo indexing. This has no impact on the UI/UX. False by default.
	 */
	enableResolve?: boolean;
	isLinkComponent?: boolean;
	testId?: string;
}

export type PackageDataType = {
	componentName: 'linkUrl';
	packageName: string;
	packageVersion: string;
};
