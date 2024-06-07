import { useState, useRef, useEffect } from 'react';
import algoliasearch from 'algoliasearch';
import type { Article, ArticleItem, articleId as articleIdType } from '../../../src/index';
import { ARTICLE_ITEM_TYPES } from '../../../src/index';

import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';

// Styles provided by project MESA
const ArticleExtraStyles = `
    .content-platform-support {padding: 5px;}
    .content-platform-support .contentful-edit{position:relative;border:2px solid transparent}.content-platform-support .contentful-edit:hover .contentful-edit-icon{visibility:visible}.content-platform-support .contentful-edit.contentful-edit-icon-hover{border:2px dashed #79e2f2;background-color:#deebff;transition:border 1s,background-color 1s}.content-platform-support .contentful-edit-icon{position:absolute;visibility:hidden;bottom:.5rem;right:.5rem;cursor:pointer;border-radius:.5rem;border:.5px solid rgba(9,30,66,.04);box-shadow:0 1px 1px 0 rgba(37,56,88,.25)}.content-platform-support .contentful-btn{position:fixed;bottom:25px;right:25px;border-radius:25px;padding:15px;background-color:#00c7e5;color:#fff;box-shadow:0 1px 1px 0 rgba(37,56,88,.25);cursor:pointer}.content-platform-support .contentful-btn:hover{background-color:#00b8d9}.content-platform-support .contentful-btn:focus{background-color:#00a3bf}
    .content-platform-support .products{display:flex;flex-wrap:wrap;list-style:none}.content-platform-support .products__icon{padding:.6rem;background-color:#dfe1e6;margin-right:1.6rem}.content-platform-support .products__link{display:flex;align-items:center;margin:1rem;font-size:1.4rem;text-decoration:none;color:#42526e}.content-platform-support .products__link:hover{text-decoration:none;color:inherit}.content-platform-support .products__blurb{color:#6c798f;margin:0;line-height:1.1rem;font-size:1.2rem;font-weight:400}.content-platform-support .products__item{flex:0 0 25%;height:5.1rem}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .products__item{flex:0 0 50%}}@media screen and (min-width:768px) and (max-width:1023px){.content-platform-support .products__item{flex:0 0 33.3%}}.content-platform-support .products__item:hover{background-color:#f4f5f7}
    .content-platform-support .dropdown{display:flex;flex-direction:row;position:absolute;box-shadow:0 15px 50px 5px hsla(0,0%,9%,.1);min-height:35rem;width:100%;z-index:3}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .dropdown{flex:none;display:block}}.content-platform-support .dropdown__mobile-item{display:flex;justify-content:space-between;height:6rem;align-items:center;padding:0 2.5rem 0 4rem;border-bottom:1px solid #dfe1e6;cursor:pointer;font-size:1.8rem;font-weight:500}.content-platform-support li.dropdown__product-item{border-radius:3px;flex:none;width:50%;margin-top:1rem;margin-bottom:1rem;padding:.5rem 1rem;display:flex;align-items:center}.content-platform-support li.dropdown__product-item .products__link{margin:0;width:100%}.content-platform-support li.dropdown__product-item .products__icon{border-radius:3px;height:4rem;width:4rem}@media screen and (min-width:0) and (max-width:767px){.content-platform-support li.dropdown__product-item{width:100%}}.content-platform-support .dropdown__main-content-wrapper{flex:1;background-color:#fff}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .dropdown__main-content-wrapper{flex:1}}.content-platform-support .dropdown__main-content{padding:0 4rem 3rem 0}@media screen and (min-width:1024px){.content-platform-support .dropdown__main-content{max-width:683.33333333px;margin-left:auto;padding-left:70px;padding-top:0}}@media screen and (min-width:768px) and (max-width:1023px){.content-platform-support .dropdown__main-content{padding-left:2rem}}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .dropdown__main-content{padding-top:1rem;padding-left:2rem}}.content-platform-support .dropdown__main-content>a:link,.content-platform-support .dropdown__main-content>a:visited{margin-left:1rem;color:#0052cc;text-decoration:none}.content-platform-support .dropdown__main-content .products{margin-bottom:1rem}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .dropdown__main-content .products{margin-top:0}}.content-platform-support .dropdown__side-content{background-color:#f4f5f7;padding:3rem 0 3rem 4rem}@media screen and (min-width:1024px){.content-platform-support .dropdown__side-content{width:calc(50% - 153.333333px)}}@media screen and (min-width:768px) and (max-width:1023px){.content-platform-support .dropdown__side-content{flex:0 0 35%}}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .dropdown__side-content{flex:1}}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .dropdown__resources{margin-top:0}}.content-platform-support .dropdown__resources ul.cards__inner{padding:0;background-color:inherit}.content-platform-support .dropdown__resources ul.cards__inner li.cards__item{border-radius:3px;box-shadow:none;padding:.5rem 1rem;display:flex;align-items:center;margin:10px 0;width:50%}.content-platform-support .dropdown__resources ul.cards__inner li.cards__item:hover{background-color:#f4f5f7}.content-platform-support .dropdown__resources ul.cards__inner li.cards__item a.cards__link{display:flex;align-items:center;padding:0}.content-platform-support .dropdown__resources ul.cards__inner li.cards__item a.cards__link div.cards__icon{padding:0 2rem 0 0}.content-platform-support .dropdown__resources ul.cards__inner li.cards__item a.cards__link div.cards__icon img{vertical-align:top}.content-platform-support .dropdown__resources ul.cards__inner li.cards__item div.cards__main h3{color:#42526e;font-size:14px;font-weight:400;padding-bottom:.6rem}.content-platform-support .dropdown__resources ul.cards__inner li.cards__item div.cards__main p{color:#6c798f;margin:0;line-height:11px;font-size:12px;font-weight:400}.content-platform-support .nav-links__list{list-style:none}.content-platform-support .nav-links__list li{margin:.2rem 0}.content-platform-support .nav-links__list li.nav-links__item{margin:.8rem 0}.content-platform-support .nav-links__list li a:link,.content-platform-support .nav-links__list li a:visited{text-decoration:none;color:#5e6c84}.content-platform-support .nav-links__item--icon a{display:flex;align-items:center}.content-platform-support .nav-links__item--icon a>span:last-child{margin-left:1rem}.content-platform-support .nav-links__item--wac{margin-top:2rem!important}.content-platform-support li.nav-links__item--icon.nav-links__item--contact{margin-bottom:1rem}
    .content-platform-support .cards{display:flex;flex:1 1 100%;flex-grow:1;flex-shrink:1;flex-basis:100%}.content-platform-support .cards__inner{display:flex;flex-wrap:wrap;list-style:none;background-color:#fafbfc;padding:1rem;width:100%;margin:0 auto}.content-platform-support .cards__link{display:flex;padding:1.6rem 1.6rem 2.4rem 0;height:100%}.content-platform-support .cards__link:hover .cards__button{background:#dfe1e6}.content-platform-support .cards__link:focus{outline:2px solid #4c9aff;outline-offset:2px}.content-platform-support .cards__item{box-shadow:0 1px 1px 0 rgba(37,56,88,.25);background-color:#fff;position:relative;margin:1rem 1rem 1rem 1.4rem;float:left;width:calc(50% - 2.4rem)}.content-platform-support .cards__item>a:link,.content-platform-support .cards__item>a:visited{text-decoration:none;color:#000;width:100%}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .cards__item{width:calc(100% - 2rem)}}.content-platform-support .cards__icon{padding:0 2rem 1rem}.content-platform-support .cards__icon svg{height:4.9rem;width:3.5rem}.content-platform-support .cards__title{line-height:1.25}
    .content-platform-support .contact-block--inner{text-align:center}.content-platform-support a.contact-block--btn{background-color:#79f2c0;color:#172b4d!important;font-weight:600}.content-platform-support a.contact-block--btn:hover{background-color:#57d9a3}.content-platform-support a.contact-block--btn:focus{background-color:#79f2c0}.content-platform-support .contact-block__header{font-family:CharlieSans;font-weight:500;font-size:2.4rem;line-height:32px;color:#253858;margin-bottom:2.4rem;letter-spacing:.3px}
    .content-platform-support .preview-banner{background-color:#ffab00;color:#172b4d;padding:1rem 0;text-align:center;font-weight:500;font-size:2rem;position:fixed;width:100%;top:0;z-index:1040}
    .content-platform-support .header-components{position:relative}.content-platform-support .subheader{margin-top:5rem}.content-platform-support .header{background-color:#0052cc}.content-platform-support .header__mobile-nav{display:none}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .header__mobile-nav{display:flex;width:60vw}}@media screen and (min-width:768px) and (max-width:1023px){.content-platform-support .header__mobile-nav{display:flex;width:60vw}}.content-platform-support .header__mobile-nav span:first-of-type{cursor:pointer}.content-platform-support .header__mobile-nav h2{width:100%;text-align:center;padding-left:40px;margin-top:0;color:#fff}.content-platform-support .header__nav-title{color:#fff;line-height:1.42857143;text-decoration:none}.content-platform-support .header__nav-title h1{font-family:CharlieSans;line-height:3.2rem;letter-spacing:0;font-size:2.4rem;font-weight:400;color:#fff}.content-platform-support .header__nav-title h1:hover{color:#fff}.content-platform-support .header__inner-container{display:flex;margin:0 auto;max-width:1060px}.content-platform-support .header__inner-container.large-width{max-width:1280px}.content-platform-support .header__inner-content{min-height:88px;width:100%;display:flex;flex-flow:row wrap;justify-content:space-between;align-items:center;padding-left:20px;padding-right:20px;position:relative}@media screen and (min-width:1024px){.content-platform-support .header__inner-content{padding-left:70px;padding-right:70px}}.content-platform-support .header__nav-list{list-style-type:none;color:#fff;font-weight:400;display:flex;align-items:center}.content-platform-support .header__nav-list li:not(:last-child){margin-right:.5rem}.content-platform-support .header__nav-list li:not(:last-child).header__nav-item--search-icon{margin-right:8px}.content-platform-support .header__nav-item{display:inline-block;border-radius:3px;cursor:pointer;display:inline-flex;align-items:center;padding:.5rem}.content-platform-support .header__nav-item.account-btn-wrapper{padding:0}.content-platform-support .header__nav-item.account-btn-wrapper .account__avatar{width:34px}.content-platform-support .header__nav-item a:link,.content-platform-support .header__nav-item a:visited{text-decoration:none}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .header__nav-item{margin-right:0!important}}.content-platform-support .header__nav-item--icon{border-radius:50%}.content-platform-support .header__nav-item--icon svg{height:22px;width:22px}.content-platform-support .header__nav-item--search-icon{display:flex;align-items:center;justify-content:center;margin-right:10px}@media screen and (min-width:0) and (max-width:360px){.content-platform-support .header__nav-item--search-icon{display:none}}.content-platform-support .header__nav-item--search-icon:hover{background-color:transparent}@media screen and (min-width:1024px){.content-platform-support .header__nav-item--dropdown-button{display:none}}.content-platform-support .header__nav-item--waffle{align-self:center;left:-55px;position:absolute}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .header__nav-item--waffle{display:none}}@media screen and (min-width:768px) and (max-width:1023px){.content-platform-support .header__nav-item--waffle{display:none}}.content-platform-support .header__nav-item>a{color:#fff;text-decoration:none}.content-platform-support .header__nav{align-items:center;display:flex;position:relative}.content-platform-support .header__nav--logo{color:#fff;display:flex}.content-platform-support .header__nav--primary{margin-left:1.5rem}.content-platform-support .header__nav--primary .header__nav-list .header__nav-item{height:3.2rem;line-height:3.2rem;margin-left:.5rem;padding:0 1rem}.content-platform-support .header__nav--primary .header__nav-list .header__nav-item:hover{background-color:#0747a6}.content-platform-support .header__nav--primary .header__nav-list .header__nav-item svg{height:3rem;width:3rem;position:relative;left:1.03rem;bottom:.06rem}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .header__nav--primary{display:none}}@media screen and (min-width:768px) and (max-width:1023px){.content-platform-support .header__nav--primary{display:none}}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .header__nav--secondary{display:none}}.content-platform-support .header__nav--secondary .contact-btn{margin-right:1rem;padding-left:1rem;padding-right:1rem}.content-platform-support .header__nav--secondary .contact-btn:hover{background-color:#0747a6}.content-platform-support .header__nav--secondary .account__login-btn{border-radius:3px;height:30px;line-height:30px}.content-platform-support .header__nav--secondary .account__login-btn:hover{background-color:#0747a6}.content-platform-support .header__nav--secondary .account__login-btn a{font-weight:500;color:#fff;padding:0 10px}.content-platform-support .header__nav--tertiary{position:fixed;right:25px;top:25px}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .header__nav--tertiary{display:none}}.content-platform-support .header__nav--mobile{display:none;color:#fff}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .header__nav--mobile{display:inline-block}}.content-platform-support .header__nav--mobile .header-nav-item{border-radius:100px}
    .content-platform-support .footer{background-color:#f4f5f7}.content-platform-support .footer__inner-container{display:flex;margin:0 auto;max-width:1060px;padding:0 20px}@media screen and (min-width:1024px){.content-platform-support .footer__inner-container{padding:0 70px}}.content-platform-support .footer__inner-container.large-width{max-width:1280px}.content-platform-support .footer__inner-content{min-height:120px;width:100%;display:flex;justify-content:space-between;align-items:center;color:#505f79}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .footer__inner-content{flex-direction:column;align-items:flex-start}}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .footer__icon{margin:2rem 0}}.content-platform-support .footer__links ul{list-style-type:none}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .footer__links ul{display:flex;flex-direction:column;align-items:flex-start}}.content-platform-support .footer__links ul li{display:inline-block;padding:.3rem;border-radius:100px;font-weight:500;font-size:1.4rem}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .footer__links ul li{margin-bottom:1rem}}.content-platform-support .footer__links ul li a:link,.content-platform-support .footer__links ul li a:visited{text-decoration:none;color:inherit}.content-platform-support .footer__links ul li:not(:last-child){margin-right:2.5rem}.content-platform-support .footer__links ul li:last-of-type:before{content:"   "}
    .content-platform-support .search-field{position:relative}.content-platform-support .search-field__icon{position:absolute;top:calc(50% - 12px);right:8px;color:#253858;cursor:pointer}
    .content-platform-support .not-found .main-content-container{display:flex;flex-direction:column;align-items:center;text-align:center}.content-platform-support .not-found h1{font-size:7.8rem}.content-platform-support .not-found__search{margin-top:2rem;width:30rem}
    .content-platform-support .all-products{display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}.content-platform-support .all-products__sub-header{display:flex;align-items:center;margin:2.4rem auto 3.2rem;justify-content:space-between}.content-platform-support .all-products__header{font-family:CharlieSans;font-weight:500;font-size:2.4rem;line-height:32px;color:#253858;margin-bottom:2.4rem;letter-spacing:.3px}.content-platform-support .all-products__browse{display:flex;flex-direction:column}.content-platform-support .all-products__browse--inner{margin:0 auto;width:100%}
    .content-platform-support .version-modal__body{padding:0 2rem;line-height:1.7}.content-platform-support .version-modal__footer{display:flex;justify-content:flex-end;padding:2rem}
    .content-platform-support .deployment-selector__version-item{display:block;padding-left:1rem;padding-right:1rem}.content-platform-support .deployment-selector__version-item span{color:#505f79}.content-platform-support .deployment-selector__heading{padding-left:1rem;padding-right:1rem;text-transform:uppercase;font-size:1.2rem;font-weight:600}.content-platform-support .deployment-selector__heading span{color:#505f79}
    .content-platform-support .anthology{display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}.content-platform-support .anthology__sub-header{display:flex;align-items:center;margin-bottom:3.2rem;justify-content:space-between}.content-platform-support .anthology__hero{margin-left:auto;margin-right:auto;display:flex}.content-platform-support .anthology__hero h1{font-family:CharlieSans;font-size:3.6rem;line-height:44px;letter-spacing:0;font-weight:500}.content-platform-support .anthology__hero--primary{width:100%}@media screen and (min-width:1024px){.content-platform-support .anthology__hero--primary{width:calc(100% - 155px);padding-right:5rem}}
    .content-platform-support .pagetree-expander{position:absolute;left:2rem;background-color:#f4f5f7;border-radius:.3rem;padding:.2rem;cursor:pointer}.content-platform-support .pagetree-expander:hover{background-color:#dfe1e6}.content-platform-support .pagetree-padding{display:none}@media screen and (min-width:1024px){.content-platform-support .pagetree-padding{flex-basis:33%;margin-right:8rem;display:block}}.content-platform-support .pagetree{position:fixed;width:calc(50% - 176.66666666666663px + 2.5rem);min-width:37.5rem;background-color:#ffff;box-shadow:1rem 0 2rem 0 hsla(0,0%,9%,.1);z-index:2;min-height:100vh;margin-top:-2rem;padding:2rem 2rem 0 7rem;left:-6rem}.content-platform-support .pagetree__inner{max-width:36rem;float:right;padding-left:7rem}@media screen and (min-width:1024px){.content-platform-support .pagetree__inner{max-width:22rem;padding-left:0}}.content-platform-support .pagetree__back-arrow{position:absolute;align-self:start;left:-5.5rem;background:#f4f5f7;border-radius:1.5rem;padding:.25rem;cursor:pointer}.content-platform-support .pagetree__back-arrow:hover{background-color:#dfe1e6}.content-platform-support .pagetree__context{padding-bottom:1.5rem;display:flex;align-items:center;position:relative}.content-platform-support .pagetree__icon{padding:.6rem;background-color:#dfe1e6;margin-right:1.6rem}.content-platform-support .pagetree__title{color:#172b4d;font-size:1.4rem;line-height:2rem;text-decoration:none}.content-platform-support .pagetree__title:hover{text-decoration:underline}.content-platform-support .pagetree__subhead{margin:0;padding:0;color:#7a869a;font-size:1.2rem;line-height:2rem}.content-platform-support .pagetree__list{display:block;list-style-type:disc;margin-block-start:1em;margin-block-end:1em;margin-inline-start:0;margin-inline-end:0;padding-inline-start:2rem}.content-platform-support .pagetree__list--root{padding-inline-start:0;-moz-user-select:none;user-select:none}.content-platform-support .pagetree__item{list-style:none;position:relative;color:#dfe1e6;margin-top:1rem}.content-platform-support .pagetree__item a{color:#42526e;font-size:1.4rem;text-decoration:none;padding-left:2rem;display:inline-block}.content-platform-support .pagetree__item a:hover{text-decoration:underline}.content-platform-support .pagetree__item--current-child-list>a{color:#091e42;font-weight:600}.content-platform-support .pagetree__item--current-item>a{color:#0052cc;font-weight:600}.content-platform-support .pagetree__expander{position:absolute;top:-.3rem;left:-.3rem;cursor:pointer;transition:transform .25s,color .25s,-webkit-transform .25s,-moz-transform .25s,-o-transform .25s}.content-platform-support div.pagetree__expander--current{width:1.2rem;left:.3rem;color:#0052cc}.content-platform-support .pagetree__expander--expanded{color:#091e42;transform:rotate(90deg)}
    .content-platform-support .author-tools__dropdown{position:absolute;top:calc(100% + .5rem);right:0;width:17rem}.content-platform-support .author-tools__link{height:3.2rem;font-size:1.4rem;margin:0 .5rem;list-style:none;color:#42526e}.content-platform-support .author-tools__link:hover{text-decoration:underline}.content-platform-support .author-tools__heading{font-weight:600;font-size:1.5rem;height:3.2rem;margin:0 .5rem;list-style:none}.content-platform-support .author-tools__contentful-logo{display:flex;align-items:center;position:fixed;right:25px;top:25px;border-radius:3px;cursor:pointer;z-index:1;padding:.5rem}
    .content-platform-support .global-hero__inner{position:relative;max-width:1060px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px}@media screen and (min-width:1024px){.content-platform-support .global-hero__inner{padding-left:70px;padding-right:70px}}.content-platform-support .global-hero{background-color:#0052cc;display:flex;padding:1rem 0;flex-direction:column}.content-platform-support .global-hero__inner{width:100%;padding-top:3.2rem}@media screen and (min-width:1024px){.content-platform-support .global-hero__inner{display:flex}}.content-platform-support .global-hero__top{height:25rem;padding-bottom:3.2rem;margin-bottom:3.2rem}@media screen and (min-width:1024px){.content-platform-support .global-hero__top{flex:1}}.content-platform-support .global-hero__bottom{visibility:hidden}@media screen and (min-width:1024px){.content-platform-support .global-hero__bottom{visibility:visible;flex:1;position:relative}}.content-platform-support .global-hero__img{position:absolute}.content-platform-support .global-hero__img--book-people{width:360px;right:-25px;bottom:-50px;display:block}.content-platform-support .global-hero__img--small-people{width:155px;left:0;bottom:-35px;display:block}.content-platform-support .global-hero__headline{color:#fff;font-size:3.6rem;font-family:CharlieSans;line-height:44px;letter-spacing:0;font-weight:500}.content-platform-support .global-hero__headline--secondary{font-size:2.4rem;color:#fff;font-weight:400;font-family:CharlieSans;line-height:28px;letter-spacing:.3px;margin-top:0}
    .content-platform-support .home{justify-content:space-between;min-height:100vh}.content-platform-support .home,.content-platform-support .home__browse{display:flex;flex-direction:column}.content-platform-support .home__browse--inner{margin:0 auto;width:100%}.content-platform-support a.home__browse--see-all{margin:1rem;display:inline-block;color:#0052cc;text-decoration:none;cursor:pointer}.content-platform-support .home__header{font-family:CharlieSans;font-weight:500;font-size:2.4rem;line-height:32px;color:#253858;margin-bottom:2.4rem;letter-spacing:.3px}.content-platform-support .home .footer__inner-container,.content-platform-support .home .global-hero__inner,.content-platform-support .home .header__inner-container,.content-platform-support .home .main-content-container{max-width:1020px}@media screen and (min-width:1024px){.content-platform-support .home .footer__inner-container,.content-platform-support .home .global-hero__inner,.content-platform-support .home .header__inner-container,.content-platform-support .home .main-content-container{padding:1rem}}@media screen and (min-width:1024px){.content-platform-support .home .header__inner-content{padding:0}}
    .content-platform-support .product{display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}.content-platform-support .product__sub-header{display:flex;align-items:center;margin:2.4rem auto 3.2rem;justify-content:space-between}.content-platform-support .product__title h1{font-family:CharlieSans;font-size:3.6rem;line-height:44px;letter-spacing:0;font-weight:500}
    .content-platform-support .documented-product{display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}.content-platform-support .documented-product__sub-header{display:flex;align-items:center;margin-bottom:3.2rem;justify-content:space-between}.content-platform-support .documented-product__hero{margin-left:auto;margin-right:auto;display:flex}@media screen and (min-width:1024px){.content-platform-support .documented-product__hero{padding-bottom:10rem}}.content-platform-support .documented-product__hero h1{font-family:CharlieSans;font-size:3.6rem;line-height:44px;letter-spacing:0;font-weight:500}.content-platform-support .documented-product__hero--primary{width:100%}@media screen and (min-width:1024px){.content-platform-support .documented-product__hero--primary{width:calc(100% - 155px);padding-right:5rem}}.content-platform-support .documented-product__hero--secondary{display:none}@media screen and (min-width:1024px){.content-platform-support .documented-product__hero--secondary{display:block;width:155px}}.content-platform-support .documented-product__search-container{max-width:59rem}
    .content-platform-support .sidebar{display:flex;flex:1 1 34.47368421%;flex-direction:column;min-width:33%}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .sidebar{flex-direction:row;flex-wrap:wrap;justify-content:space-between;margin-top:50px}}.content-platform-support .sidebar__section{align-items:flex-start;display:flex;flex-direction:column;margin-bottom:4rem;padding-left:4rem}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .sidebar__section{padding-left:0;margin-right:10px}.content-platform-support .sidebar__section--hidden-mobile{display:none}}.content-platform-support .sidebar__link{display:block;font-weight:400;font-size:14px;line-height:2rem;letter-spacing:.5px;margin-bottom:1.5rem}.content-platform-support .sidebar__link:last-of-type{margin-bottom:0}.content-platform-support .sidebar__link-current{color:#42526e;text-decoration:none;display:list-item;list-style-type:disc;list-style-position:outside;pointer-events:none;cursor:default;font-weight:600;font-size:14px;line-height:2rem;letter-spacing:.5px;margin-bottom:1.5rem}.content-platform-support .sidebar__heading{display:block;font-family:CharlieSans;font-weight:500;font-size:16px;line-height:20px;letter-spacing:.5px;margin-bottom:2rem;text-decoration:none;color:#000}
    .content-platform-support .additional-help{margin-top:6rem}.content-platform-support .additional-help .button{margin-top:2rem}
    .content-platform-support .feedback{align-items:center;display:flex}.content-platform-support .feedback__question-text{font-weight:700;margin-right:1rem}.content-platform-support .feedback__no-wrapper{position:relative}.content-platform-support .feedback__no-button{margin-left:.2rem}.content-platform-support .feedback__dropdown{background-color:#fff;border:1px solid #dfe1e6;border-radius:3px;box-shadow:0 2px 5px 1px #f4f5f7;display:none;min-width:170px;padding:10px;position:absolute;right:0;top:calc(100% + 2px);z-index:2}.content-platform-support .feedback__dropdown.is-open{display:block}.content-platform-support .feedback__dropdown label{align-items:center}.content-platform-support .feedback__report-a-problem{margin-left:2rem}.content-platform-support .feedback__report-a-problem:focus{outline:none}
    .content-platform-support .topic__inner-container{display:flex}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .topic__inner-container{display:block}}.content-platform-support .topic__sub-header{display:flex;align-items:center;margin:0 auto 3.2rem;justify-content:space-between}.content-platform-support .topic__content{display:flex;flex:1 1 65.43859649%;flex-grow:1;flex-shrink:1;flex-basis:65%}.content-platform-support .topic__content div:nth-child(2){width:100%}.content-platform-support .topic__body{min-width:66.66%}.content-platform-support .topic__pagetree{width:calc(50% - 213.33333333333337px - 5rem);left:-6rem}@media screen and (min-width:1024px){.content-platform-support .topic .page-tree-expanded{display:block}.content-platform-support .topic .page-tree-expanded .sidebar{padding-top:4rem}.content-platform-support .topic .page-tree-expanded .sidebar__section{padding-left:0}.content-platform-support .topic .page-tree-expanded .sidebar__table-of-contents{display:none}}.content-platform-support .topic .feedback{margin-top:4rem}
    .content-platform-support .topic-set__sub-header{display:flex;align-items:center;margin-bottom:3.2rem;justify-content:space-between}.content-platform-support .topic-set__body{min-width:66.66%}.content-platform-support .topic-set__sub-content{display:flex;flex-direction:row}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .topic-set__sub-content{display:block}}.content-platform-support .topic-set__sub-content .cards__item{flex:1 100%;width:unset}@media screen and (min-width:1024px){.content-platform-support .topic-set .page-tree-expanded{display:block}.content-platform-support .topic-set .page-tree-expanded .sidebar{padding-top:4rem}.content-platform-support .topic-set .page-tree-expanded .sidebar__section{padding-left:0}.content-platform-support .topic-set .page-tree-expanded .sidebar__table-of-contents{display:none}}
    .content-platform-support .section-overview{position:relative;margin-bottom:7.2rem}.content-platform-support .section-overview__short{margin-bottom:0}.content-platform-support .section-overview__short .section-overview__content{height:100%}.content-platform-support .section-overview__content{height:25.4rem;overflow-y:hidden}@media screen and (min-width:0) and (max-width:767px){.content-platform-support .section-overview__content{height:20.8rem}}.content-platform-support .section-overview__expandable-area{position:absolute;bottom:-5.2rem;height:11.2rem;display:flex;align-items:flex-end;width:100%;background:linear-gradient(hsla(0,0%,100%,0),hsla(0,0%,100%,.85),#fff)}.content-platform-support .section-overview__expandable-area--expanded{height:inherit}.content-platform-support .section-overview__expanded{height:100%}
    .content-platform-support .contact__sub-header{display:flex;align-items:center;margin:2.4rem auto 3.2rem}
    @font-face{font-family:CharlieSans;src:url(/resources/7c1c0a53957fc3b9f2716e8f26d50cf1.woff);font-style:normal;font-weight:400}@font-face{font-family:CharlieSans;src:url(/resources/47c1c8dd6486eb8fa21fe7540f6ff43c.woff);font-style:normal;font-weight:700}@font-face{font-family:CharlieSans;src:url(/resources/aa4aa85c7ef84dd4cb06bba4cd08a1b6.woff);font-style:normal;font-weight:500}@font-face{font-family:CharlieSans;src:url(/resources/6bf3af7a4a02d59eb95811b5a85ea443.woff);font-weight:800;font-style:normal}.content-platform-support *,.content-platform-support :after,.content-platform-support :before{margin:0;padding:0;box-sizing:inherit}.content-platform-support,html.content-platform-support{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Oxygen,Ubuntu,Droid Sans,Helvetica Neue,sans-serif}html.content-platform-support{font-size:62.5%}@media screen and (min-width:0) and (max-width:767px){html.content-platform-support{font-size:60%}}.content-platform-support body{font-size:1.4rem;font-weight:400;letter-spacing:-.005em}.content-platform-support h2{font-size:2rem;font-weight:500;letter-spacing:-.016rem;line-height:1.2}.content-platform-support h3{color:#172b4d;font-size:1.6rem;font-weight:500;letter-spacing:-.06rem;line-height:2}.content-platform-support h1{font-size:2.9rem;font-weight:500;letter-spacing:-.01em;line-height:1.10345}.content-platform-support main{width:100%}.content-platform-support .padding-top-medium{padding-top:2rem}.content-platform-support .margin-top-medium{margin-top:2rem}.content-platform-support .margin-top-large{margin-top:3.4rem!important}.content-platform-support .margin-bottom-medium{margin-bottom:2rem}.content-platform-support .margin-top-small{margin-top:.8rem}.content-platform-support .margin-bottom-small{margin-bottom:.8rem}.content-platform-support .content-wrapper{margin-bottom:6.5rem}.content-platform-support .cursor-pointer{cursor:pointer}.content-platform-support .pagetree-mobile-padding{padding-left:7rem!important}@media screen and (min-width:1024px){.content-platform-support .pagetree-mobile-padding{padding-left:inherit}}.content-platform-support .main-content-container{position:relative;max-width:1060px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px}@media screen and (min-width:1024px){.content-platform-support .main-content-container{padding-left:70px;padding-right:70px}}.content-platform-support .main-content-container.large-width{max-width:1280px}@media screen and (min-width:1024px){.content-platform-support .main-content-container.large-width{padding-left:70px;padding-right:70px}}.content-platform-support .title h1{font-family:CharlieSans;font-size:3.6rem;line-height:44px;letter-spacing:0;font-weight:500}.content-platform-support .flex-column-page{display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}.content-platform-support .flex-container{display:flex}.content-platform-support .icon-extension svg{display:inline-block;position:relative;top:.179em}.content-platform-support li+li{margin-top:0}.content-platform-support .ak-renderer-extension img{margin-top:20px}.content-platform-support .adf__content ol,.content-platform-support .adf__content ul{padding-left:40px}.content-platform-support .adf__content p{margin:12px 0 0}
`;

