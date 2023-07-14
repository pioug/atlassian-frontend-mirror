/**
 * Below lines are copied from @material/material-color-utilities.
 * Do not modify it.
 */

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as utils from './color-utils';
import * as math from './math-utils';

/**
 * A color system built using CAM16 hue and chroma, and L* from
 * L*a*b*.
 *
 * Using L* creates a link between the color system, contrast, and thus
 * accessibility. Contrast ratio depends on relative luminance, or Y in the XYZ
 * color space. L*, or perceptual luminance can be calculated from Y.
 *
 * Unlike Y, L* is linear to human perception, allowing trivial creation of
 * accurate color tones.
 *
 * Unlike contrast ratio, measuring contrast in L* is linear, and simple to
 * calculate. A difference of 40 in HCT tone guarantees a contrast ratio >= 3.0,
 * and a difference of 50 guarantees a contrast ratio >= 4.5.
 */

/**
 * HCT, hue, chroma, and tone. A color system that provides a perceptually
 * accurate color measurement system that can also accurately render what colors
 * will appear as in different lighting environments.
 */
export class Hct {
  /**
   * @param hue 0 <= hue < 360; invalid values are corrected.
   * @param chroma 0 <= chroma < ?; Informally, colorfulness. The color
   *     returned may be lower than the requested chroma. Chroma has a different
   *     maximum for any given hue and tone.
   * @param tone 0 <= tone <= 100; invalid values are corrected.
   * @return HCT representation of a color in default viewing conditions.
   */

  internalHue: number;
  internalChroma: number;
  internalTone: number;

  static from(hue: number, chroma: number, tone: number) {
    return new Hct(HctSolver.solveToInt(hue, chroma, tone));
  }

  /**
   * @param argb ARGB representation of a color.
   * @return HCT representation of a color in default viewing conditions
   */
  static fromInt(argb: number) {
    return new Hct(argb);
  }

  toInt(): number {
    return this.argb;
  }

  /**
   * A number, in degrees, representing ex. red, orange, yellow, etc.
   * Ranges from 0 <= hue < 360.
   */
  get hue(): number {
    return this.internalHue;
  }

  /**
   * @param newHue 0 <= newHue < 360; invalid values are corrected.
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */
  set hue(newHue: number) {
    this.setInternalState(
      HctSolver.solveToInt(newHue, this.internalChroma, this.internalTone),
    );
  }

  get chroma(): number {
    return this.internalChroma;
  }

  /**
   * @param newChroma 0 <= newChroma < ?
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */
  set chroma(newChroma: number) {
    this.setInternalState(
      HctSolver.solveToInt(this.internalHue, newChroma, this.internalTone),
    );
  }

  /**
   * Lightness. Ranges from 0 to 100.
   */
  get tone(): number {
    return this.internalTone;
  }

  /**
   * @param newTone 0 <= newTone <= 100; invalid valids are corrected.
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */
  set tone(newTone: number) {
    this.setInternalState(
      HctSolver.solveToInt(this.internalHue, this.internalChroma, newTone),
    );
  }

  private constructor(private argb: number) {
    const cam = Cam16.fromInt(argb);
    this.internalHue = cam.hue;
    this.internalChroma = cam.chroma;
    this.internalTone = utils.lstarFromArgb(argb);
    this.argb = argb;
  }

  private setInternalState(argb: number) {
    const cam = Cam16.fromInt(argb);
    this.internalHue = cam.hue;
    this.internalChroma = cam.chroma;
    this.internalTone = utils.lstarFromArgb(argb);
    this.argb = argb;
  }

  /**
   * Translates a color into different [ViewingConditions].
   *
   * Colors change appearance. They look different with lights on versus off,
   * the same color, as in hex code, on white looks different when on black.
   * This is called color relativity, most famously explicated by Josef Albers
   * in Interaction of Color.
   *
   * In color science, color appearance models can account for this and
   * calculate the appearance of a color in different settings. HCT is based on
   * CAM16, a color appearance model, and uses it to make these calculations.
   *
   * See [ViewingConditions.make] for parameters affecting color appearance.
   */
  inViewingConditions(vc: ViewingConditions): Hct {
    // 1. Use CAM16 to find XYZ coordinates of color in specified VC.
    const cam = Cam16.fromInt(this.toInt());
    const viewedInVc = cam.xyzInViewingConditions(vc);

    // 2. Create CAM16 of those XYZ coordinates in default VC.
    const recastInVc = Cam16.fromXyzInViewingConditions(
      viewedInVc[0],
      viewedInVc[1],
      viewedInVc[2],
      ViewingConditions.make(),
    );

    // 3. Create HCT from:
    // - CAM16 using default VC with XYZ coordinates in specified VC.
    // - L* converted from Y in XYZ coordinates in specified VC.
    const recastHct = Hct.from(
      recastInVc.hue,
      recastInVc.chroma,
      utils.lstarFromY(viewedInVc[1]),
    );
    return recastHct;
  }
}

/**
 * CAM16, a color appearance model. Colors are not just defined by their hex
 * code, but rather, a hex code and viewing conditions.
 *
 * CAM16 instances also have coordinates in the CAM16-UCS space, called J*, a*,
 * b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
 * specification, and should be used when measuring distances between colors.
 *
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 */
class Cam16 {
  /**
   * All of the CAM16 dimensions can be calculated from 3 of the dimensions, in
   * the following combinations:
   *      -  {j or q} and {c, m, or s} and hue
   *      - jstar, astar, bstar
   * Prefer using a static method that constructs from 3 of those dimensions.
   * This constructor is intended for those methods to use to return all
   * possible dimensions.
   *
   * @param hue
   * @param chroma informally, colorfulness / color intensity. like saturation
   *     in HSL, except perceptually accurate.
   * @param j lightness
   * @param q brightness; ratio of lightness to white point's lightness
   * @param m colorfulness
   * @param s saturation; ratio of chroma to white point's chroma
   * @param jstar CAM16-UCS J coordinate
   * @param astar CAM16-UCS a coordinate
   * @param bstar CAM16-UCS b coordinate
   */
  constructor(
    readonly hue: number,
    readonly chroma: number,
    readonly j: number,
    readonly q: number,
    readonly m: number,
    readonly s: number,
    readonly jstar: number,
    readonly astar: number,
    readonly bstar: number,
  ) {}

