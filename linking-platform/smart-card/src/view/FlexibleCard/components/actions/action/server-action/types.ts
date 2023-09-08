import { ActionProps } from '../types';
import { InvokeRequestWithCardDetails } from '../../../../../../state/hooks/use-invoke/types';

export type ServerActionProps = Omit<ActionProps, 'onClick'> & {
  action?: InvokeRequestWithCardDetails;
  onClick?: ActionProps['onClick'];
};
