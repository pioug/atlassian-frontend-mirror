import { RequestAccessContextProps } from '../../../types';
import { ContextViewModel } from '../../types';

export type ForbiddenViewProps = {
  context?: ContextViewModel;
  inheritDimensions?: boolean;
  isSelected?: boolean;
  onAuthorise?: () => void;
  onClick?: (evt: React.MouseEvent) => void;
  requestAccessContext: RequestAccessContextProps;
  testId?: string;
  url: string;
};
