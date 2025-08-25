export interface LinkUrlProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	/**
	 * Determines if we want to perform a link safety check. True by default.
	 */
	checkSafety?: boolean;
	isLinkComponent?: boolean;
	testId?: string;
}

export type PackageDataType = {
	componentName: 'linkUrl';
	packageName: string;
	packageVersion: string;
};
