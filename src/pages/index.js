import "../pages/index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editFormEl = editProfileModal.querySelector(".modal__form");
const nameInputEl = editProfileModal.querySelector("#profile-name-input");
const descriptionInputEl = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostBtn = document.querySelector(".profile__add-btn");
const addCardModal = document.querySelector("#new-post-modal");
const addCardCloseBtn = addCardModal.querySelector(".modal__close-btn");
const addCardFormEl = addCardModal.querySelector(".modal__form");
const captionInputEl = addCardFormEl.querySelector("#caption-input");
const linkInputEl = addCardFormEl.querySelector("#card-image-input");

const avatarEditBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarFormEl = avatarModal.querySelector("#edit-avatar-form");
const avatarInputEl = avatarFormEl.querySelector("#profile-avatar-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const cancelDeleteBtn = deleteModal.querySelector(".modal__cancel-btn");

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

let selectedCard = null;
let selectedCardId = null;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "eaf17628-e451-4aeb-90c0-2384a05a8c19",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      cardsList.append(getCardElement(card));
    });

    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileAvatarEl.style.backgroundImage = `url(${user.avatar})`;
  })
  .catch(console.error);

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const title = cardElement.querySelector(".card__title");
  const image = cardElement.querySelector(".card__image");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");
  const likeBtn = cardElement.querySelector(".card__like-btn");

  title.textContent = data.name;
  image.src = data.link;
  image.alt = data.name;

  image.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  if (data.isLiked) {
    likeBtn.classList.add("card__like-btn_active");
  }

  likeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  deleteBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  return cardElement;
}

function handleLike(evt, cardId) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_active");

  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      likeButton.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Deleting...", "Delete");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false, "Deleting...", "Delete"));
});

cancelDeleteBtn.addEventListener("click", () => closeModal(deleteModal));
deleteCloseBtn.addEventListener("click", () => closeModal(deleteModal));

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

function closePreviewModal() {
  previewImageEl.src = "";
  previewCaptionEl.textContent = "";
  closeModal(previewModal);
}

previewModalCloseBtn.addEventListener("click", closePreviewModal);

editProfileBtn.addEventListener("click", () => {
  nameInputEl.value = profileNameEl.textContent;
  descriptionInputEl.value = profileDescriptionEl.textContent;
  resetValidation(editFormEl, validationConfig);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal),
);

editFormEl.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: nameInputEl.value,
      about: descriptionInputEl.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
});

newPostBtn.addEventListener("click", () => {
  resetValidation(addCardFormEl, validationConfig);
  addCardFormEl.reset();
  openModal(addCardModal);
});

addCardCloseBtn.addEventListener("click", () => closeModal(addCardModal));

addCardFormEl.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCard({
      name: captionInputEl.value.trim(),
      link: linkInputEl.value.trim(),
    })
    .then((card) => {
      cardsList.prepend(getCardElement(card));
      addCardFormEl.reset();
      closeModal(addCardModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
});

avatarEditBtn.addEventListener("click", () => {
  resetValidation(avatarFormEl, validationConfig);
  avatarFormEl.reset();
  openModal(avatarModal);
});

avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));

avatarFormEl.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo({ avatar: avatarInputEl.value })
    .then((data) => {
      profileAvatarEl.style.backgroundImage = `url(${data.avatar})`;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
});

enableValidation(validationConfig);
