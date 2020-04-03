import * as exenv from 'exenv';

export interface AppConfig {
  readonly version: number;
  readonly html: {
    readonly redirectUrl: string;
  };
}

export default {
  version: exenv.canUseDOM && (window as any).VERSION,
  html: {
    redirectUrl:
      'https://api.media.atlassian.com/picker/static/link-account-handler.html',
  },
} as AppConfig;
