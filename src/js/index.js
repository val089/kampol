import PhotoSwipeLightbox from '../../node_modules/photoswipe/dist/photoswipe-lightbox.esm';
import PhotoSwipe from '../../node_modules/photoswipe/dist/photoswipe.esm';
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

// PhotoSwipeLightbox
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

// ScrollPosition
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

// Hamburger
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const links = menu.querySelectorAll('.menu__link');
const toggle = () => {
  hamburger.classList.toggle('hamburger--isopen');
  menu.classList.toggle('menu--isopen');
};
hamburger.addEventListener('click', toggle);
links.forEach((link) => link.addEventListener('click', toggle));

// SCROLL TO SECTION
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
function removeFieldError(field) {
  const errorText = field.nextElementSibling;
  if (errorText !== null) {
    if (errorText.classList.contains('form-error-text')) {
      errorText.remove();
    }
  }
}

function createFieldError(field, text) {
  removeFieldError(field);

  const div = document.createElement('div');
  div.classList.add('form-error-text');
  div.innerText = text;
  if (field.nextElementSibling === null) {
    field.parentElement.appendChild(div);
  } else {
    if (!field.nextElementSibling.classList.contains('form-error-text')) {
      field.parentElement.insertBefore(div, field.nextElementSibling);
    }
  }
}

function toggleErrorField(field, show) {
  const errorText = field.nextElementSibling;
  if (errorText !== null) {
    if (errorText.classList.contains('form-error-text')) {
      errorText.style.display = show ? 'block' : 'none';
      errorText.setAttribute('aria-hidden', show);
    }
  }
}

function markFieldAsError(field, show) {
  if (show) {
    field.classList.add('field-error');
  } else {
    field.classList.remove('field-error');
    toggleErrorField(field, false);
  }
}

const form = document.querySelector('#contactForm');
const inputs = form.querySelectorAll('[required]');

form.setAttribute('novalidate', true);

for (const el of inputs) {
  el.addEventListener('input', (e) =>
    markFieldAsError(e.target, !e.target.checkValidity())
  );
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let formErrors = false;

  for (const el of inputs) {
    removeFieldError(el);
    el.classList.remove('field-error');

    if (!el.checkValidity()) {
      createFieldError(el, el.dataset.errorText);
      el.classList.add('field-error');
      formErrors = true;
    }
  }

  if (!formErrors) {
    const submit = form.querySelector('[type=submit]');
    submit.disabled = true;
    submit.classList.add('loading');

    const formData = new FormData(form);

    const url = form.getAttribute('action');
    const method = form.getAttribute('method');

    fetch(url, {
      method: method,
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          const selectors = res.errors.map((el) => `[name="${el}"]`);
          const fieldsWithErrors = form.querySelectorAll(selectors.join(','));
          for (const el of fieldsWithErrors) {
            markFieldAsError(el, true);
            toggleErrorField(el, true);
          }
        } else {
          if (res.status === 'ok') {
            const div = document.createElement('div');
            div.classList.add('form-send-success');
            div.innerText = 'Wysłanie wiadomości się nie powiodło';

            form.parentElement.insertBefore(div, form);
            div.innerHTML = `
                        <strong>Wiadomość została wysłana</strong>
                        <span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span>
                    `;
            form.remove();
            form.reset();
          }
          if (res.status === 'error') {
            const statusError = document.querySelector('.send-error');
            if (statusError) {
              statusError.remove();
            }

            const div = document.createElement('div');
            div.classList.add('send-error');
            div.innerText = 'Wysłanie wiadomości się nie powiodło';
            submit.parentElement.appendChild(div);
          }
        }
      })
      .finally(() => {
        submit.disabled = false;
        submit.classList.remove('loading');
      });
  }
});
