import { type IconProps } from '../../../common/Icon';

export type LinkInfoProps = {
	icon?: IconProps;
	providerName?: string;
	onDownloadButtonClick?: () => void;
	onResizeButtonClick?: () => void;
	onViewButtonClick?: () => void;
	size?: string;
	testId?: string;
	title?: string;
};
