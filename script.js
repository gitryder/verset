const DEFAULT_TRANSLATION = "NKJV";

const form = document.getElementById("input__form");

const input = {
  book: document.getElementById("input__book"),
  chapter: document.getElementById("input__chapter"),
  verse: document.getElementById("input__verse"),
  translation: document.getElementById("input__translation"),
};

const verse = document.getElementById("verse");

const getHtmlContentFromUrl = async (url) => {
  return await (await fetch(url)).text();
};

const getVerseFromHtml = (html) => {
  const verseContent = new DOMParser()
    .parseFromString(html, "text/html")
    .querySelector('meta[property="og:description"]').content;

  return verseContent;
};

const focusRelevantInputField = (event) => {
  const isInputFieldEmpty = event.target.value === "";

  if (event.key === " ") {
    event.preventDefault();

    const nextInputField = event.target.nextElementSibling;

    if (nextInputField && !isInputFieldEmpty) {
      nextInputField.focus();
    } else {
      form.dispatchEvent(new Event("submit"));
    }
  }

  if (event.key === "Backspace") {
    if (isInputFieldEmpty) {
      event.preventDefault();
    }

    const previousInputField = event.target.previousElementSibling;

    console.log(previousInputField);

    if (previousInputField) {
      previousInputField.focus();
    }
  }
};

const submitFormOnEnterKeypress = (event) => {
  if (event.key === "Enter") {
    form.dispatchEvent(new Event("submit"));
  }
};

const onFormSubmit = (event) => {
  event.preventDefault();

  const url = `https://www.biblegateway.com/passage/?search=${input.book.value}
  +${input.chapter.value}%3A${input.verse.value}&version=${
    input.translation.value ?? DEFAULT_TRANSLATION
  }`;

  getHtmlContentFromUrl(url).then((htmlContent) => {
    displayVerse(getVerseFromHtml(htmlContent));
  });
};

const displayVerse = (verse) => {
  verse.innerHTML = verse;
};

window.addEventListener("load", () => {
  for (const inputField of Object.keys(input)) {
    input[inputField].addEventListener("keypress", focusRelevantInputField);
  }

  document.addEventListener("keypress", submitFormOnEnterKeypress);

  form.addEventListener("submit", onFormSubmit);
});

window.addEventListener("unload", () => {
  for (const inputField of Object.keys(input)) {
    input[inputField].removeEventListener("keypress", focusRelevantInputField);
  }

  document.removeEventListener("keypress", submitFormOnEnterKeypress);

  form.removeEventListener("submit", onFormSubmit);
});
