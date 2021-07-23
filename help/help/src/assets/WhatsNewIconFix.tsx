import React from 'react';

export const svg = `<svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="14" height="17" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0" transform="translate(-0.0143849) scale(0.0168651 0.0138889)"/>
</pattern>
<image id="image0" width="61" height="72" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAABICAYAAABFjf2bAAAACXBIWXMAABYlAAAWJQFJUiTwAAAEHUlEQVR42u2brZvbRhDG3/EjYGho6DJDsZjFYccqGFaFBSaohe1f0JaFxfBYDI/limIWhZlF0OwMxd4Cj5K9vV3FllaW5HiY77F9+1vNx7sza0FDIzkG8BrABEAmImsENpIxgERfrkQkb/J9owBrmiowAMRox8zvnTX9shF+QrtCX6HrJ51pC+uc9A16Z72etbCJk4r/d35oESmshSxazNwAkPfFvTemK2pdDfGUxxb0Vje5F9BbAOZilrrgppYAGHs2t1to3f2NlXiSACpsbrp1UyUWPHuLyL0V23OSi5rAUwA3xp8KAMHkbRQ46awBpIZL3pDMddFLAM89UjUH8B+AcuNeWm59JyL7YA+ohTo910WXbv7sxIyeAfhiZOlWDjFoATwh+YnN7CvJPwIlxNaBY11wCHsgmQ4B+IHhLf3ZgPsJTnJC8jPbt7hP0H/zPPa5L8AzntfSPkC/PzP0187FCcmH0If8I+yFyt7za2+SSQfAAPBrlweOrrJp3CX0846gl12est525N5Xu9rVGtRpkjMcBnVjRxbtKqZddXqnvbSiViIjOdEsOXfAlvYbAjf3A6nELYCNr5EYOT4wVtjFgD14jkNjMgewtvtrkQU81f6Wz2XtnSs6BLPX4gq/GYDXJO9EJHsS0wqcOj6Y4TBZ2Dq84mNToVA7GYmIJyQXmmtsjnUJLhXAO33jriJ2egVthWiCx8OCb+CRB3irbyiGGNC67lsdNphDg4QkIgfwMPrMx8FvSBZ4PGJKRpcKbIBnsEZCEQ6Dt4XWtbuKGHHdMOisEa+Cyba9a/wjIhlJqKvvfpQM5roh0x6Kk788f99rxcl886/IAxzrrowH6NGlklyS3AC4txNy5Hi6L/soLWvaQpXZrVl6xQJOHa6817jP7ZrdpzqtwmSmwmTmUI6rcv1SAVzgMBfOBihOZhqeUxf4yAO8A/CuCrjnZSoXkXea0MxKk5KcRh7g1VDVmAW/1lIVm+CjSwU2we0nPsL3yzEXB+wBL8pENnEVcj2MLDQbTgYgTgo9Z29d+ajkjHQn9o7stxxgvR4bXZOlCpPMeOJ7X7voZuCtIlOZJaoub82wtQt8gqdzokLP17kKFdN+x+H3G120il74emOOUHyUr+QHwE7tan3mQwfQKxF5VSFOXGeHb+DiAS7UJfIjjni9nE9XiK7VyAN8ys+A/j0zcHbMQF69c4XH91WnpTiJfcL8SPvHEett2tsTe2VPwEf43ruuA1yWgXM97ftTr124wMVoBe2b3LTV605t30z4pe6db4MznOLUG4Nt2pteqgGSf7YE/LHXMojkh8DAD9oV6TV06HuiMYZgAW8Ep4NS+wES2xsM0UimNYHfD/p8VwN82MA1wC8D+ATwywI+AvwygSvALxvYUcc7KUv/A1QKjXmbIBaHAAAAAElFTkSuQmCC"/>
</defs>
</svg>
`;

export default function WhatsNewIconFix() {
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}
