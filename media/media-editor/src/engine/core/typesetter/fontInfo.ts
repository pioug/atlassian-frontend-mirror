export interface FontMetrics {
  lineHeight: number; // baseline-to-baseline distance, in pixels
  descent: number; // positive, distance between the baseline and the lowest y coordinate
}

// Provides font info for different font sizes. Caches the values calculated for different font sizes
// Font size is in pixels.
export class FontInfo {
  private cache: { [fontSize: number]: FontMetrics } = {};

  constructor(private textHelperDiv: HTMLDivElement) {}

  getFontMetrics(fontSize: number): FontMetrics {
    const storedValue = this.cache[fontSize];

    if (storedValue) {
      return storedValue;
    } else {
      // There is no metrics in the cache. We calculate it and place to the cache.
      const metrics = this.calculateFontMetrics(fontSize);
      this.cache[fontSize] = metrics;

      return metrics;
    }
  }

  // CSS style for the font that we use to render text
  static getFontStyle(fontSize: number): string {
    return `bold ${fontSize}px Helvetica, Arial, Sans-Serif`;
  }

  private calculateFontMetrics(fontSize: number): FontMetrics {
    // We'll create a temporary span and read its height
    const span = document.createElement('span');
    span.style.font = FontInfo.getFontStyle(fontSize);
    span.innerText = 'Aq'; // the actual text doesn't matter, it should be non-empty
    this.textHelperDiv.appendChild(span);
    const rect = span.getBoundingClientRect();
    this.textHelperDiv.removeChild(span);

    // As there is no API to get font metrics we measure the span height and make calculations.
    // The coefficients were adjusted manually to get a nice looking result.
    const lineHeightCoefficient = 1.1;
    const descentCoefficient = 0.15;

    const lineHeight = Math.round(
      lineHeightCoefficient * ((rect && rect.height) || fontSize),
    );
    const descent = Math.round(descentCoefficient * lineHeight);

    return { lineHeight, descent };
  }
}