  /**
   * CAM16 instances also have coordinates in the CAM16-UCS space, called J*,
   * a*, b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
   * specification, and is used to measure distances between colors.
   */
  distance(other: Cam16): number {
    const dJ = this.jstar - other.jstar;
    const dA = this.astar - other.astar;
    const dB = this.bstar - other.bstar;
    const dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
    const dE = 1.41 * Math.pow(dEPrime, 0.63);
    return dE;
  }

  /**
   * @param argb ARGB representation of a color.
   * @return CAM16 color, assuming the color was viewed in default viewing
   *     conditions.
   */
  static fromInt(argb: number): Cam16 {
    return Cam16.fromIntInViewingConditions(argb, ViewingConditions.DEFAULT);
  }

  /**
   * @param argb ARGB representation of a color.
   * @param viewingConditions Information about the environment where the color
   *     was observed.
   * @return CAM16 color.
   */
  static fromIntInViewingConditions(
    argb: number,
    viewingConditions: ViewingConditions,
  ): Cam16 {
    const red = (argb & 0x00ff0000) >> 16;
    const green = (argb & 0x0000ff00) >> 8;
    const blue = argb & 0x000000ff;
    const redL = utils.linearized(red);
    const greenL = utils.linearized(green);
    const blueL = utils.linearized(blue);
    const x = 0.41233895 * redL + 0.35762064 * greenL + 0.18051042 * blueL;
    const y = 0.2126 * redL + 0.7152 * greenL + 0.0722 * blueL;
    const z = 0.01932141 * redL + 0.11916382 * greenL + 0.95034478 * blueL;

    const rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
    const gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
    const bC = -0.002079 * x + 0.048952 * y + 0.953127 * z;

    const rD = viewingConditions.rgbD[0] * rC;
    const gD = viewingConditions.rgbD[1] * gC;
    const bD = viewingConditions.rgbD[2] * bC;

    const rAF = Math.pow((viewingConditions.fl * Math.abs(rD)) / 100.0, 0.42);
    const gAF = Math.pow((viewingConditions.fl * Math.abs(gD)) / 100.0, 0.42);
    const bAF = Math.pow((viewingConditions.fl * Math.abs(bD)) / 100.0, 0.42);

    const rA = (math.signum(rD) * 400.0 * rAF) / (rAF + 27.13);
    const gA = (math.signum(gD) * 400.0 * gAF) / (gAF + 27.13);
    const bA = (math.signum(bD) * 400.0 * bAF) / (bAF + 27.13);

    const a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
    const b = (rA + gA - 2.0 * bA) / 9.0;
    const u = (20.0 * rA + 20.0 * gA + 21.0 * bA) / 20.0;
    const p2 = (40.0 * rA + 20.0 * gA + bA) / 20.0;
    const atan2 = Math.atan2(b, a);
    const atanDegrees = (atan2 * 180.0) / Math.PI;
    const hue =
      atanDegrees < 0
        ? atanDegrees + 360.0
        : atanDegrees >= 360
        ? atanDegrees - 360.0
        : atanDegrees;
    const hueRadians = (hue * Math.PI) / 180.0;

    const ac = p2 * viewingConditions.nbb;
    const j =
      100.0 *
      Math.pow(
        ac / viewingConditions.aw,
        viewingConditions.c * viewingConditions.z,
      );
    const q =
      (4.0 / viewingConditions.c) *
      Math.sqrt(j / 100.0) *
      (viewingConditions.aw + 4.0) *
      viewingConditions.fLRoot;
    const huePrime = hue < 20.14 ? hue + 360 : hue;
    const eHue = 0.25 * (Math.cos((huePrime * Math.PI) / 180.0 + 2.0) + 3.8);
    const p1 =
      (50000.0 / 13.0) * eHue * viewingConditions.nc * viewingConditions.ncb;
    const t = (p1 * Math.sqrt(a * a + b * b)) / (u + 0.305);
    const alpha =
      Math.pow(t, 0.9) *
      Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
    const c = alpha * Math.sqrt(j / 100.0);
    const m = c * viewingConditions.fLRoot;
    const s =
      50.0 *
      Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4.0));
    const jstar = ((1.0 + 100.0 * 0.007) * j) / (1.0 + 0.007 * j);
    const mstar = (1.0 / 0.0228) * Math.log(1.0 + 0.0228 * m);
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);

    return new Cam16(hue, c, j, q, m, s, jstar, astar, bstar);
  }

  /**
   * @param j CAM16 lightness
   * @param c CAM16 chroma
   * @param h CAM16 hue
   */
  static fromJch(j: number, c: number, h: number): Cam16 {
    return Cam16.fromJchInViewingConditions(j, c, h, ViewingConditions.DEFAULT);
  }

  /**
   * @param j CAM16 lightness
   * @param c CAM16 chroma
   * @param h CAM16 hue
   * @param viewingConditions Information about the environment where the color
   *     was observed.
   */
  static fromJchInViewingConditions(
    j: number,
    c: number,
    h: number,
    viewingConditions: ViewingConditions,
  ): Cam16 {
    const q =
      (4.0 / viewingConditions.c) *
      Math.sqrt(j / 100.0) *
      (viewingConditions.aw + 4.0) *
      viewingConditions.fLRoot;
    const m = c * viewingConditions.fLRoot;
    const alpha = c / Math.sqrt(j / 100.0);
    const s =
      50.0 *
      Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4.0));
    const hueRadians = (h * Math.PI) / 180.0;
    const jstar = ((1.0 + 100.0 * 0.007) * j) / (1.0 + 0.007 * j);
    const mstar = (1.0 / 0.0228) * Math.log(1.0 + 0.0228 * m);
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new Cam16(h, c, j, q, m, s, jstar, astar, bstar);
  }

  /**
   * @param jstar CAM16-UCS lightness.
   * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the Y axis.
   * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the X axis.
   */
  static fromUcs(jstar: number, astar: number, bstar: number): Cam16 {
    return Cam16.fromUcsInViewingConditions(
      jstar,
      astar,
      bstar,
      ViewingConditions.DEFAULT,
    );
  }

  /**
   * @param jstar CAM16-UCS lightness.
   * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the Y axis.
   * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the X axis.
   * @param viewingConditions Information about the environment where the color
   *     was observed.
   */
  static fromUcsInViewingConditions(
    jstar: number,
    astar: number,
    bstar: number,
    viewingConditions: ViewingConditions,
  ): Cam16 {
    const a = astar;
    const b = bstar;
    const m = Math.sqrt(a * a + b * b);
    const M = (Math.exp(m * 0.0228) - 1.0) / 0.0228;
    const c = M / viewingConditions.fLRoot;
    let h = Math.atan2(b, a) * (180.0 / Math.PI);
    if (h < 0.0) {
      h += 360.0;
    }
    const j = jstar / (1 - (jstar - 100) * 0.007);
    return Cam16.fromJchInViewingConditions(j, c, h, viewingConditions);
  }

  /**
   *  @return ARGB representation of color, assuming the color was viewed in
   *     default viewing conditions, which are near-identical to the default
   *     viewing conditions for sRGB.
   */
  toInt(): number {
    return this.viewed(ViewingConditions.DEFAULT);
  }

  /**
   * @param viewingConditions Information about the environment where the color
   *     will be viewed.
   * @return ARGB representation of color
   */
  viewed(viewingConditions: ViewingConditions): number {
    const alpha =
      this.chroma === 0.0 || this.j === 0.0
        ? 0.0
        : this.chroma / Math.sqrt(this.j / 100.0);

    const t = Math.pow(
      alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73),
      1.0 / 0.9,
    );
    const hRad = (this.hue * Math.PI) / 180.0;

    const eHue = 0.25 * (Math.cos(hRad + 2.0) + 3.8);
    const ac =
      viewingConditions.aw *
      Math.pow(this.j / 100.0, 1.0 / viewingConditions.c / viewingConditions.z);
    const p1 =
      eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
    const p2 = ac / viewingConditions.nbb;

    const hSin = Math.sin(hRad);
    const hCos = Math.cos(hRad);

    const gamma =
      (23.0 * (p2 + 0.305) * t) /
      (23.0 * p1 + 11.0 * t * hCos + 108.0 * t * hSin);
    const a = gamma * hCos;
    const b = gamma * hSin;
    const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
    const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
    const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;

    const rCBase = Math.max(0, (27.13 * Math.abs(rA)) / (400.0 - Math.abs(rA)));
    const rC =
      math.signum(rA) *
      (100.0 / viewingConditions.fl) *
      Math.pow(rCBase, 1.0 / 0.42);
    const gCBase = Math.max(0, (27.13 * Math.abs(gA)) / (400.0 - Math.abs(gA)));
    const gC =
      math.signum(gA) *
      (100.0 / viewingConditions.fl) *
      Math.pow(gCBase, 1.0 / 0.42);
    const bCBase = Math.max(0, (27.13 * Math.abs(bA)) / (400.0 - Math.abs(bA)));
    const bC =
      math.signum(bA) *
      (100.0 / viewingConditions.fl) *
      Math.pow(bCBase, 1.0 / 0.42);
    const rF = rC / viewingConditions.rgbD[0];
    const gF = gC / viewingConditions.rgbD[1];
    const bF = bC / viewingConditions.rgbD[2];

    const x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
    const y = 0.38752654 * rF + 0.62144744 * gF - 0.00897398 * bF;
    const z = -0.0158415 * rF - 0.03412294 * gF + 1.04996444 * bF;

    const argb = utils.argbFromXyz(x, y, z);
    return argb;
  }

  /// Given color expressed in XYZ and viewed in [viewingConditions], convert to
  /// CAM16.
  static fromXyzInViewingConditions(
    x: number,
    y: number,
    z: number,
    viewingConditions: ViewingConditions,
  ): Cam16 {
    // Transform XYZ to 'cone'/'rgb' responses

    const rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
    const gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
    const bC = -0.002079 * x + 0.048952 * y + 0.953127 * z;

    // Discount illuminant
    const rD = viewingConditions.rgbD[0] * rC;
    const gD = viewingConditions.rgbD[1] * gC;
    const bD = viewingConditions.rgbD[2] * bC;

    // chromatic adaptation
    const rAF = Math.pow((viewingConditions.fl * Math.abs(rD)) / 100.0, 0.42);
    const gAF = Math.pow((viewingConditions.fl * Math.abs(gD)) / 100.0, 0.42);
    const bAF = Math.pow((viewingConditions.fl * Math.abs(bD)) / 100.0, 0.42);
    const rA = (math.signum(rD) * 400.0 * rAF) / (rAF + 27.13);
    const gA = (math.signum(gD) * 400.0 * gAF) / (gAF + 27.13);
    const bA = (math.signum(bD) * 400.0 * bAF) / (bAF + 27.13);

    // redness-greenness
    const a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
    // yellowness-blueness
    const b = (rA + gA - 2.0 * bA) / 9.0;

    // auxiliary components
    const u = (20.0 * rA + 20.0 * gA + 21.0 * bA) / 20.0;
    const p2 = (40.0 * rA + 20.0 * gA + bA) / 20.0;

    // hue
    const atan2 = Math.atan2(b, a);
    const atanDegrees = (atan2 * 180.0) / Math.PI;
    const hue =
      atanDegrees < 0
        ? atanDegrees + 360.0
        : atanDegrees >= 360
        ? atanDegrees - 360
        : atanDegrees;
    const hueRadians = (hue * Math.PI) / 180.0;

    // achromatic response to color
    const ac = p2 * viewingConditions.nbb;

    // CAM16 lightness and brightness
    const J =
      100.0 *
      Math.pow(
        ac / viewingConditions.aw,
        viewingConditions.c * viewingConditions.z,
      );
    const Q =
      (4.0 / viewingConditions.c) *
      Math.sqrt(J / 100.0) *
      (viewingConditions.aw + 4.0) *
      viewingConditions.fLRoot;

    const huePrime = hue < 20.14 ? hue + 360 : hue;
    const eHue =
      (1.0 / 4.0) * (Math.cos((huePrime * Math.PI) / 180.0 + 2.0) + 3.8);
    const p1 =
      (50000.0 / 13.0) * eHue * viewingConditions.nc * viewingConditions.ncb;
    const t = (p1 * Math.sqrt(a * a + b * b)) / (u + 0.305);
    const alpha =
      Math.pow(t, 0.9) *
      Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
    // CAM16 chroma, colorfulness, chroma
    const C = alpha * Math.sqrt(J / 100.0);
    const M = C * viewingConditions.fLRoot;
    const s =
      50.0 *
      Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4.0));

    // CAM16-UCS components
    const jstar = ((1.0 + 100.0 * 0.007) * J) / (1.0 + 0.007 * J);
    const mstar = Math.log(1.0 + 0.0228 * M) / 0.0228;
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new Cam16(hue, C, J, Q, M, s, jstar, astar, bstar);
  }

  /// XYZ representation of CAM16 seen in [viewingConditions].
  xyzInViewingConditions(viewingConditions: ViewingConditions): number[] {
    const alpha =
      this.chroma === 0.0 || this.j === 0.0
        ? 0.0
        : this.chroma / Math.sqrt(this.j / 100.0);

    const t = Math.pow(
      alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73),
      1.0 / 0.9,
    );
    const hRad = (this.hue * Math.PI) / 180.0;

    const eHue = 0.25 * (Math.cos(hRad + 2.0) + 3.8);
    const ac =
      viewingConditions.aw *
      Math.pow(this.j / 100.0, 1.0 / viewingConditions.c / viewingConditions.z);
    const p1 =
      eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;

    const p2 = ac / viewingConditions.nbb;

    const hSin = Math.sin(hRad);
    const hCos = Math.cos(hRad);

    const gamma =
      (23.0 * (p2 + 0.305) * t) /
      (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
    const a = gamma * hCos;
    const b = gamma * hSin;
    const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
    const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
    const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;

    const rCBase = Math.max(0, (27.13 * Math.abs(rA)) / (400.0 - Math.abs(rA)));
    const rC =
      math.signum(rA) *
      (100.0 / viewingConditions.fl) *
      Math.pow(rCBase, 1.0 / 0.42);
    const gCBase = Math.max(0, (27.13 * Math.abs(gA)) / (400.0 - Math.abs(gA)));
    const gC =
      math.signum(gA) *
      (100.0 / viewingConditions.fl) *
      Math.pow(gCBase, 1.0 / 0.42);
    const bCBase = Math.max(0, (27.13 * Math.abs(bA)) / (400.0 - Math.abs(bA)));
    const bC =
      math.signum(bA) *
      (100.0 / viewingConditions.fl) *
      Math.pow(bCBase, 1.0 / 0.42);
    const rF = rC / viewingConditions.rgbD[0];
    const gF = gC / viewingConditions.rgbD[1];
    const bF = bC / viewingConditions.rgbD[2];

    const x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
    const y = 0.38752654 * rF + 0.62144744 * gF - 0.00897398 * bF;
    const z = -0.0158415 * rF - 0.03412294 * gF + 1.04996444 * bF;

    return [x, y, z];
  }
}

