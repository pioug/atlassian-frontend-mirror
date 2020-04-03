import { CardState } from '../../state/types';

export type BlockCardProps = {
  url: string;
  cardState: CardState;
  handleAuthorize: (() => void) | undefined;
  handleErrorRetry: () => void;
  handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  isSelected?: boolean;
  onResolve?: (data: { url?: string; title?: string }) => void;
  testId?: string;
};
