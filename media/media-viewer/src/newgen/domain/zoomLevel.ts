const BASE_ZOOM_LEVELS = [0.06, 0.12, 0.24, 0.48, 1, 1.5, 2, 4, 6, 8];

const sortNumbers = (nums: number[]) => nums.sort((a, b) => a - b); // default sorting is alphabetically

const deduplicated = (nums: number[]): number[] => {
  return sortNumbers(nums).filter(
    (num, pos) => pos === 0 || num !== nums[pos - 1],
  );
};

export class ZoomLevel {
  public readonly value: number;

  constructor(public readonly initialValue: number, selectedValue?: number) {
    if (!selectedValue) {
      selectedValue = initialValue;
    }
    if (selectedValue < this.min) {
      this.value = this.min;
    } else if (selectedValue > this.max) {
      this.value = this.max;
    } else {
      this.value = selectedValue;
    }
  }

  get zoomLevels(): number[] {
    return deduplicated(
      sortNumbers(
        BASE_ZOOM_LEVELS.map(zoomLevel => zoomLevel * this.initialValue).concat(
          1,
        ), // make sure 100% is selectable
      ),
    ); // and that all levels are ordered
  }

  get min(): number {
    return this.zoomLevels[0];
  }

  get max(): number {
    return this.zoomLevels.slice(-1)[0];
  }

  get asPercentage(): string {
    return `${Math.round(this.value * 100)} %`;
  }

  zoomIn(): ZoomLevel {
    const index = this.zoomLevels.indexOf(this.value);
    const nextValue = this.zoomLevels[index + 1];
    return nextValue ? new ZoomLevel(this.initialValue, nextValue) : this;
  }

  zoomOut(): ZoomLevel {
    const index = this.zoomLevels.indexOf(this.value);
    const nextValue = this.zoomLevels[index - 1];
    return nextValue ? new ZoomLevel(this.initialValue, nextValue) : this;
  }

  fullyZoomIn(): ZoomLevel {
    return new ZoomLevel(this.initialValue, this.max);
  }

  fullyZoomOut(): ZoomLevel {
    return new ZoomLevel(this.initialValue, this.min);
  }

  get canZoomIn(): boolean {
    return this.value < this.max;
  }

  get canZoomOut(): boolean {
    return this.value > this.min;
  }
}
