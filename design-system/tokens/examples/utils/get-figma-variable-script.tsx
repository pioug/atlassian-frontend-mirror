import { ThemeOptionsSchema } from '../../src/theme-config';

export default function getFigmaVariableScript(
  customTheme: ThemeOptionsSchema,
  lightTokens: { [key: string]: string },
  darkTokens: { [key: string]: string },
) {
  return `
  function parseColor(color) {
    color = color.trim();
    const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
    const rgbaRegex =
      /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d.]+)\s*\)$/;
    const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
    const hslaRegex =
      /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([\d.]+)\s*\)$/;
    const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
    const floatRgbRegex =
      /^\{\s*r:\s*[\d\.]+,\s*g:\s*[\d\.]+,\s*b:\s*[\d\.]+(,\s*opacity:\s*[\d\.]+)?\s*\}$/;

    if (rgbRegex.test(color)) {
      const [, r, g, b] = color.match(rgbRegex);
      return { r: parseInt(r) / 255, g: parseInt(g) / 255, b: parseInt(b) / 255 };
    } else if (rgbaRegex.test(color)) {
      const [, r, g, b, a] = color.match(rgbaRegex);
      return {
        r: parseInt(r) / 255,
        g: parseInt(g) / 255,
        b: parseInt(b) / 255,
        a: parseFloat(a),
      };
    } else if (hslRegex.test(color)) {
      const [, h, s, l] = color.match(hslRegex);
      return hslToRgbFloat(parseInt(h), parseInt(s) / 100, parseInt(l) / 100);
    } else if (hslaRegex.test(color)) {
      const [, h, s, l, a] = color.match(hslaRegex);
      return Object.assign(
        hslToRgbFloat(parseInt(h), parseInt(s) / 100, parseInt(l) / 100),
        { a: parseFloat(a) }
      );
    } else if (hexRegex.test(color)) {
      const hexValue = color.substring(1);
      const expandedHex =
        hexValue.length === 3
          ? hexValue
              .split("")
              .map((char) => char + char)
              .join("")
          : hexValue;
      return {
        r: parseInt(expandedHex.slice(0, 2), 16) / 255,
        g: parseInt(expandedHex.slice(2, 4), 16) / 255,
        b: parseInt(expandedHex.slice(4, 6), 16) / 255,
      };
    } else if (floatRgbRegex.test(color)) {
      return JSON.parse(color);
    } else {
      throw new Error("Invalid color format");
    }
  }

  function setFigmaVariables(name) {

    const collectionName = name || "custom-theme-${customTheme.brandColor}"
    const lightTokens = ${JSON.stringify(lightTokens, null, 2)};
    const darkTokens = ${JSON.stringify(darkTokens, null, 2)};


    const allCollections = figma.variables.getLocalVariableCollections();
    const localCollection = allCollections.find((collection) => collection.name === collectionName)
    const collection = localCollection || figma.variables.createVariableCollection(collectionName)

    if(collection.modes.length === 1) {
      collection.renameMode(collection.modes[0].modeId, "light")
      collection.addMode("dark")
    }
    const lightModeId = collection.modes[0].modeId
    const darkModeId = collection.modes[1].modeId

    Object.entries(lightTokens).forEach(([name, value]) => {
      console.log("Setting value of: ", name)

    let colorVariable = figma.variables.getVariableById(
        collection.variableIds.find((id) => figma.variables.getVariableById(id).name === name.replaceAll('.','/')
      ));
      if(!colorVariable) {
        colorVariable = figma.variables.createVariable(name.replaceAll('.','/'), collection.id, "COLOR");
      }

      colorVariable.setValueForMode(lightModeId, parseColor(value));
      colorVariable.setValueForMode(darkModeId, parseColor(darkTokens[name]));
    });

    console.log("Variables set!")
  }

  setFigmaVariables()

  console.warn(\`\\n\\nFigma variables set to a collection named "custom-theme-${
    customTheme.brandColor
  }" \\nIf you want to replace an existing theme, type 'setFigmaVariables(\\"my theme\\")' and press Enter in the Figma console\\n\\n\\n\`)
`;
}
