import { type NodeSerializerOpts } from '../interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function emoji({ attrs }: NodeSerializerOpts): any {
	return attrs.text || attrs.shortName;
}
