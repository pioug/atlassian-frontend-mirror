import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingAnimationReducedMotionExample from '../126-testing-animation-reduced-motion';

export const TestingAnimationReducedMotion: WorkbenchExample<
	typeof TestingAnimationReducedMotionExample
> = wb(TestingAnimationReducedMotionExample);