// This file is automatically generated. Do not modify it.

// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable:class-as-namespace
/**
 * A class that solves the HCT equation.
 */
class HctSolver {
  static SCALED_DISCOUNT_FROM_LINRGB = [
    [0.001200833568784504, 0.002389694492170889, 0.0002795742885861124],
    [0.0005891086651375999, 0.0029785502573438758, 0.0003270666104008398],
    [0.00010146692491640572, 0.0005364214359186694, 0.0032979401770712076],
  ];

  static LINRGB_FROM_SCALED_DISCOUNT = [
    [1373.2198709594231, -1100.4251190754821, -7.278681089101213],
    [-271.815969077903, 559.6580465940733, -32.46047482791194],
    [1.9622899599665666, -57.173814538844006, 308.7233197812385],
  ];

  static Y_FROM_LINRGB = [0.2126, 0.7152, 0.0722];

  static CRITICAL_PLANES = [
    0.015176349177441876, 0.045529047532325624, 0.07588174588720938,
    0.10623444424209313, 0.13658714259697685, 0.16693984095186062,
    0.19729253930674434, 0.2276452376616281, 0.2579979360165119,
    0.28835063437139563, 0.3188300904430532, 0.350925934958123,
    0.3848314933096426, 0.42057480301049466, 0.458183274052838,
    0.4976837250274023, 0.5391024159806381, 0.5824650784040898,
    0.6277969426914107, 0.6751227633498623, 0.7244668422128921,
    0.775853049866786, 0.829304845476233, 0.8848452951698498, 0.942497089126609,
    1.0022825574869039, 1.0642236851973577, 1.1283421258858297,
    1.1946592148522128, 1.2631959812511864, 1.3339731595349034,
    1.407011200216447, 1.4823302800086415, 1.5599503113873272,
    1.6398909516233677, 1.7221716113234105, 1.8068114625156377,
    1.8938294463134073, 1.9832442801866852, 2.075074464868551,
    2.1693382909216234, 2.2660538449872063, 2.36523901573795,
    2.4669114995532007, 2.5710888059345764, 2.6777882626779785,
    2.7870270208169257, 2.898822059350997, 3.0131901897720907,
    3.1301480604002863, 3.2497121605402226, 3.3718988244681087,
    3.4967242352587946, 3.624204428461639, 3.754355295633311, 3.887192587735158,
    4.022731918402185, 4.160988767090289, 4.301978482107941, 4.445716283538092,
    4.592217266055746, 4.741496401646282, 4.893568542229298, 5.048448422192488,
    5.20615066083972, 5.3666897647573375, 5.5300801301023865, 5.696336044816294,
    5.865471690767354, 6.037501145825082, 6.212438385869475, 6.390297286737924,
    6.571091626112461, 6.7548350853498045, 6.941541251256611, 7.131223617812143,
    7.323895587840543, 7.5195704746346665, 7.7182615035334345,
    7.919981813454504, 8.124744458384042, 8.332562408825165, 8.543448553206703,
    8.757415699253682, 8.974476575321063, 9.194643831691977, 9.417930041841839,
    9.644347703669503, 9.873909240696694, 10.106627003236781,
    10.342513269534024, 10.58158024687427, 10.8238400726681, 11.069304815507364,
    11.317986476196008, 11.569896988756009, 11.825048221409341,
    12.083451977536606, 12.345119996613247, 12.610063955123938,
    12.878295467455942, 13.149826086772048, 13.42466730586372,
    13.702830557985108, 13.984327217668513, 14.269168601521828,
    14.55736596900856, 14.848930523210871, 15.143873411576273,
    15.44220572664832, 15.743938506781891, 16.04908273684337, 16.35764934889634,
    16.66964922287304, 16.985093187232053, 17.30399201960269, 17.62635644741625,
    17.95219714852476, 18.281524751807332, 18.614349837764564,
    18.95068293910138, 19.290534541298456, 19.633915083172692,
    19.98083495742689, 20.331304511189067, 20.685334046541502,
    21.042933821039977, 21.404114048223256, 21.76888489811322,
    22.137256497705877, 22.50923893145328, 22.884842241736916,
    23.264076429332462, 23.6469514538663, 24.033477234264016, 24.42366364919083,
    24.817520537484558, 25.21505769858089, 25.61628489293138,
    26.021211842414342, 26.429848230738664, 26.842203703840827,
    27.258287870275353, 27.678110301598522, 28.10168053274597,
    28.529008062403893, 28.96010235337422, 29.39497283293396, 29.83362889318845,
    30.276079891419332, 30.722335150426627, 31.172403958865512,
    31.62629557157785, 32.08401920991837, 32.54558406207592, 33.010999283389665,
    33.4802739966603, 33.953417292456834, 34.430438229418264,
    34.911345834551085, 35.39614910352207, 35.88485700094671, 36.37747846067349,
    36.87402238606382, 37.37449765026789, 37.87891309649659, 38.38727753828926,
    38.89959975977785, 39.41588851594697, 39.93615253289054, 40.460400508064545,
    40.98864111053629, 41.520882981230194, 42.05713473317016,
    42.597404951718396, 43.141702194811224, 43.6900349931913, 44.24241185063697,
    44.798841244188324, 45.35933162437017, 45.92389141541209, 46.49252901546552,
    47.065252796817916, 47.64207110610409, 48.22299226451468,
    48.808024568002054, 49.3971762874833, 49.9904556690408, 50.587870934119984,
    51.189430279724725, 51.79514187861014, 52.40501387947288, 53.0190544071392,
    53.637271562750364, 54.259673423945976, 54.88626804504493,
    55.517063457223934, 56.15206766869424, 56.79128866487574, 57.43473440856916,
    58.08241284012621, 58.734331877617365, 59.39049941699807, 60.05092333227251,
    60.715611475655585, 61.38457167773311, 62.057811747619894, 62.7353394731159,
    63.417162620860914, 64.10328893648692, 64.79372614476921, 65.48848194977529,
    66.18756403501224, 66.89098006357258, 67.59873767827808, 68.31084450182222,
    69.02730813691093, 69.74813616640164, 70.47333615344107, 71.20291564160104,
    71.93688215501312, 72.67524319850172, 73.41800625771542, 74.16517879925733,
    74.9167682708136, 75.67278210128072, 76.43322770089146, 77.1981124613393,
    77.96744375590167, 78.74122893956174, 79.51947534912904, 80.30219030335869,
    81.08938110306934, 81.88105503125999, 82.67721935322541, 83.4778813166706,
    84.28304815182372, 85.09272707154808, 85.90692527145302, 86.72564993000343,
    87.54890820862819, 88.3767072518277, 89.2090541872801, 90.04595612594655,
    90.88742016217518, 91.73345337380438, 92.58406282226491, 93.43925555268066,
    94.29903859396902, 95.16341895893969, 96.03240364439274, 96.9059996312159,
    97.78421388448044, 98.6670533535366, 99.55452497210776,
  ];

