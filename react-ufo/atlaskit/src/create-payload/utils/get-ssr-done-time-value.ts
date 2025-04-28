import { type Config } from '../../config';
import * as ssr from '../../ssr';

function getSSRDoneTimeValue(config: Config | undefined): number | undefined {
	return config?.ssr?.getSSRDoneTime ? config?.ssr?.getSSRDoneTime() : ssr.getSSRDoneTime();
}

export default getSSRDoneTimeValue;
