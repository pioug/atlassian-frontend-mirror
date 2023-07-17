export enum KudosType {
  INDIVIDUAL = 'individual',
  TEAM = 'team',
}

export enum FlagEventType {
  KUDOS_CREATED = 'kudos-created',
  JIRA_KUDOS_CREATED = 'jira-kudos-created',
  JIRA_KUDOS_FAILED = 'jira-kudos-failed',
  DIRTY = 'dirty',
  CLOSE = 'close',
}

export interface KudosRecipient {
  type: KudosType;
  recipientId: string;
}

export interface FlagEvent {
  eventType: FlagEventType;
  kudosUuid?: string;
  jiraKudosUrl?: string;
  jiraKudosFormUrl?: string;
}

export interface GiveKudosDrawerProps {
  testId?: string;
  isOpen: boolean;
  onClose: () => void;
  analyticsSource: string;
  recipient?: KudosRecipient;
  teamCentralBaseUrl: string;
  cloudId: string;
  addFlag?: (flag: any) => void;
}
