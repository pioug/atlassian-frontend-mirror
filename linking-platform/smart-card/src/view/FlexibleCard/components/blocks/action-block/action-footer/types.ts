import type { PositiveSpaceToken as Space } from '@atlaskit/primitives/compiled/components/types';

import type { ActionMessage } from '../../../actions/action/types';

export type ActionFooterProps = {
	message?: ActionMessage;
	paddingInline?: Space;
	spaceInline?: Space;
	testId?: string;
};
