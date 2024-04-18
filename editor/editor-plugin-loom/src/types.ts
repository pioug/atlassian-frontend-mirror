export type VideoMeta = {
  sharedUrl: string;
  title: string;
  duration?: number;
};

type LoomClient = {
  attachToButton: (options: {
    button: HTMLElement;
    onInsert: (videoMeta: VideoMeta) => void;
  }) => void;
};

export type LoomPluginErrorMessages =
  | 'is-supported-failure'
  | 'failed-to-initialise'
  | 'api-key-not-provided';
export type LoomSDKErrorMessages =
  | 'incompatible-browser'
  | 'third-party-cookies-disabled'
  | 'no-media-streams-support';

export type GetClientResult =
  | {
      status: 'loaded';
      client: LoomClient;
    }
  | {
      status: 'error';
      message: LoomPluginErrorMessages | LoomSDKErrorMessages;
    };

export type GetClient = Promise<GetClientResult>;

export type LoomProviderOptions = {
  getClient: () => GetClient;
};
export type LoomPluginOptions = {
  loomProvider: LoomProviderOptions;
  shouldShowToolbarButton?: boolean;
};
