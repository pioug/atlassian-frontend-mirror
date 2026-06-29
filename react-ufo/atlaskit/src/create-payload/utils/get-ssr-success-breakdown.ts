import * as ssr from '../../ssr';
import type { SsrSuccessBreakdown } from '../../ssr';

export default function getSSRSuccessBreakdown(): SsrSuccessBreakdown | undefined {
	return ssr.getSSRSuccessBreakdown();
}
