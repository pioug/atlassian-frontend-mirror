import { type IconProps } from '../../../common/Icon';

export type LinkInfoProps = {
	icon?: IconProps;
	onDownloadButtonClick?: () => void;
	onResizeButtonClick?: () => void;
	onViewButtonClick?: () => void;
	providerName?: string;
	size?: string;
	testId?: string;
	title?: string;
};
