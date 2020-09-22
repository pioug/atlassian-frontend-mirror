import { linkStyles } from '../../internal/shared/styles';

describe('Tag styles', () => {
  it('should get linkStyles for standard color', () => {
    const linkStylesObj = linkStyles('standard', '#FFEBE6');
    expect(linkStylesObj).toEqual({
      '&:focus': {
        outline: 'none',
      },
      '&:hover': {
        color: '#FFEBE6',
      },
      borderRadius: '3px',
      color: 'null',
      fontSize: '14px',
      fontWeight: 'normal',
      lineHeight: 1,
      maxWidth: '180px',
      overflow: 'hidden',
      paddingBottom: '2px',
      paddingLeft: '4px',
      paddingRight: '4px',
      paddingTop: '2px',
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
  });
  it('should get linkStyles for non standard color', () => {
    const linkStylesObj = linkStyles('green', '#FFEBE6');
    expect(linkStylesObj).toEqual({
      '&:focus': {
        outline: 'none',
      },
      '&:hover': {
        color: '#FFEBE6',
      },
      borderRadius: '3px',
      color: 'inherit',
      fontSize: '14px',
      fontWeight: 'normal',
      lineHeight: 1,
      maxWidth: '180px',
      overflow: 'hidden',
      paddingBottom: '2px',
      paddingLeft: '4px',
      paddingRight: '4px',
      paddingTop: '2px',
      textDecoration: 'underline',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
  });
});
