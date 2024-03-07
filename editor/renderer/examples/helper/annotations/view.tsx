import type { InlineCommentViewComponentProps } from '@atlaskit/editor-common/types';

export const ExampleViewInlineCommentComponent = (
  props: React.PropsWithChildren<InlineCommentViewComponentProps>,
) => {
  console.log(props);
  return null;
};
