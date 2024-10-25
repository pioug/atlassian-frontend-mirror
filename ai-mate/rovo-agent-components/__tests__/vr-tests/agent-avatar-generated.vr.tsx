import { snapshot } from '@af/visual-regression';

import AgentAvatarGeneratedExample from '../../examples/03-agent-avatar-generated';

import { snapshotOptions } from './utils';

// Upgrade react 18 error - looks like image is too big
snapshot.skip(AgentAvatarGeneratedExample, snapshotOptions);
