import designTokens from '@atlaskit/tokens/token-names';

const getUniqueWordsFromTokens = Object.keys(designTokens)
  .reduce<string[]>((accum, val) => [...accum, ...val.split('.')], [])
  .reduce<string[]>(
    (accum, val) => [
      ...accum,
      ...val.split(/(?=[A-Z])/g).map((e: string) => e.toLowerCase()),
    ],
    [],
  )
  .reduce<string[]>((accum, val) => {
    if (!accum.includes(val)) {
      accum.push(val);
    }

    return accum;
  }, []);

function filterDuplciateFoundations(meta: string[]) {
  const foundations = ['text', 'background', 'shadow', 'border'];
  let hasFoundation = false;

  return meta.filter((val) => {
    if (!hasFoundation && foundations.includes(val)) {
      hasFoundation = true;
      return true;
    }

    if (hasFoundation && foundations.includes(val)) {
      return false;
    }

    return true;
  });
}

export function cleanMeta(meta: string[]) {
  const cleanMeta = meta
    .reduce(
      (accum: string[], val: string) => [
        ...accum,
        ...(typeof val === 'string'
          ? val.split(/(?=[A-Z])/g).map((e) => e.toLowerCase())
          : []),
      ],
      [],
    )
    .reduce((accum: string[], val: string) => {
      accum.push(
        val
          .replace(/:/g, '')
          .replace(/,/g, '')
          .replace('grey', 'neutral')
          .replace('texts', 'text')
          .replace('red', 'danger')
          .replace('error', 'danger')
          .replace('invalid', 'danger')
          .replace('removed', 'danger')
          .replace('removal', 'danger')
          .replace('remove', 'danger')
          .replace('focus', 'focused')
          .replace('valid', 'success')
          .replace('successful', 'success')
          .replace('risk', 'warning')
          .replace('caution', 'warning')
          .replace('warn', 'warning')
          .replace('primary', 'bold')
          .replace('info', 'bold')
          .replace('secondary', 'subtle')
          .replace('hyperlink', 'link')
          .replace('anchor', 'link')
          .replace('active', 'pressed')
          .replace('hover', 'hovered')
          .replace('dragged', 'overlay')
          .replace('dragging', 'overlay')
          .replace('drag', 'overlay')
          .replace('background-color', 'background')
          .replace('color', 'text')
          .replace('icons', 'icon')
          .replace('arrow', 'icon')
          .replace('glyph', 'icon')
          .replace('stroke', 'border')
          .replace('border-left', 'border')
          .replace('border-right', 'border')
          .replace('border-top', 'border')
          .replace('border-bottom', 'border')
          .replace('box-shadow', 'shadow'),
      );

      return accum;
    }, [])
    .filter((val: string) => getUniqueWordsFromTokens.includes(val))
    .reduce((accum: string[], val: string) => {
      if (!accum.includes(val)) {
        accum.push(val);
      }

      return accum;
    }, []);

  return filterDuplciateFoundations(cleanMeta);
}
