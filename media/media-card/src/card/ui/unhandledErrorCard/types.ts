import { CardDimensions } from '../../../types';

export interface UnhandledErrorCardProps {
  dimensions?: CardDimensions;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
