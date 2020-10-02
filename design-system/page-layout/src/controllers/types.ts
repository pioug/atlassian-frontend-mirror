export type SkipLinkContextProps = {
  skipLinksData: SkipLinkData[];
  registerSkipLink: (skipLinkDate: SkipLinkData) => void;
  unregisterSkipLink: (id: string | undefined) => void;
};

export type SkipLinkData = {
  /** id for the element that will be skipped to */
  id: string;
  /** Text for the link that will appear in the skip link menu */
  skipLinkTitle: string;
  /** Desired position in the skip link menu */
  listIndex?: number;
};

export type SkipLinkI18n = {
  title: string;
};