  /**
   * Sanitizes a small enough angle in radians.
   *
   * @param angle An angle in radians; must not deviate too much
   * from 0.
   * @return A coterminal angle between 0 and 2pi.
   */
  private static sanitizeRadians(angle: number): number {
    return (angle + Math.PI * 8) % (Math.PI * 2);
  }

  /**
   * Delinearizes an RGB component, returning a floating-point
   * number.
   *
   * @param rgbComponent 0.0 <= rgb_component <= 100.0, represents
   * linear R/G/B channel
   * @return 0.0 <= output <= 255.0, color channel converted to
   * regular RGB space
   */
  private static trueDelinearized(rgbComponent: number): number {
    const normalized = rgbComponent / 100.0;
    let delinearized = 0.0;
    if (normalized <= 0.0031308) {
      delinearized = normalized * 12.92;
    } else {
      delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
    }
    return delinearized * 255.0;
  }

  private static chromaticAdaptation(component: number): number {
    const af = Math.pow(Math.abs(component), 0.42);
    return (math.signum(component) * 400.0 * af) / (af + 27.13);
  }

  /**
   * Returns the hue of a linear RGB color in CAM16.
   *
   * @param linrgb The linear RGB coordinates of a color.
   * @return The hue of the color in CAM16, in radians.
   */
  private static hueOf(linrgb: number[]): number {
    const scaledDiscount = math.matrixMultiply(
      linrgb,
      HctSolver.SCALED_DISCOUNT_FROM_LINRGB,
    );
    const rA = HctSolver.chromaticAdaptation(scaledDiscount[0]);
    const gA = HctSolver.chromaticAdaptation(scaledDiscount[1]);
    const bA = HctSolver.chromaticAdaptation(scaledDiscount[2]);
    // redness-greenness
    const a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
    // yellowness-blueness
    const b = (rA + gA - 2.0 * bA) / 9.0;
    return Math.atan2(b, a);
  }

