export interface ScreenCounter {
  getCount(): number;
  increment(): void;
}

export class SearchScreenCounter implements ScreenCounter {
  count = 1;

  getCount() {
    return this.count;
  }

  increment() {
    this.count++;
  }
}
