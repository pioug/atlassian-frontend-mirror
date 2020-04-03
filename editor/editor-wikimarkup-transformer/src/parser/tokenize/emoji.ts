import { TokenParser } from './';

export const emoji: TokenParser = ({ input, position, schema }) => {
  const substring = input.substring(position);

  /**
   * The length of wikimakrup emoji test ranges from 2 to 9 characters at the time of writing.
   */
  for (let i = 2; i <= 9 && i <= substring.length; ++i) {
    const candidateText = substring.substring(0, i);
    const emojiId = wikiToAdfEmojiMapping[candidateText];

    if (emojiId) {
      return {
        type: 'pmnode',
        nodes: [schema.nodes.emoji.createChecked(adfEmojiItems[emojiId])],
        length: i,
      };
    }
  }

  return {
    type: 'text',
    text: substring.substr(0, 1),
    length: 1,
  };
};

interface AdfEmojiItems {
  [key: string]: {
    id: string;
    shortName: string;
    text: string;
  };
}

export const adfEmojiItems: AdfEmojiItems = {
  '1f642': {
    id: '1f642',
    shortName: ':slight_smile:',
    text: '🙂',
  },
  '1f61e': {
    id: '1f61e',
    shortName: ':disappointed:',
    text: '😞',
  },
  '1f61b': {
    id: '1f61b',
    shortName: ':stuck_out_tongue:',
    text: '😛',
  },
  '1f603': {
    id: '1f603',
    shortName: ':smiley:',
    text: '😃',
  },
  '1f609': {
    id: '1f609',
    shortName: ':wink:',
    text: '😉',
  },
  '1f44d': {
    id: '1f44d',
    shortName: ':thumbsup:',
    text: '👍',
  },
  '1f44e': {
    id: '1f44e',
    shortName: ':thumbsdown:',
    text: '👎',
  },
  'atlassian-info': {
    id: 'atlassian-info',
    shortName: ':info:',
    text: ':info',
  },
  'atlassian-check_mark': {
    id: 'atlassian-check_mark',
    shortName: ':check_mark:',
    text: ':check_mark:',
  },
  'atlassian-cross_mark': {
    id: 'atlassian-cross_mark',
    shortName: ':cross_mark:',
    text: ':cross_mark:',
  },
  'atlassian-warning': {
    id: 'atlassian-warning',
    shortName: ':warning:',
    text: ':warning:',
  },
  'atlassian-plus': {
    id: 'atlassian-plus',
    shortName: ':plus:',
    text: ':plus:',
  },
  'atlassian-minus': {
    id: 'atlassian-minus',
    shortName: ':minus:',
    text: ':minus:',
  },
  'atlassian-question_mark': {
    id: 'atlassian-question_mark',
    shortName: ':question:',
    text: ':question:',
  },
  'atlassian-light_bulb_on': {
    id: 'atlassian-light_bulb_on',
    shortName: ':light_bulb_on:',
    text: ':light_bulb_on:',
  },
  'atlassian-light_bulb_off': {
    id: 'atlassian-light_bulb_off',
    shortName: ':light_bulb_off:',
    text: ':light_bulb_off:',
  },
  'atlassian-yellow_star': {
    id: 'atlassian-yellow_star',
    shortName: ':yellow_star:',
    text: ':yellow_star:',
  },
  'atlassian-red_star': {
    id: 'atlassian-red_star',
    shortName: ':red_star:',
    text: ':red_star:',
  },
  'atlassian-green_star': {
    id: 'atlassian-green_star',
    shortName: ':green_star:',
    text: ':green_star:',
  },
  'atlassian-blue_star': {
    id: 'atlassian-blue_star',
    shortName: ':blue_star:',
    text: ':blue_star:',
  },
  'atlassian-flag_on': {
    id: 'atlassian-flag_on',
    shortName: ':flag_on:',
    text: ':flag_on:',
  },
  'atlassian-flag_off': {
    id: 'atlassian-flag_off',
    shortName: ':flag_off:',
    text: ':flag_off:',
  },
};

export interface WikiToEmojiMapping {
  [key: string]: string;
}
export const wikiToAdfEmojiMapping: WikiToEmojiMapping = {
  ':)': '1f642',
  ':-)': '1f642',
  ':(': '1f61e',
  ':-(': '1f61e',
  ':P': '1f61b',
  ':-P': '1f61b',
  ':p': '1f61b',
  ':-p': '1f61b',
  ':D': '1f603',
  ':-D': '1f603',
  ';)': '1f609',
  ';-)': '1f609',
  '(y)': '1f44d',
  '(n)': '1f44e',
  '(i)': 'atlassian-info',
  '(/)': 'atlassian-check_mark',
  '(x)': 'atlassian-cross_mark',
  '(!)': 'atlassian-warning',
  '(+)': 'atlassian-plus',
  '(-)': 'atlassian-minus',
  '(?)': 'atlassian-question_mark',
  '(on)': 'atlassian-light_bulb_on',
  '(off)': 'atlassian-light_bulb_off',
  '(*)': 'atlassian-yellow_star',
  '(*y)': 'atlassian-yellow_star',
  '(*r)': 'atlassian-red_star',
  '(*g)': 'atlassian-green_star',
  '(*b)': 'atlassian-blue_star',
  '(flag)': 'atlassian-flag_on',
  '(flagoff)': 'atlassian-flag_off',
};
