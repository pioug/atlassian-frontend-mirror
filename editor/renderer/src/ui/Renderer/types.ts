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