  private static areInCyclicOrder(a: number, b: number, c: number): boolean {
    const deltaAB = HctSolver.sanitizeRadians(b - a);
    const deltaAC = HctSolver.sanitizeRadians(c - a);
    return deltaAB < deltaAC;
  }

  /**
   * Solves the lerp equation.
   *
   * @param source The starting number.
   * @param mid The number in the middle.
   * @param target The ending number.
   * @return A number t such that lerp(source, target, t) = mid.
   */
  private static intercept(
    source: number,
    mid: number,
    target: number,
  ): number {
    return (mid - source) / (target - source);
  }

  private static lerpPoint(
    source: number[],
    t: number,
    target: number[],
  ): number[] {
    return [
      source[0] + (target[0] - source[0]) * t,
      source[1] + (target[1] - source[1]) * t,
      source[2] + (target[2] - source[2]) * t,
    ];
  }

  /**
   * Intersects a segment with a plane.
   *
   * @param source The coordinates of point A.
   * @param coordinate The R-, G-, or B-coordinate of the plane.
   * @param target The coordinates of point B.
   * @param axis The axis the plane is perpendicular with. (0: R, 1:
   * G, 2: B)
   * @return The intersection point of the segment AB with the plane
   * R=coordinate, G=coordinate, or B=coordinate
   */
  private static setCoordinate(
    source: number[],
    coordinate: number,
    target: number[],
    axis: number,
  ): number[] {
    const t = HctSolver.intercept(source[axis], coordinate, target[axis]);
    return HctSolver.lerpPoint(source, t, target);
  }

