const positionMap = {
  'top left': { position: 'top-start', animation: 'top' },
  'top center': { position: 'top', animation: 'top' },
  'top right': { position: 'top-end', animation: 'top' },
  'right top': { position: 'right-start', animation: 'right' },
  'right middle': { position: 'right', animation: 'right' },
  'right bottom': { position: 'right-end', animation: 'right' },
  'bottom left': { position: 'bottom-start', animation: 'bottom' },
  'bottom center': { position: 'bottom', animation: 'bottom' },
  'bottom right': { position: 'bottom-end', animation: 'bottom' },
  'left top': { position: 'left-start', animation: 'left' },
  'left middle': { position: 'left', animation: 'left' },
  'left bottom': { position: 'left-end', animation: 'left' },
};

export const POSITION_ATTRIBUTE_ENUM = {
  values: [
    'top left',
    'top center',
    'top right',
    'right top',
    'right middle',
    'right bottom',
    'bottom left',
    'bottom center',
    'bottom right',
    'left top',
    'left middle',
    'left bottom',
  ],
  default: 'right middle',
};

function positionToPopper(position) {
  return position && positionMap[position]
    ? positionMap[position].position
    : null;
}

/* Convert the autoFlip property into the array format that Popper expects.
 * The first item must not include the edge-position variation, or Popper will not understand it.
 */
export function getFlipBehavior(props) {
  return props.position && Array.isArray(props.autoFlip)
    ? [props.position.split(' ')[0]].concat(props.autoFlip)
    : null;
}

export function positionPropToPopperPosition(position) {
  return (
    positionToPopper(position) ||
    positionMap[POSITION_ATTRIBUTE_ENUM.default].position
  );
}