/**
 * This function modifies the HTML string (articleContent):
 * - wraps the content in a div
 * - open images in a new tab
 * - open links in a new tabarticleId
 *
 * NOTE: We need to use this function because we are using regular HTML for the articles and not ADF
 *
 * @param {string} articleContent
 */
const fixImagesAndLinkTags = (articleContent: string): string => {
	const htmlObject = document.createElement('div');
	htmlObject.innerHTML = articleContent;

	const imgs = htmlObject.getElementsByTagName('img');
	const links = htmlObject.getElementsByTagName('a');

	// Open images in a new tab/window
	for (let q = 0; q < imgs.length; q += 1) {
		const img = imgs[q];
		const imgParent = img.parentNode;
		const imgUrl = img.getAttribute('src');
		const wrapper = document.createElement('a');
		if (imgUrl != null) {
			img.setAttribute('style', 'display: block; margin-top: 0; max-width: 100%;');
			wrapper.setAttribute('href', imgUrl);
			wrapper.setAttribute('target', '_blank');
			wrapper.setAttribute('style', 'display:inline-block; max-width: 100%; margin-top: 20px;');
			if (imgParent) {
				imgParent.insertBefore(wrapper, img);
				wrapper.appendChild(img);
			}
		}
	}

	// open links in a new tab/window
	for (let q = 0; q < links.length; q += 1) {
		const link = links[q];
		link.setAttribute('target', '_blank');
	}

	const style = document.createElement('style');
	style.innerText = ArticleExtraStyles;
	htmlObject.prepend(style);

	return htmlObject.outerHTML;
};

