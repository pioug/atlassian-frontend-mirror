import { RequestAccessContextProps } from '../../../types';
import { ContextViewModel } from '../../types';
import { UnresolvedViewProps } from '../unresolved-view/types';

export type NotFoundViewProps = Pick<
  UnresolvedViewProps,
  'inheritDimensions' | 'isSelected' | 'onClick' | 'testId' | 'url'
> & {
  context?: ContextViewModel;
  accessContext?: RequestAccessContextProps;
};
