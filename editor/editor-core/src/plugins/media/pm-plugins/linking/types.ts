export type InitialState = {
  visible: false;
  editable: false;
  link: '';
  mediaPos: null;
};

export type MediaLinkingState = {
  mediaPos: number | null;
  link: string;
  editable: boolean;
  visible: boolean;
};
