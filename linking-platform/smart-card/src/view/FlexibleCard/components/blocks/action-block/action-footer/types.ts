import type { Space } from '@atlaskit/primitives/compiled';

import type { ActionMessage } from '../../../actions/action/types';

export type ActionFooterProps = {
	message?: ActionMessage;
	paddingInline?: Space;
	spaceInline?: Space;
	testId?: string;
};
