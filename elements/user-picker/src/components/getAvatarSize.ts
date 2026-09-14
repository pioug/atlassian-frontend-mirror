export const getAvatarSize = (appearance: string): 'xxsmall' | 'small' | 'medium' =>
	appearance === 'big' ? 'medium' : appearance === 'multi' ? 'xxsmall' : 'small';
