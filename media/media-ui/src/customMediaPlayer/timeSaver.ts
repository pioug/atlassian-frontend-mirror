export interface TimeSaverConfig {
  contentId: string;
}

const getDefaultTimeLocalStorageKey = (id: string) =>
  `time-saver-default-time-${id}`;

/**
 * Modules that stores watch time (a number) in local storage by unique identifier.
 * Used in Custom Media Player to enable the feature where a user would resume watching
 * from where they left off.
 */
export class TimeSaver {
  constructor(readonly config?: TimeSaverConfig) {}

  get defaultTime(): number {
    if (this.config && localStorage) {
      try {
        const fileDefaultTime = localStorage.getItem(
          getDefaultTimeLocalStorageKey(this.config.contentId),
        );

        if (fileDefaultTime) {
          return JSON.parse(fileDefaultTime);
        }
      } catch (e) {
        // Nothing to do, falling back to 0
      }
    }
    return 0;
  }

  set defaultTime(time: number) {
    if (this.config && localStorage) {
      try {
        localStorage.setItem(
          getDefaultTimeLocalStorageKey(this.config.contentId),
          JSON.stringify(time),
        );
      } catch (e) {
        // Nothing to do, storing hasn't happened.
      }
    }
  }
}