// Algolia configuration
const ALGOLIA_CLIENT = algoliasearch('8K6J5OJIQW', '55176fdca77978d05c6da060d8724fe7');

interface useAlgoliaProps {
	productName?: string;
	productExperience?: string;
	algoliaIndexName?: string;
}

export const useAlgolia = ({
	productName: productNameValue = 'Jira Software',
	productExperience: productExperienceValue = 'Classic',
	algoliaIndexName: algoliaIndexNameValue = 'product_help_uat_copsi',
}: useAlgoliaProps) => {
	const [algoliaIndexName, setAlgoliaIndexName] = useState(algoliaIndexNameValue);
	const [productName, setProductName] = useState(productNameValue);
	const [productExperience, setProductExperience] = useState(productExperienceValue);
	const algoliaIndex = useRef(ALGOLIA_CLIENT.initIndex(algoliaIndexName));

	useEffect(() => {
		if (algoliaIndexNameValue !== algoliaIndexName) {
			setAlgoliaIndexName(algoliaIndexNameValue);
			algoliaIndex.current = ALGOLIA_CLIENT.initIndex(algoliaIndexName);
		}
	}, [algoliaIndexName, algoliaIndexNameValue]);

	const getArticleById = async (articleId: articleIdType): Promise<Article> => {
		return new Promise((resolve, reject) => {
			if (articleId.id === '') {
				resolve({
					body: '',
					bodyFormat: BODY_FORMAT_TYPES.adf,
					relatedArticles: [],
					id: '',
					lastPublished: '',
					title: '',
					type: ARTICLE_ITEM_TYPES.topicInProduct,
					routes: [],
				});
				return;
			}

			algoliaIndex.current.search(
				{
					filters: `id:${articleId.id}`,
				},
				(err, res: any = {}) => {
					if (err) {
						reject(err);
					}

					const article = res.hits[0];
					if (article) {
						const articleBodyUpdate = fixImagesAndLinkTags(article.body);
						article.body = articleBodyUpdate;

						resolve(article);
					} else {
						reject(res.message);
					}
				},
			);
		});
	};

	const getRelatedArticles = (
		routeGroup?: string | string[],
		routeName?: string | string[],
		articleId?: articleIdType,
	): Promise<ArticleItem[]> =>
		new Promise((resolve, reject) => {
			let facetFiltersValue: (string | string[])[];

			if (articleId?.id == null) {
				facetFiltersValue = [
					[`routes.routeGroup:${routeGroup || ''}<score=10>`, 'routes.hasGroup:false<score=1>'],
					routeName != null
						? [`routes.routeName:${routeName || ''}<score=5>`, 'routes.hasName:false<score=1>']
						: ['routes.hasName:false<score=1>'],
					`productName:${productName}`,
					'routes.routeGroup:-hide',
					'routes.routeName:-hide',
					`productExperience:${productExperience}`,
				];
			} else {
				facetFiltersValue = [
					[`routes.routeGroup:${routeGroup || ''}<score=10>`, 'routes.hasGroup:false<score=1>'],
					routeName != null
						? [`routes.routeName:${routeName || ''}<score=5>`, 'routes.hasName:false<score=1>']
						: ['routes.hasName:false<score=1>'],
					`id:-${articleId.id}`,
					`productName:${productName}`,
					'routes.routeGroup:-hide',
					'routes.routeName:-hide',
					`productExperience:${productExperience}`,
				];
			}

			const facetFilters = facetFiltersValue as string[] | string[][] | undefined;

			algoliaIndex.current.search(
				{
					facetFilters,
					// sumOrFiltersScores: true,
				},
				(err, res: any = {}) => {
					if (err) {
						reject(err);
					}

					resolve(res.hits);
				},
			);
		});

	const searchArticles = async (query: string): Promise<ArticleItem[]> =>
		new Promise((resolve, reject) => {
			algoliaIndex.current.search(
				{
					query,
					filters: `productName:"${productName}" AND NOT routes.routeGroup:"hide" AND NOT routes.routeName:"hide" AND productExperience:${productExperience}`,
				},
				(err, res: any = {}) => {
					if (err) {
						reject(err);
					}

					resolve(res.hits);
				},
			);
		});

	return {
		getArticleById,
		getRelatedArticles,
		searchArticles,
		productName,
		setProductName,
		productExperience,
		setProductExperience,
		algoliaIndexName,
		setAlgoliaIndexName,
	};
};
