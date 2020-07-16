export type RendererAppearance =
  | 'comment'
  | 'full-page'
  | 'full-width'
  | 'mobile'
  | undefined;

export type StickyHeaderConfig = {
  offsetTop?: number;
};

export type StickyHeaderProps =
  | boolean
  | ({
      show?: boolean;
    } & StickyHeaderConfig);

export type HeadingAnchorLinksConfig = {
  activeHeadingId?: string;
  allowNestedHeaderLinks?: boolean;
};

export type HeadingAnchorLinksProps = boolean | HeadingAnchorLinksConfig;
