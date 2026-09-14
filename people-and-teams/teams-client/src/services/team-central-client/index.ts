import { DEFAULT_CONFIG } from '../constants';
import { logException } from '../sentry/logException';

import { TeamCentralClient } from './TeamCentralClient';

const _default_1: TeamCentralClient = new TeamCentralClient(DEFAULT_CONFIG.stargateRoot, {
	logException,
});

export default _default_1;
