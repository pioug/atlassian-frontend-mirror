import { type Config } from '../../config';
import * as ssr from '../../ssr';

export default function getSSRDoneTimeValue(config: Config | undefined): number | undefined {
	return config?.ssr?.getSSRDoneTime ? config?.ssr?.getSSRDoneTime() : ssr.getSSRDoneTime();
}
