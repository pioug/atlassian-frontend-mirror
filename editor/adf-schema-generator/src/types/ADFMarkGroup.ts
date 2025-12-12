import type { ADFMark } from '../adfMark';
import type { ADFMarkSpec } from './ADFMarkSpec';

export type ADFMarkGroup = {
	group: string;
	groupType: 'mark';
	members: Array<ADFMark<ADFMarkSpec>>;
};
