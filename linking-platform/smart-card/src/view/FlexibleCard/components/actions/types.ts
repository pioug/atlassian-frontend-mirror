import type { Optional } from '../../types';

import type { ActionProps } from './action/types';

/**
 * Action based on link data.
 * Action behaviour is determined by the availability of the link data.
 */
export type LinkActionProps = Optional<ActionProps, 'onClick'>;
