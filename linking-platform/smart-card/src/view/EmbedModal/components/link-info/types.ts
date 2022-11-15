import { IconProps } from '../../../common/Icon';

export type LinkInfoProps = {
  downloadUrl?: string;
  icon?: IconProps;
  providerName?: string;
  onDownloadButtonClick?: () => void;
  onResizeButtonClick?: () => void;
  onViewButtonClick?: () => void;
  size?: string;
  testId?: string;
  title?: string;
  url?: string;
};
