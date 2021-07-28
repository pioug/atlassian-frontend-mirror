interface IMapping {
  [tone: string]: string;
}

const skinToneVariations: IMapping = {
  ['raised hand']: 'default skin tone',
  ['raised hand: light skin tone']: 'light skin tone',
  ['raised hand: medium-light skin tone']: 'medium-light skin tone',
  ['raised hand: medium skin tone']: 'medium skin tone',
  ['raised hand: medium-dark skin tone']: 'medium-dark skin tone',
  ['raised hand: dark skin tone']: 'dark skin tone',
};

export const setSkinToneAriaLabelText = (tone: string) => {
  if (tone) {
    return skinToneVariations[tone];
  }
};
