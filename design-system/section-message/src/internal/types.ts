export interface ActionType {
  text: React.ReactNode;
  onClick?: () => void;
  href?: string;
  key: string;
  testId?: string;
}
