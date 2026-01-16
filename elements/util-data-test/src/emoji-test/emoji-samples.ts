import memoizeOne from 'memoize-one';
import { getTestEmojiRepository } from './get-test-emoji-repository';

const repo = memoizeOne(getTestEmojiRepository);

export const smileyEmoji = (): any => repo().findByShortName(':smiley:');
export const openMouthEmoji = (): any => repo().findByShortName(':open_mouth:');
export const grinEmoji = (): any => repo().findByShortName(':grin:');
export const evilburnsEmoji = (): any => repo().findByShortName(':evilburns:');
export const thumbsupEmoji = (): any => repo().findByShortName(':thumbsup:');
export const thumbsdownEmoji = (): any => repo().findByShortName(':thumbsdown:');
export const standardBoomEmoji = (): any => repo().findById('1f4a5');
export const atlassianBoomEmoji = (): any => repo().findById('atlassian-boom');
export const blackFlagEmoji = (): any => repo().findByShortName(':flag_black:');
export const congoFlagEmoji = (): any => repo().findByShortName(':flag_cg:');
