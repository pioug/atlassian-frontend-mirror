export type RendererAppearance =
  // Note: this comment is replicated in packages/editor/editor-core/src/types/editor-props.ts
  // any changes should be made in both locations
  /*
  Configure the display mode of the editor. Different modes may have different feature sets supported.

  - `comment` - should be used for things like comments where you have a field input but require a toolbar & save/cancel buttons
  - `full-page` - should be used for a full page editor where it is the user focus of the page
  - `chromeless` - is essentially the `comment` editor but without the editor chrome, like toolbar & save/cancel buttons
  - `mobile` - is used when consumed in a mobile web view (by mobile bridge).
  */
  'comment' | 'full-page' | 'full-width' | 'mobile' | undefined;

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

export type NodeComponentsProps = {
  [key: string]: React.ComponentType<React.PropsWithChildren<any>>;
};

export type HeadingAnchorLinksProps = boolean | HeadingAnchorLinksConfig;