  private static isBounded(x: number): boolean {
    return 0.0 <= x && x <= 100.0;
  }

  /**
   * Returns the nth possible vertex of the polygonal intersection.
   *
   * @param y The Y value of the plane.
   * @param n The zero-based index of the point. 0 <= n <= 11.
   * @return The nth possible vertex of the polygonal intersection
   * of the y plane and the RGB cube, in linear RGB coordinates, if
   * it exists. If this possible vertex lies outside of the cube,
   * [-1.0, -1.0, -1.0] is returned.
   */
  private static nthVertex(y: number, n: number): number[] {
    const kR = HctSolver.Y_FROM_LINRGB[0];
    const kG = HctSolver.Y_FROM_LINRGB[1];
    const kB = HctSolver.Y_FROM_LINRGB[2];
    const coordA = n % 4 <= 1 ? 0.0 : 100.0;
    const coordB = n % 2 === 0 ? 0.0 : 100.0;
    if (n < 4) {
      const g = coordA;
      const b = coordB;
      const r = (y - g * kG - b * kB) / kR;
      if (HctSolver.isBounded(r)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    } else if (n < 8) {
      const b = coordA;
      const r = coordB;
      const g = (y - r * kR - b * kB) / kG;
      if (HctSolver.isBounded(g)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    } else {
      const r = coordA;
      const g = coordB;
      const b = (y - r * kR - g * kG) / kB;
      if (HctSolver.isBounded(b)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    }
  }

  /**
   * Finds the segment containing the desired color.
   *
   * @param y The Y value of the color.
   * @param targetHue The hue of the color.
   * @return A list of two sets of linear RGB coordinates, each
   * corresponding to an endpoint of the segment containing the
   * desired color.
   */
  private static bisectToSegment(y: number, targetHue: number): number[][] {
    let left = [-1.0, -1.0, -1.0];
    let right = left;
    let leftHue = 0.0;
    let rightHue = 0.0;
    let initialized = false;
    let uncut = true;
    for (let n = 0; n < 12; n++) {
      const mid = HctSolver.nthVertex(y, n);
      if (mid[0] < 0) {
        continue;
      }
      const midHue = HctSolver.hueOf(mid);
      if (!initialized) {
        left = mid;
        right = mid;
        leftHue = midHue;
        rightHue = midHue;
        initialized = true;
        continue;
      }
      if (uncut || HctSolver.areInCyclicOrder(leftHue, midHue, rightHue)) {
        uncut = false;
        if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
          right = mid;
          rightHue = midHue;
        } else {
          left = mid;
          leftHue = midHue;
        }
      }
    }
    return [left, right];
  }

  private static midpoint(a: number[], b: number[]): number[] {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  }

  private static criticalPlaneBelow(x: number): number {
    return Math.floor(x - 0.5);
  }

  private static criticalPlaneAbove(x: number): number {
    return Math.ceil(x - 0.5);
  }

  /**
   * Finds a color with the given Y and hue on the boundary of the
   * cube.
   *
   * @param y The Y value of the color.
   * @param targetHue The hue of the color.
   * @return The desired color, in linear RGB coordinates.
   */
  private static bisectToLimit(y: number, targetHue: number): number[] {
    const segment = HctSolver.bisectToSegment(y, targetHue);
    let left = segment[0];
    let leftHue = HctSolver.hueOf(left);
    let right = segment[1];
    for (let axis = 0; axis < 3; axis++) {
      if (left[axis] !== right[axis]) {
        let lPlane = -1;
        let rPlane = 255;
        if (left[axis] < right[axis]) {
          lPlane = HctSolver.criticalPlaneBelow(
            HctSolver.trueDelinearized(left[axis]),
          );
          rPlane = HctSolver.criticalPlaneAbove(
            HctSolver.trueDelinearized(right[axis]),
          );
        } else {
          lPlane = HctSolver.criticalPlaneAbove(
            HctSolver.trueDelinearized(left[axis]),
          );
          rPlane = HctSolver.criticalPlaneBelow(
            HctSolver.trueDelinearized(right[axis]),
          );
        }
        for (let i = 0; i < 8; i++) {
          if (Math.abs(rPlane - lPlane) <= 1) {
            break;
          } else {
            const mPlane = Math.floor((lPlane + rPlane) / 2.0);
            const midPlaneCoordinate = HctSolver.CRITICAL_PLANES[mPlane];
            const mid = HctSolver.setCoordinate(
              left,
              midPlaneCoordinate,
              right,
              axis,
            );
            const midHue = HctSolver.hueOf(mid);
            if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
              right = mid;
              rPlane = mPlane;
            } else {
              left = mid;
              leftHue = midHue;
              lPlane = mPlane;
            }
          }
        }
      }
    }
    return HctSolver.midpoint(left, right);
  }

  private static inverseChromaticAdaptation(adapted: number): number {
    const adaptedAbs = Math.abs(adapted);
    const base = Math.max(0, (27.13 * adaptedAbs) / (400.0 - adaptedAbs));
    return math.signum(adapted) * Math.pow(base, 1.0 / 0.42);
  }

  /**
   * Finds a color with the given hue, chroma, and Y.
   *
   * @param hueRadians The desired hue in radians.
   * @param chroma The desired chroma.
   * @param y The desired Y.
   * @return The desired color as a hexadecimal integer, if found; 0
   * otherwise.
   */
  private static findResultByJ(
    hueRadians: number,
    chroma: number,
    y: number,
  ): number {
    // Initial estimate of j.
    let j = Math.sqrt(y) * 11.0;
    // ===========================================================
    // Operations inlined from Cam16 to avoid repeated calculation
    // ===========================================================
    const viewingConditions = ViewingConditions.DEFAULT;
    const tInnerCoeff =
      1 / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
    const eHue = 0.25 * (Math.cos(hueRadians + 2.0) + 3.8);
    const p1 =
      eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
    const hSin = Math.sin(hueRadians);
    const hCos = Math.cos(hueRadians);
    for (let iterationRound = 0; iterationRound < 5; iterationRound++) {
      // ===========================================================
      // Operations inlined from Cam16 to avoid repeated calculation
      // ===========================================================
      const jNormalized = j / 100.0;
      const alpha =
        chroma === 0.0 || j === 0.0 ? 0.0 : chroma / Math.sqrt(jNormalized);
      const t = Math.pow(alpha * tInnerCoeff, 1.0 / 0.9);
      const ac =
        viewingConditions.aw *
        Math.pow(jNormalized, 1.0 / viewingConditions.c / viewingConditions.z);
      const p2 = ac / viewingConditions.nbb;
      const gamma =
        (23.0 * (p2 + 0.305) * t) /
        (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
      const a = gamma * hCos;
      const b = gamma * hSin;
      const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
      const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
      const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
      const rCScaled = HctSolver.inverseChromaticAdaptation(rA);
      const gCScaled = HctSolver.inverseChromaticAdaptation(gA);
      const bCScaled = HctSolver.inverseChromaticAdaptation(bA);
      const linrgb = math.matrixMultiply(
        [rCScaled, gCScaled, bCScaled],
        HctSolver.LINRGB_FROM_SCALED_DISCOUNT,
      );
      // ===========================================================
      // Operations inlined from Cam16 to avoid repeated calculation
      // ===========================================================
      if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) {
        return 0;
      }
      const kR = HctSolver.Y_FROM_LINRGB[0];
      const kG = HctSolver.Y_FROM_LINRGB[1];
      const kB = HctSolver.Y_FROM_LINRGB[2];
      const fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];
      if (fnj <= 0) {
        return 0;
      }
      if (iterationRound === 4 || Math.abs(fnj - y) < 0.002) {
        if (linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01) {
          return 0;
        }
        return utils.argbFromLinrgb(linrgb);
      }
      // Iterates with Newton method,
      // Using 2 * fn(j) / j as the approximation of fn'(j)
      j = j - ((fnj - y) * j) / (2 * fnj);
    }
    return 0;
  }

