import Rusha from 'rusha';

export const sha1 = (input: string): string => {
	return Rusha.createHash().update(input).digest('hex');
};
