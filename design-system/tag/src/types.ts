export type TagColor =
  | 'standard'
  | 'green'
  | 'blue'
  | 'red'
  | 'purple'
  | 'grey'
  | 'teal'
  | 'yellow'
  | 'greenLight'
  | 'blueLight'
  | 'redLight'
  | 'purpleLight'
  | 'greyLight'
  | 'tealLight'
  | 'yellowLight'
  | undefined;

export type AppearanceType = 'default' | 'rounded';

export type ChromeColors = {
  backgroundColor: string;
  backgroundColorHover: string;
  textColor: string;
  textColorHover: string;
};

export type ChromeLinkColors = {
  hoverBackgroundColorRemoval: string;
  hoverTextColorRemoval: string;
  focusRingColor: string;
};
