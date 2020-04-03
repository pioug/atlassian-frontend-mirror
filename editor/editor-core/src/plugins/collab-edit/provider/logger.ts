export const logger = (
  msg: string,
  data: any = null,
  style: string = 'color:blue;font-weight:bold;',
) => {
  // eslint-disable-next-line no-console
  console.log(`%cCollab-Edit: ${msg}`, style);
  if (data) {
    // eslint-disable-next-line no-console
    console.log(data);
  }
};
