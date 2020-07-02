export type SkipLinkContextProps = {
  skipLinksData: SkipLinkData[];
  registerSkipLink: (skipLinkDate: SkipLinkData) => void;
  unregisterSkipLink: (id: string | undefined) => void;
};

export type SkipLinkData = {
  id: string;
  skipLinkTitle: string;
};

export type SkipLinkI18n = {
  title: string;
};
