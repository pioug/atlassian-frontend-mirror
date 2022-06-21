export enum KudosType {
  INDIVIDUAL = 'individual',
  TEAM = 'team',
}

export interface KudosRecipient {
  type: KudosType;
  recipientId: string;
}

export interface GiveKudosDrawerProps {
  testId?: string;
  isOpen: boolean;
  onClose: () => void;
  analytics?: any;
  analyticsSource: string;
  recipient?: KudosRecipient;
  teamCentralBaseUrl: string;
  cloudId: string;
  addFlag?: (flag: any) => void;
}
