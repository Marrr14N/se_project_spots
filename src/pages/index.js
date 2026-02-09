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

const editProfileModal = document.querySelector("#edit-profile-modal");
const addCardModal = document.querySelector("#new-post-modal");
const avatarModal = document.querySelector("#avatar-modal");
const previewModal = document.querySelector("#preview-modal");
const deleteModal = document.querySelector("#delete-modal");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const newPostBtn = document.querySelector(".profile__add-btn");
const avatarEditBtn = document.querySelector(".profile__avatar-btn");

const editFormEl = editProfileModal.querySelector(".modal__form");
const addCardFormEl = addCardModal.querySelector(".modal__form");
const avatarFormEl = avatarModal.querySelector("#edit-avatar-form");
const deleteForm = deleteModal.querySelector("#delete-form");

const nameInputEl = editProfileModal.querySelector("#profile-name-input");
const descriptionInputEl = editProfileModal.querySelector(
  "#profile-description-input",
);
const captionInputEl = addCardFormEl.querySelector("#caption-input");
const linkInputEl = addCardFormEl.querySelector("#card-image-input");
const avatarInputEl = avatarFormEl.querySelector("#profile-avatar-input");

const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal(btn.closest(".modal"));
  });
});

const cancelDeleteBtn = deleteModal.querySelector(".modal__cancel-btn");
cancelDeleteBtn.addEventListener("click", () => closeModal(deleteModal));

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

api.getAppInfo().then(([cards, user]) => {
  profileNameEl.textContent = user.name;
  profileDescriptionEl.textContent = user.about;

  profileAvatarEl.src = user.avatar;

  profileAvatarEl.onerror = () => {
    profileAvatarEl.src = require("../images/avatar.jpg");
  };

  cards.forEach((card) => {
    cardsList.append(getCardElement(card));
  });
});

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

  likeBtn.addEventListener("click", () => {
    handleLike(data._id, likeBtn);
  });
  deleteBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  return cardElement;
}

function handleLike(cardId, likeBtn) {
  const isLiked = likeBtn.classList.contains("card__like-btn_active");

  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      likeBtn.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;

  setButtonText(btn, true, "Deleting...", "Delete");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(btn, false, "Deleting...", "Delete"));
}
deleteForm.addEventListener("submit", handleDeleteSubmit);

editProfileBtn.addEventListener("click", () => {
  nameInputEl.value = profileNameEl.textContent;
  descriptionInputEl.value = profileDescriptionEl.textContent;
  resetValidation(editFormEl, validationConfig);
  openModal(editProfileModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;

  setButtonText(btn, true);

  api
    .editUserInfo({
      name: nameInputEl.value,
      about: descriptionInputEl.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;

      editFormEl.reset();
      resetValidation(editFormEl, validationConfig);

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(btn, false));
}

editFormEl.addEventListener("submit", handleEditProfileSubmit);

newPostBtn.addEventListener("click", () => {
  openModal(addCardModal);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;

  setButtonText(btn, true);

  api
    .addCard({
      name: captionInputEl.value.trim(),
      link: linkInputEl.value.trim(),
    })
    .then((card) => {
      cardsList.prepend(getCardElement(card));

      closeModal(addCardModal);

      addCardFormEl.reset();
      resetValidation(addCardFormEl, validationConfig);
    })
    .catch(console.error)
    .finally(() => setButtonText(btn, false));
}

addCardFormEl.addEventListener("submit", handleAddCardSubmit);

avatarEditBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;

  setButtonText(btn, true);

  api
    .editAvatarInfo({ avatar: avatarInputEl.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;

      avatarFormEl.reset();
      resetValidation(avatarFormEl, validationConfig);

      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(btn, false));
}

avatarFormEl.addEventListener("submit", handleAvatarSubmit);

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) closeModal(modal);
  });
});

enableValidation(validationConfig);
