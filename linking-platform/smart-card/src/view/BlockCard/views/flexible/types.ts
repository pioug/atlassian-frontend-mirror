import { FlexibleCardProps } from '../../../FlexibleCard/types';

export type FlexibleBlockCardProps = Pick<
  FlexibleCardProps,
  | 'analytics'
  | 'cardState'
  | 'id'
  | 'onAuthorize'
  | 'onClick'
  | 'onError'
  | 'onResolve'
  | 'renderers'
  | 'actionOptions'
  | 'testId'
  | 'url'
>;
