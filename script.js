const apiKey = '1cafc8c3c68a2eb42f5a3268';
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const resultDiv = document.getElementById('result');
const amountInput = document.getElementById('amount');

// Функция для заполнения селектов валютами из API
async function populateCurrencyDropdowns() {
  try {
    // Берем курсы относительно USD для загрузки всех валют
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
    const data = await response.json();

    if (data.result === "success") {
      const currencies = Object.keys(data.conversion_rates);

      // Очищаем списки на всякий случай
      fromCurrencySelect.innerHTML = '';
      toCurrencySelect.innerHTML = '';

      currencies.forEach(currency => {
        // Создаем option для fromCurrency
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        fromCurrencySelect.appendChild(optionFrom);

        // Создаем option для toCurrency
        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        toCurrencySelect.appendChild(optionTo);
      });

      // По умолчанию ставим USD в "from" и UZS в "to" если есть
      fromCurrencySelect.value = 'USD';
      if (currencies.includes('UZS')) {
        toCurrencySelect.value = 'UZS';
      } else {
        toCurrencySelect.value = currencies[0];
      }
    } else {
      resultDiv.textContent = 'Ошибка при загрузке списка валют.';
    }
  } catch (error) {
    console.error('Ошибка:', error);
    resultDiv.textContent = 'Не удалось загрузить валюты.';
  }
}

// Функция конвертации валюты
async function convertCurrency() {
  const amount = amountInput.value;
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  if (!amount || isNaN(amount)) {
    resultDiv.textContent = 'Введите корректную сумму.';
    return;
  }

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rates[toCurrency];
      const convertedAmount = (amount * rate).toFixed(2);

      resultDiv.innerHTML = `✅ ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } else {
      resultDiv.textContent = 'Ошибка при получении курса валют.';
    }
  } catch (error) {
    console.error('Ошибка:', error);
    resultDiv.textContent = 'Ошибка сети или API.';
  }
}

// Загружаем валюты сразу при старте
populateCurrencyDropdowns();
