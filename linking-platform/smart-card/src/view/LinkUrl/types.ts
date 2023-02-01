export interface LinkUrlProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Determines if we want to perform a link safety check. True by default.
   */
  checkSafety?: boolean;
  testId?: string;
}

export type PackageDataType = {
  packageName: '@atlaskit/smart-card';
  packageVersion: string;
  componentName: 'linkUrl';
};
