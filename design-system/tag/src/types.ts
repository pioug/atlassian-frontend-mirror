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
  activeBackgroundColor: string;
  backgroundColor: string;
  backgroundColorHover: string;
  textColor: string;
  textColorHover: string;
};

export type ChromeLinkColors = {
  activeBackgroundColor: string;
  activeBackgroundColorRemoval: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  hoverBackgroundColorRemoval: string;
  focusRingColor: string;
};