  /**
   * Finds an sRGB color with the given hue, chroma, and L*, if
   * possible.
   *
   * @param hueDegrees The desired hue, in degrees.
   * @param chroma The desired chroma.
   * @param lstar The desired L*.
   * @return A hexadecimal representing the sRGB color. The color
   * has sufficiently close hue, chroma, and L* to the desired
   * values, if possible; otherwise, the hue and L* will be
   * sufficiently close, and chroma will be maximized.
   */
  static solveToInt(hueDegrees: number, chroma: number, lstar: number): number {
    if (chroma < 0.0001 || lstar < 0.0001 || lstar > 99.9999) {
      return utils.argbFromLstar(lstar);
    }
    hueDegrees = math.sanitizeDegreesDouble(hueDegrees);
    const hueRadians = (hueDegrees / 180) * Math.PI;
    const y = utils.yFromLstar(lstar);
    const exactAnswer = HctSolver.findResultByJ(hueRadians, chroma, y);
    if (exactAnswer !== 0) {
      return exactAnswer;
    }
    const linrgb = HctSolver.bisectToLimit(y, hueRadians);
    return utils.argbFromLinrgb(linrgb);
  }

  /**
   * Finds an sRGB color with the given hue, chroma, and L*, if
   * possible.
   *
   * @param hueDegrees The desired hue, in degrees.
   * @param chroma The desired chroma.
   * @param lstar The desired L*.
   * @return An CAM16 object representing the sRGB color. The color
   * has sufficiently close hue, chroma, and L* to the desired
   * values, if possible; otherwise, the hue and L* will be
   * sufficiently close, and chroma will be maximized.
   */
  static solveToCam(hueDegrees: number, chroma: number, lstar: number): Cam16 {
    return Cam16.fromInt(HctSolver.solveToInt(hueDegrees, chroma, lstar));
  }
}
export class ViewingConditions {
  /**
   * sRGB-like viewing conditions.
   */
  static DEFAULT = ViewingConditions.make();

