export type PositionTypeBase = 'bottom' | 'left' | 'right' | 'top';
export type PositionType = PositionTypeBase | 'mouse';

export interface FakeMouseElement {
  getBoundingClientRect: () => {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
  };
  clientWidth: number;
  clientHeight: number;
}
