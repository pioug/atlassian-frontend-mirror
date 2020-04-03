import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';

export const getAnalyticsAppearance = (
  appearance?: string,
): EDITOR_APPEARANCE_CONTEXT | undefined => {
  switch (appearance) {
    case 'full-page':
      return EDITOR_APPEARANCE_CONTEXT.FIXED_WIDTH;
    case 'full-width':
      return EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH;
    case 'comment':
      return EDITOR_APPEARANCE_CONTEXT.COMMENT;
    case 'chromeless':
      return EDITOR_APPEARANCE_CONTEXT.CHROMELESS;
    case 'mobile':
      return EDITOR_APPEARANCE_CONTEXT.MOBILE;
  }
};
