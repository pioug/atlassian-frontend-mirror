import { KeyboardEvent } from 'react';
import { ActivityProvider, ActivityItem } from '@atlaskit/activity';
import { INPUT_METHOD } from '../../plugins/analytics';

export type RecentSearchInputTypes =
  | INPUT_METHOD.TYPEAHEAD
  | INPUT_METHOD.MANUAL;

export interface ChildProps {
  activityProvider: ActivityProvider | null;
  inputProps: {
    onChange(input: string): void;
    onKeyDown(event: KeyboardEvent<any>): void;
    onSubmit(): void;
    value: string;
  };
  currentInputMethod?: RecentSearchInputTypes;
  clearValue(): void;
  renderRecentList(): React.ReactNode;
}

export interface RecentSearchSubmitOptions {
  text: string;
  url: string;
  inputMethod: RecentSearchInputTypes;
}

export interface RecentSearchProps {
  defaultUrl?: string;
  onSubmit(options: RecentSearchSubmitOptions): void;
  onBlur(options: RecentSearchSubmitOptions): void;
  render(state: ChildProps): React.ReactNode;
  limit?: number;
}

export interface RecentSearchState {
  items: Array<ActivityItem>;
  selectedIndex: number;
  isLoading: boolean;
  url: string;
}
