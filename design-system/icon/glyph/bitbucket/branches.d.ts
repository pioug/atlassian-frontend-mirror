import { PureComponent } from 'react';

type Props = {
  label: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  primaryColor?: string;
  secondaryColor?: string;
  testId?: string;
};

export default class extends PureComponent<Props> {}