  /**
   * Create ViewingConditions from a simple, physically relevant, set of
   * parameters.
   *
   * @param whitePoint White point, measured in the XYZ color space.
   *     default = D65, or sunny day afternoon
   * @param adaptingLuminance The luminance of the adapting field. Informally,
   *     how bright it is in the room where the color is viewed. Can be
   *     calculated from lux by multiplying lux by 0.0586. default = 11.72,
   *     or 200 lux.
   * @param backgroundLstar The lightness of the area surrounding the color.
   *     measured by L* in L*a*b*. default = 50.0
   * @param surround A general description of the lighting surrounding the
   *     color. 0 is pitch dark, like watching a movie in a theater. 1.0 is a
   *     dimly light room, like watching TV at home at night. 2.0 means there
   *     is no difference between the lighting on the color and around it.
   *     default = 2.0
   * @param discountingIlluminant Whether the eye accounts for the tint of the
   *     ambient lighting, such as knowing an apple is still red in green light.
   *     default = false, the eye does not perform this process on
   *       self-luminous objects like displays.
   */
  static make(
    whitePoint = utils.whitePointD65(),
    adaptingLuminance = ((200.0 / Math.PI) * utils.yFromLstar(50.0)) / 100.0,
    backgroundLstar = 50.0,
    surround = 2.0,
    discountingIlluminant = false,
  ): ViewingConditions {
    const xyz = whitePoint;
    const rW = xyz[0] * 0.401288 + xyz[1] * 0.650173 + xyz[2] * -0.051461;
    const gW = xyz[0] * -0.250268 + xyz[1] * 1.204414 + xyz[2] * 0.045854;
    const bW = xyz[0] * -0.002079 + xyz[1] * 0.048952 + xyz[2] * 0.953127;
    const f = 0.8 + surround / 10.0;
    const c =
      f >= 0.9
        ? math.lerp(0.59, 0.69, (f - 0.9) * 10.0)
        : math.lerp(0.525, 0.59, (f - 0.8) * 10.0);
    let d = discountingIlluminant
      ? 1.0
      : f * (1.0 - (1.0 / 3.6) * Math.exp((-adaptingLuminance - 42.0) / 92.0));
    d = d > 1.0 ? 1.0 : d < 0.0 ? 0.0 : d;
    const nc = f;
    const rgbD = [
      d * (100.0 / rW) + 1.0 - d,
      d * (100.0 / gW) + 1.0 - d,
      d * (100.0 / bW) + 1.0 - d,
    ];
    const k = 1.0 / (5.0 * adaptingLuminance + 1.0);
    const k4 = k * k * k * k;
    const k4F = 1.0 - k4;
    const fl =
      k4 * adaptingLuminance +
      0.1 * k4F * k4F * Math.cbrt(5.0 * adaptingLuminance);
    const n = utils.yFromLstar(backgroundLstar) / whitePoint[1];
    const z = 1.48 + Math.sqrt(n);
    const nbb = 0.725 / Math.pow(n, 0.2);
    const ncb = nbb;
    const rgbAFactors = [
      Math.pow((fl * rgbD[0] * rW) / 100.0, 0.42),
      Math.pow((fl * rgbD[1] * gW) / 100.0, 0.42),
      Math.pow((fl * rgbD[2] * bW) / 100.0, 0.42),
    ];
    const rgbA = [
      (400.0 * rgbAFactors[0]) / (rgbAFactors[0] + 27.13),
      (400.0 * rgbAFactors[1]) / (rgbAFactors[1] + 27.13),
      (400.0 * rgbAFactors[2]) / (rgbAFactors[2] + 27.13),
    ];
    const aw = (2.0 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;
    return new ViewingConditions(
      n,
      aw,
      nbb,
      ncb,
      c,
      nc,
      rgbD,
      fl,
      Math.pow(fl, 0.25),
      z,
    );
  }

  /**
   * Parameters are intermediate values of the CAM16 conversion process. Their
   * names are shorthand for technical color science terminology, this class
   * would not benefit from documenting them individually. A brief overview
   * is available in the CAM16 specification, and a complete overview requires
   * a color science textbook, such as Fairchild's Color Appearance Models.
   */
  private constructor(
    public n: number,
    public aw: number,
    public nbb: number,
    public ncb: number,
    public c: number,
    public nc: number,
    public rgbD: number[],
    public fl: number,
    public fLRoot: number,
    public z: number,
  ) {}
}
