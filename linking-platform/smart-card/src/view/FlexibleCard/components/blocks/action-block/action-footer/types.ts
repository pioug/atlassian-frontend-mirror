import type { Space } from '@atlaskit/primitives';
import type { ActionMessage } from '../../../actions/action/types';

export type ActionFooterProps = {
	message?: ActionMessage;
	paddingInline?: Space;
	spaceInline?: Space;
	testId?: string;
};
