import { type Config } from '../../config';
import { withProfiling } from '../../self-measurements';
import * as ssr from '../../ssr';

const getSSRDoneTimeValue = withProfiling(function getSSRDoneTimeValue(
	config: Config | undefined,
): number | undefined {
	return config?.ssr?.getSSRDoneTime ? config?.ssr?.getSSRDoneTime() : ssr.getSSRDoneTime();
});

export default getSSRDoneTimeValue;
