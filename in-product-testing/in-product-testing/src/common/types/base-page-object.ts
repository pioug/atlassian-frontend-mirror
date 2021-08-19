import { CypressType } from '../../types';

export class InProductTestPageObject {
  constructor(protected cy: CypressType) {}

  protected toTestId(id: string) {
    return `[data-testid="${id}"]`;
  }

  protected toAriaLabel(label: string) {
    return `[aria-label="${label}"]`;
  }
}
