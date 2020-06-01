import { CardState } from '../../state/types';

export type EmbedCardProps = {
  url: string;
  cardState: CardState;
  handleAuthorize: (() => void) | undefined;
  handleErrorRetry: () => void;
  handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  isSelected?: boolean;
  isFrameVisible?: boolean;
  onResolve?: (data: { url?: string; title?: string }) => void;
  testId?: string;
};
