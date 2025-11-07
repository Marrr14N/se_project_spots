const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editFormEl = editProfileModal.querySelector(".modal__form");
const nameInputEl = editProfileModal.querySelector("#profile-name-input");
const descriptionInputEl = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const addCardModal = document.querySelector("#new-post-modal");
const addCardCloseBtn = addCardModal.querySelector(".modal__close-btn");
const addCardFormEl = addCardModal.querySelector(".modal__form");
const captionInputEl = addCardFormEl.querySelector("#caption-input");
const linkInputEl = addCardFormEl.querySelector("#card-image-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

function makeDeleteBtn() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "card__delete-btn";
  btn.setAttribute("aria-label", "Delete card");
  return btn;
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  let cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  if (!cardDeleteBtnEl) {
    cardDeleteBtnEl = makeDeleteBtn();
    cardElement.prepend(cardDeleteBtnEl);
  }

  cardImageEl.addEventListener("click", function () {
    previewCaptionEl.textContent = data.name;
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

/* --- RENDER initialCards ON LOAD --- */
initialCards.forEach(function (cardData) {
  const el = getCardElement(cardData);
  cardsList.append(el);
});

editProfileBtn.addEventListener("click", function () {
  nameInputEl.value = profileNameEl.textContent;
  descriptionInputEl.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

editFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  profileNameEl.textContent = nameInputEl.value;
  profileDescriptionEl.textContent = descriptionInputEl.value;
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(addCardModal);
});

addCardCloseBtn.addEventListener("click", function () {
  closeModal(addCardModal);
});

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const inputValues = {
    name: captionInputEl.value.trim(),
    link: linkInputEl.value.trim(),
  };
  if (!inputValues.name || !inputValues.link) return;
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  addCardFormEl.reset();
  closeModal(addCardModal);
});

cardsList.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".card__delete-btn");
  if (deleteBtn) {
    const card = deleteBtn.closest(".card");
    if (card) card.remove();
    return;
  }

  const likeBtn = e.target.closest(".card__like-btn");
  if (likeBtn) {
    likeBtn.classList.toggle("card__like-btn_active");
    return;
  }
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
  previewImageEl.src = "";
});

previewModal.addEventListener("click", function (e) {
  if (e.target === previewModal) {
    closeModal(previewModal);
    previewImageEl.src = "";
  }
});

document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    previewModal.classList.contains("modal_is-opened")
  ) {
    closeModal(previewModal);
    previewImageEl.src = "";
  }
});
