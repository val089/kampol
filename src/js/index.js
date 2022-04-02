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
            captionHTML = hiddenCaption.innerHTML;
          } else {
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

window.swiffyslider = swiffyslider;
window.addEventListener('load', () => {
  window.swiffyslider.init();
});

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

const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const links = menu.querySelectorAll('.menu__link');
const toggle = () => {
  hamburger.classList.toggle('hamburger--isopen');
  menu.classList.toggle('menu--isopen');
};
hamburger.addEventListener('click', toggle);
links.forEach((link) => link.addEventListener('click', toggle));

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

// FORM

const form = document.querySelector('#contactForm');
const inputs = form.querySelectorAll('input[required], textarea[required]');

form.setAttribute('novalidate', true);

const displayFieldError = function (elem) {
  const fieldRow = elem.closest('.form-row');
  const fieldError = fieldRow.querySelector('.field-error');
  if (fieldError === null) {
    const errorText = elem.dataset.error;
    const divError = document.createElement('div');
    divError.classList.add('field-error');
    divError.innerText = errorText;
    fieldRow.appendChild(divError);
  }
};

const hideFieldError = function (elem) {
  const fieldRow = elem.closest('.form-row');
  const fieldError = fieldRow.querySelector('.field-error');
  if (fieldError !== null) {
    fieldError.remove();
  }
};

[...inputs].forEach((elem) => {
  elem.addEventListener('input', function () {
    if (!this.checkValidity()) {
      this.classList.add('error');
    } else {
      this.classList.remove('error');
      hideFieldError(this);
    }
  });
});

const checkFieldsErrors = function (elements) {
  let fieldsAreValid = true;

  [...elements].forEach((elem) => {
    if (elem.checkValidity()) {
      hideFieldError(elem);
      elem.classList.remove('error');
    } else {
      displayFieldError(elem);
      elem.classList.add('error');
      fieldsAreValid = false;
    }
  });

  return fieldsAreValid;
};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (checkFieldsErrors(inputs)) {
    const elements = form.querySelectorAll(
      'input:not(:disabled), textarea:not(:disabled), select:not(:disabled)'
    );

    const dataToSend = new FormData();
    [...elements].forEach((el) => dataToSend.append(el.name, el.value));

    const url = form.getAttribute('action');
    const method = form.getAttribute('method');

    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.classList.add('element-is-busy');

    fetch(url, {
      method: method.toUpperCase(),
      body: dataToSend,
    })
      .then((ret) => ret.json())
      .then((ret) => {
        submit.disabled = false;
        submit.classList.remove('element-is-busy');

        if (ret.errors) {
          ret.errors.map(function (el) {
            return '[name="' + el + '"]';
          });
          const selector = ret.errors.join(',');
          checkFieldsErrors(form.querySelectorAll(selector));
        } else {
          if (ret.status === 'ok') {
            const div = document.createElement('div');
            div.classList.add('form-send-success');
            div.innerText = 'Wysłanie wiadomości się powiodło się';

            form.parentElement.insertBefore(div, form);
            div.innerHTML =
              '<strong>Wiadomość została wysłana.</strong><span> Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej.</span>';
            form.reset();
          }

          if (ret.status === 'error') {
            const div = document.createElement('div');
            div.classList.add('send-error');
            div.innerText = 'Wysłanie wiadomości się nie powiodło';
          }
        }
      })
      .catch((_) => {
        submit.disabled = false;
        submit.classList.remove('element-is-busy');
      });
  }
});
