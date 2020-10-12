interface TeamMentionState {
  seenCount: number;
  dontShow: boolean;
}

export const mentionHighlightLocalStorageKey =
  'atlassian.people.context.team.mention.highlight';

const EMPTY: TeamMentionState = {
  seenCount: 0,
  dontShow: false,
};

// Don't show if the user can't access local storage
const DISABLED_LOCAL_STORAGE: TeamMentionState = {
  seenCount: 99,
  dontShow: true,
};

const MAX_SEEN_LIMIT = 5;

export default class TeamMentionHighlightController {
  // Note - not a simple look up to avoid showing it to users that have local storage disabled
  private static readFromLocalStorage(): TeamMentionState {
    try {
      let localVal = localStorage.getItem(mentionHighlightLocalStorageKey);

      if (!localVal) {
        // Attempt to write to see if the user has local storage access
        localStorage.setItem(
          mentionHighlightLocalStorageKey,
          JSON.stringify(EMPTY),
        );
        localVal = localStorage.getItem(mentionHighlightLocalStorageKey);
      }

      if (localVal) {
        return JSON.parse(localVal) as TeamMentionState;
      } else {
        return DISABLED_LOCAL_STORAGE;
      }
    } catch (err) {
      return DISABLED_LOCAL_STORAGE;
    }
  }

  private static saveToLocalStorage(item: TeamMentionState) {
    try {
      localStorage.setItem(
        mentionHighlightLocalStorageKey,
        JSON.stringify(item),
      );
    } catch (err) {
      // do nothing
    }
  }

  private static markAsDone = () => {
    const item = TeamMentionHighlightController.readFromLocalStorage();
    item.dontShow = true;
    TeamMentionHighlightController.saveToLocalStorage(item);
  };

  static isHighlightEnabled = () => {
    const item = TeamMentionHighlightController.readFromLocalStorage();
    return item.seenCount < MAX_SEEN_LIMIT && !item.dontShow;
  };

  static registerRender = (): TeamMentionState => {
    const item = TeamMentionHighlightController.readFromLocalStorage();
    item.seenCount += 1;
    if (item.seenCount > MAX_SEEN_LIMIT) {
      item.dontShow = true;
    }
    TeamMentionHighlightController.saveToLocalStorage(item);
    return item;
  };

  static getSeenCount = (): number => {
    return TeamMentionHighlightController.readFromLocalStorage().seenCount;
  };

  static registerCreateLinkClick = TeamMentionHighlightController.markAsDone;
  static registerTeamMention = TeamMentionHighlightController.markAsDone;
  static registerClosed = TeamMentionHighlightController.markAsDone;
}
