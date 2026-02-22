// Курсы валют (константы)
const RATE_USD = 2.85;
const RATE_EUR = 3.05;
const RATE_RUB = 0.034;

// функция для вывода в локальный блок сообщений
function showMessage(text, targetId = "message") {
  const msg = document.getElementById(targetId);
  if (!msg) return;
  msg.textContent = text;
}
// функция для вывода результата
function setResult(elId, text, isError = false) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  if (isError) el.classList.add("error");
  else el.classList.remove("error");
  console.log(elId + ": " + text);
}

// ЗАДАНИЕ 1: Валидация
function checkLogin() {
  // Получаем элементы и значения
  const ageRaw = document.getElementById("ageInput").value;
  const pass = document.getElementById("passInput").value;
  const emailEl = document.getElementById("emailInput");
  const emailValue = String(emailEl.value || "")
    .trim()
    .toLowerCase();

  // Очистка предыдущих сообщений
  setResult("loginResult", "");
  showMessage("");

  // 1) Проверка email (требование задания: сначала email)
  if (emailValue === "") {
    setResult("loginResult", "Email не указан.", true);
    showMessage("Проверьте поле Email.", "message-login");
    return; // Early Return при ошибке
  }
  // Используем встроенную валидацию браузера (type="email" + pattern)
  if (!emailEl.checkValidity()) {
    setResult("loginResult", "Неверный формат email.", true);
    showMessage("Проверьте формат Email.", "message-login");
    return;
  }
  // Дополнительное правило задания: email должен содержать букву "a"
  if (emailValue.indexOf("a") === -1) {
    setResult("loginResult", 'Email должен содержать символ "a".', true);
    showMessage("Проверьте правильность ввода Email.", "message-login");
    return;
  }

  // 2) Проверка возраста
  if (ageRaw === "") {
    setResult("loginResult", "Возраст не указан.", true);
    return;
  }
  const age = Number(ageRaw); //  объявление age
  if (Number.isNaN(age) || !Number.isFinite(age)) {
    setResult("loginResult", "Возраст должен быть числом.", true);
    showMessage("Введите корректный возраст (число).", "message-login");
    return;
  }
  // требование целого числа
  if (!Number.isInteger(age)) {
    setResult("loginResult", "Возраст должен быть целым числом.", true);
    showMessage("Введите корректный возраст (целое число).", "message-login");
    return;
  }
  if (age < 18) {
    setResult("loginResult", "Доступ только с 18 лет и старше.", true);
    showMessage(
      "Допускаются только совершеннолетние посетители.",
      "message-login",
    );
    return;
  }

  // 3) Проверка пароля
  if (!pass) {
    setResult("loginResult", "Пароль не указан.", true);
    return;
  }
  if (pass.length < 6) {
    setResult("loginResult", "Пароль должен быть не менее 6 символов.", true);
    return;
  }
  // Проверка на допустимые символы (буквы и цифры (совпадает с pattern в HTML))
  if (!/(?=.*\d)(?=.*[A-Za-z]).{6,}/.test(pass)) {
    setResult("loginResult", "Пароль должен содержать буквы и цифры.", true);
    return;
  }

  // Проверка: пароль не может состоять из одинаковых символов
  if (/^(.)\1+$/.test(pass)) {
    setResult(
      "loginResult",
      "Пароль слишком простой (одинаковые символы).",
      true,
    );
    return;
  }

  // Проверка: пароль должен содержать хотя бы одну букву и хотя бы одну цифру
  const hasLetter = /[A-Za-zА-Яа-яЁё]/.test(pass); // буквы латинские/кириллица
  const hasDigit = /[0-9]/.test(pass);
  if (!hasLetter || !hasDigit) {
    setResult(
      "loginResult",
      "Пароль должен содержать и буквы, и цифры (не только буквы и не только цифры).",
      true,
    );
    return;
  }

  // Если все проверки пройдены
  setResult("loginResult", "Доступ разрешён", false);
  showMessage("Валидация пройдена.", "message-login");
}

