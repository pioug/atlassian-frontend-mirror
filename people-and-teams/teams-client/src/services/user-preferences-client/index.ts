import { DEFAULT_CONFIG } from '../constants';
import { UserPreferencesClient } from './UserPreferencesClient';

const _default_1: UserPreferencesClient = new UserPreferencesClient({
	serviceUrl: DEFAULT_CONFIG.stargateRoot,
});

export default _default_1;
