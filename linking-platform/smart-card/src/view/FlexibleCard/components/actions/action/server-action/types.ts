import type { InvokeRequestWithCardDetails } from '../../../../../../state/hooks/use-invoke/types';
import type { ActionProps } from '../types';

export type ServerActionProps = Omit<ActionProps, 'onClick' | 'onError'> & {
	action?: InvokeRequestWithCardDetails;
	onClick?: ActionProps['onClick'];
	/* An optional error callback */
	onError?: () => void;
};