// ЗАДАНИЕ 2: Скидки
function calculateDiscount() {
  document
    .getElementById("calculateDiscountBtn")
    .addEventListener("click", calculateDiscount);
  const sumRaw = document.getElementById("sumInput").value;
  setResult("discountResult", "");
  showMessage("");

  if (sumRaw === "") {
    setResult("discountResult", "Введите сумму заказа.", true);
    showMessage("Поле суммы не должно быть пустым.", "message-discount");
    return;
  }

  const sum = Number(sumRaw);
  if (Number.isNaN(sum) || !Number.isFinite(sum) || sum < 0) {
    setResult("discountResult", "Неверная сумма.", true);
    showMessage(
      "Введите положительное число, например 123.45.",
      "message-discount",
    );
    return;
  }

  let discount = 0;
  if (sum > 500) discount = 20;
  else if (sum >= 100) discount = 10;
  else discount = 0;

  const finalSum = +(sum * (1 - discount / 100)).toFixed(2);
  const delivery = finalSum > 200 ? "Доставка бесплатная" : "Доставка платная";
  setResult(
    "discountResult",
    `К оплате: ${finalSum} BYN (скидка ${discount}%). ${delivery}`,
    false,
  );
  showMessage("Расчёт скидки выполнен.", "message-discount");
}

// ЗАДАНИЕ 3: Конвертер
function convertCurrency() {
  const amountRaw = document.getElementById("amountInput").value;
  const currency = document.getElementById("currencySelect").value;
  setResult("convertResult", "");
  showMessage("");

  if (amountRaw === "") {
    setResult("convertResult", "Введите сумму в BYN.", true);
    showMessage("Поле суммы обязательно для конвертации.", "message-convert");
    return;
  }

  const amount = Number(amountRaw);
  if (Number.isNaN(amount) || !Number.isFinite(amount) || amount < 0) {
    setResult("convertResult", "Неверная сумма.", true);
    showMessage("Сумма должна быть положительной.", "message-convert");
    return;
  }

  let rate;
  switch (currency) {
    case "USD":
      rate = RATE_USD;
      break;
    case "EUR":
      rate = RATE_EUR;
      break;
    case "RUB":
      rate = RATE_RUB;
      break;
    default:
      setResult("convertResult", "Неизвестная валюта.", true);
      showMessage("Выберите валюту из списка.", "message-convert");
      return;
  }

  const converted = (amount / rate).toFixed(2);
  setResult("convertResult", `${amount} BYN = ${converted} ${currency}`, false);
  showMessage("Конвертация выполнена.", "message-convert");
}

// ЗАДАНИЕ 4: Квиз
function startQuiz() {
  setResult("quizResult", "");
  showMessage("");

  const q1 = prompt("Вопрос 1: Что вернёт выражение 5 === '5' ? (true/false)");
  if (q1 === null) {
    setResult("quizResult", "Квиз отменён.", true);
    showMessage("Вы отменили квиз.", "message-quiz");
    return;
  }

  const q2 = prompt("Вопрос 2: Чем отличается let от const? (коротко)");
  if (q2 === null) {
    setResult("quizResult", "Квиз отменён.", true);
    showMessage("Вы отменили квиз.", "message-quiz");
    return;
  }

  const q3 = prompt("Вопрос 3: Как проверить, что значение NaN? (функция JS)");
  if (q3 === null) {
    setResult("quizResult", "Квиз отменён.", true);
    showMessage("Вы отменили квиз.", "message-quiz");
    return;
  }

  let score = 0;
  if (String(q1).trim().toLowerCase() === "false") score++;
  if (
    String(q2).toLowerCase().includes("измен") ||
    String(q2).toLowerCase().includes("можно изменить") ||
    String(q2).toLowerCase().includes("нельзя изменить")
  )
    score++;
  if (
    String(q3).toLowerCase().includes("isnan") ||
    String(q3).toLowerCase().includes("isnan()")
  )
    score++;

  setResult("quizResult", `Ваш результат: ${score}/3`, false, "message-quiz");
  showMessage("Квиз завершён.", "message-quiz");
}

// Привязка обработчиков
document.addEventListener("DOMContentLoaded", () => {
  const checkBtn = document.getElementById("checkLoginBtn");
  const discountBtn = document.getElementById("calculateDiscountBtn");
  const convertBtn = document.getElementById("convertCurrencyBtn");
  const quizBtn = document.getElementById("startQuizBtn");

  if (checkBtn) checkBtn.addEventListener("click", checkLogin);
  if (discountBtn) discountBtn.addEventListener("click", calculateDiscount);
  if (convertBtn) convertBtn.addEventListener("click", convertCurrency);
  if (quizBtn) quizBtn.addEventListener("click", startQuiz);
});
