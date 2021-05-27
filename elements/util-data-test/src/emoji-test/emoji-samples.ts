import memoizeOne from 'memoize-one';
import { getTestEmojiRepository } from './get-test-emoji-repository';

const repo = memoizeOne(getTestEmojiRepository);

export const smileyEmoji = () => repo().findByShortName(':smiley:');
export const openMouthEmoji = () => repo().findByShortName(':open_mouth:');
export const grinEmoji = () => repo().findByShortName(':grin:');
export const evilburnsEmoji = () => repo().findByShortName(':evilburns:');
export const thumbsupEmoji = () => repo().findByShortName(':thumbsup:');
export const thumbsdownEmoji = () => repo().findByShortName(':thumbsdown:');
export const standardBoomEmoji = () => repo().findById('1f4a5');
export const atlassianBoomEmoji = () => repo().findById('atlassian-boom');
export const blackFlagEmoji = () => repo().findByShortName(':flag_black:');
export const congoFlagEmoji = () => repo().findByShortName(':flag_cg:');
