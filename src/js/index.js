import { swiffyslider } from 'swiffy-slider';
import PhotoSwipeLightbox from '../../node_modules/photoswipe/dist/photoswipe-lightbox.esm';
import PhotoSwipe from '../../node_modules/photoswipe/dist/photoswipe.esm';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--with-custom-caption',
  children: '.pswp-gallery__item',
  pswpModule: PhotoSwipe,
});

lightbox.on('uiRegister', function () {
  lightbox.pswp.ui.registerElement({
    name: 'custom-caption',
    order: 9,
    isButton: false,
    appendTo: 'root',
    html: 'Caption text',
    onInit: (el, pswp) => {
      lightbox.pswp.on('change', () => {
        const currSlideElement = lightbox.pswp.currSlide.data.element;
        let captionHTML = '';
        if (currSlideElement) {
          const hiddenCaption = currSlideElement.querySelector(
            '.hidden-caption-content'
          );
          if (hiddenCaption) {
            // get caption from element with class hidden-caption-content
            captionHTML = hiddenCaption.innerHTML;
          } else {
            // get caption from alt attribute
            captionHTML = currSlideElement
              .querySelector('img')
              .getAttribute('alt');
          }
        }
        el.innerHTML = captionHTML || '';
      });
    },
  });
});

lightbox.init();

// SWIFFY SLIDER
window.swiffyslider = swiffyslider;
window.addEventListener('load', () => {
  window.swiffyslider.init();
});

// ADD ACTIVE CLASS ON SCROLL TO HEADER
let scrollpos = window.scrollY;
const header = document.querySelector('.header');
const header_height = header.offsetHeight;
const addClassOnScroll = () => header.classList.add('header--onscroll');
const removeClassOnScroll = () => header.classList.remove('header--onscroll');
window.addEventListener('scroll', function () {
  scrollpos = window.scrollY;
  if (scrollpos >= header_height) {
    addClassOnScroll();
  } else {
    removeClassOnScroll();
  }
});

// HAMBURGER MENU
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const links = menu.querySelectorAll('.menu__link');
const toggle = () => {
  hamburger.classList.toggle('hamburger--isopen');
  menu.classList.toggle('menu--isopen');
};
hamburger.addEventListener('click', toggle);
links.forEach((link) => link.addEventListener('click', toggle));

//ADD ACTIVE ON SCROLL TO LINK MENU
const sections = document.querySelectorAll('.section');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - sectionHeight / 4) {
      current = section.getAttribute('id');
    }
  });
  links.forEach((link) => {
    link.classList.remove('menu__link--active');
    if (link.classList.contains(current)) {
      link.classList.add('menu__link--active');
    }
  });
});
