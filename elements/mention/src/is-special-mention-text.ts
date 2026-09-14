export function isSpecialMentionText(mentionText: string): boolean | '' {
	return mentionText && (mentionText === '@all' || mentionText === '@here');
}
