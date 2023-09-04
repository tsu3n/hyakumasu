'use strict';
const LEN = 10

const playDiv = document.getElementById('play-div');

/**
 * 乱数を返す
 * @param {number} min 最小値
 * @param {number} max 最大値
 * @return {number} 乱数
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 乱数を返す(重複なし)
 * @param {number} min 最小値
 * @param {number} max 最大値
 * @return {number[]} 乱数の配列
 */
function createRandomNumbers(min, max) {
  const numbers = [];

  for (let i = min; i <= max; i++) {
    while (true) {
      const number = random(min, max);

      if (!numbers.includes(number)) {
        numbers.push(number);
        break;
      }
    }
  }

  return numbers;
}

/** 
 * 問題を返す
 * @param {string} method 計算方式
 * @param {number} len 長さ
 * @return {number[][]} 問題
 */
function createQuestion(method, len) {
  switch (method) {
    case 'add':
    case 'multi':
      return [createRandomNumbers(0, len - 1), createRandomNumbers(0, len - 1)];
    case 'sub':
      return [createRandomNumbers(10, (len - 1) + 10), createRandomNumbers(0, len - 1)];
    case 'div':
      const raightSide = createRandomNumbers(1, len);
      const columns = [];
      const numbers = createRandomNumbers(1, len);

      for (let i = 0; i < raightSide.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
          columns.push(numbers[i] * raightSide[j]);
        }
      }

      return [columns, numbers];
  }
}

/**
 * 計算記号の文字を返す
 * @param {string} method selectの値
 * @return {string} 計算記号
 */
function getSymbol(method) {
  switch (method) {
    case 'add':
      return '+';
    case 'sub':
      return '-';
    case 'multi':
      return 'x';
    case 'div':
      return '÷';
  }
}

/**
 * inputのidを返す
 * @param {number} columnCount 
 * @param {number} rowCount 
 * @return {string} id
 */
function createInputId(columnCount, rowCount) {
  return 'input-' + (columnCount + rowCount * 10);
}

/**
 * inputのvalueを返す
 * @return {number[]} values
 */
function getInputValue() {
  const inputValues = [];

  for (let i = 0; i < 100; i++) {
    const value = document.getElementById('input-' + i).value;

    if (value === '') {
      inputValues.push(null);
    } else {
      inputValues.push(parseInt(value));
    }
  }

  return inputValues;
}

/**
 * 答えを返す
 * @param {string} method 
 * @param {number[]} columns 
 * @param {number[]} rows 
 * @return {number[]}
 */
function getAnswers(method, columns, rows) {
  let answers = [];

  switch (method) {
    case 'add':
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columns.length; j++) {
          answers.push(columns[j] + rows[i]);
        }
      }
      break;
    case 'sub':
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columns.length; j++) {
          answers.push(columns[j] - rows[i]);
        }
      }
      break;
    case 'multi':
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columns.length; j++) {
          answers.push(columns[j] * rows[i]);
        }
      }
      break;
    case 'div':
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columns.length / rows.length; j++) {
          answers.push(columns[j + i * 10] / rows[i]);
        }
      }
      break;
  }

  return answers;
}

/**
 * スタート画面のdivを返す
 * @return {HTMLDivElement} スタート画面
 */
function createStartDiv() {
  const div = document.createElement('div');

  const h1 = document.createElement('h1');

  const h1Text = document.createTextNode('百ます計算');

  const span = document.createElement('span');

  const spanText = document.createTextNode('交差するところに計算の答えを記入します。');

  const div2 = document.createElement('div');
  div2.classList.add('mt-1rem', 'center');

  const select = document.createElement('select');
  select.setAttribute('id', 'method-select');
  select.classList.add('select');

  const option1 = document.createElement('option');
  option1.setAttribute('value', 'add');
  const option1Text = document.createTextNode('足し算');

  const option2 = document.createElement('option');
  option2.setAttribute('value', 'sub');
  const option2Text = document.createTextNode('引き算');

  const option3 = document.createElement('option');
  option3.setAttribute('value', 'multi');
  const option3Text = document.createTextNode('掛け算');

  const option4 = document.createElement('option');
  option4.setAttribute('value', 'div');
  const option4Text = document.createTextNode('割り算');

  const button = document.createElement('button');
  button.classList.add('ml-1rem', 'button');
  button.addEventListener('click', play);

  const buttonText = document.createTextNode('開始');

  h1.appendChild(h1Text);

  span.appendChild(spanText);

  option1.appendChild(option1Text);
  option2.appendChild(option2Text);
  option3.appendChild(option3Text);
  option4.appendChild(option4Text);

  select.appendChild(option1);
  select.appendChild(option2);
  select.appendChild(option3);
  select.appendChild(option4);

  button.appendChild(buttonText);

  div2.appendChild(select);
  div2.appendChild(button);

  div.appendChild(h1);
  div.appendChild(span);
  div.appendChild(div2);

  return div;
}

/**
 * 問題のdivを返す
 * @param {string} method 計算方式
 * @param {number[]} columns 列
 * @param {number[]} rows 行
 * @return {HTMLDivElement} 問題
 */
function createQuestionDiv(method, columns, rows) {
  const div = document.createElement('div');

  if (method == 'div') {
    for (let i = 0; i < rows.length; i++) {
      const table = document.createElement('table');
      table.classList.add('table');

      const tbody = document.createElement('tbody');

      const tr = document.createElement('tr');

      const th = document.createElement('th');
      th.classList.add('th');

      const thText = document.createTextNode(getSymbol(method));

      th.appendChild(thText);
      tr.appendChild(th);

      for (let j = 0; j < columns.length / rows.length; j++) {
        const th = document.createElement('th');
        th.classList.add('th');

        const thText = document.createTextNode(columns[j + i * 10]);

        th.appendChild(thText);
        tr.appendChild(th);
      }

      const tr2 = document.createElement('tr');

      const th2 = document.createElement('th');
      th2.classList.add('th');

      const th2Text = document.createTextNode(rows[i]);

      th2.appendChild(th2Text);
      tr2.appendChild(th2);

      for (let k = 0; k < columns.length / rows.length; k++) {
        const td = document.createElement('td');
        td.classList.add('td');

        const input = document.createElement('input');
        input.classList.add('input');

        input.setAttribute('id', createInputId(k, i));

        td.appendChild(input);
        tr2.appendChild(td);
      }

      tbody.appendChild(tr);
      tbody.appendChild(tr2);

      table.appendChild(tbody);

      div.appendChild(table);
    }
    const button = createCheckAnswersButton(method, columns, rows);

    div.appendChild(button);

    return div;
  }

  const table = document.createElement('table');
  table.classList.add('table');

  const tbody = document.createElement('tbody');

  const tr = document.createElement('tr');

  const th = document.createElement('th');
  th.classList.add('th');

  const thText = document.createTextNode(getSymbol(method));

  th.appendChild(thText);
  tr.appendChild(th);

  for (let i = 0; i < columns.length; i++) {
    const th = document.createElement('th');
    th.classList.add('th');

    const thText = document.createTextNode(columns[i]);

    th.appendChild(thText);
    tr.appendChild(th);
  }

  tbody.appendChild(tr);

  for (let i = 0; i < rows.length; i++) {
    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.classList.add('th');

    const text = document.createTextNode(rows[i]);

    th.appendChild(text);
    tr.appendChild(th);

    for (let j = 0; j < columns.length; j++) {
      const td = document.createElement('td');
      td.classList.add('td');

      const input = document.createElement('input');
      input.setAttribute('id', createInputId(j, i));
      input.classList.add('input');

      td.appendChild(input);
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  const button = createCheckAnswersButton(method, columns, rows);

  div.appendChild(table);
  div.appendChild(button);
  return div;
}

/**
 * 答え合わせボタンを返す
 * @param {string} method 
 * @param {number[]} columns 
 * @param {number[]} rows 
 * @returns 
 */
function createCheckAnswersButton(method, columns, rows) {
  const div = document.createElement('div');
  div.classList.add('center');

  const button = document.createElement('button');
  button.classList.add('button');
  button.addEventListener('click', () => {
    checkAnswers(method, columns, rows);
  });

  const buttonText = document.createTextNode('答え合わせ');

  button.appendChild(buttonText);


  div.appendChild(button);

  return div;
}

/**
 * 結果のdivを返す
 * @param {string} method 
 * @param {number[]} columns 
 * @param {number[]} rows 
 * @param {number[]} values 
 * @param {number[]} answers 
 * @param {boolean[]} results 
 * @return {HTMLDivElement} 結果
 */
function createResultDiv(method, columns, rows, values, answers, results) {
  const div = document.createElement('div');

  if (method == 'div') {
    for (let i = 0; i < rows.length; i++) {
      const table = document.createElement('table');
      table.classList.add('table');

      const tbody = document.createElement('tbody');

      const tr = document.createElement('tr');

      const th = document.createElement('th');
      th.classList.add('th');

      const thText = document.createTextNode(getSymbol(method));

      th.appendChild(thText);
      tr.appendChild(th);

      for (let j = 0; j < columns.length / rows.length; j++) {
        const th = document.createElement('th');
        th.classList.add('th');

        const thText = document.createTextNode(columns[j + i * 10]);

        th.appendChild(thText);
        tr.appendChild(th);
      }

      const tr2 = document.createElement('tr');
      const th2 = document.createElement('th');
      th2.classList.add('th');

      const th2Text = document.createTextNode(rows[i]);

      th2.appendChild(th2Text);
      tr2.appendChild(th2);

      for (let j = 0; j < columns.length / rows.length; j++) {
        const td = createResultTd(results[j + i * 10], values[j + i * 10], answers[j + i * 10]);
        td.classList.add('td');

        tr2.appendChild(td);
      }

      tbody.appendChild(tr);
      tbody.appendChild(tr2);

      table.appendChild(tbody);

      div.appendChild(table);
    }

    const button = createAgainButton();

    div.appendChild(button);
    div.appendChild(button);

    return div;
  }

  const table = document.createElement('table');
  table.classList.add('table');

  const tbody = document.createElement('tbody');

  const tr = document.createElement('tr');

  const th = document.createElement('th');
  th.classList.add('th');

  const thText = document.createTextNode(getSymbol(method));

  th.appendChild(thText);
  tr.appendChild(th);

  for (let i = 0; i < columns.length; i++) {
    const th = document.createElement('th');
    th.classList.add('th');

    const thText = document.createTextNode(columns[i]);

    th.appendChild(thText);
    tr.appendChild(th);
  }

  tbody.appendChild(tr);

  for (let i = 0; i < rows.length; i++) {
    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.classList.add('th');

    const text = document.createTextNode(rows[i]);

    th.appendChild(text);
    tr.appendChild(th);

    for (let j = 0; j < columns.length; j++) {
      const td = createResultTd(results[j + i * 10], values[j + i * 10], answers[j + i * 10]);
      td.classList.add('td');

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  div.appendChild(table);

  const button = createAgainButton();

  div.appendChild(button);

  return div;
}

function createResultTd(result, value, answer) {
  const td = document.createElement('td');

  const div = document.createElement('div');
  div.classList.add('center');


  if (result) {
    const divText = document.createTextNode(answer);
    div.classList.add('text-green');


    div.appendChild(divText);
  } else {
    if (value == null || Number.isNaN(value)) {
      const span2 = document.createElement('span');
      const span2Text = document.createTextNode('→');

      const span3 = document.createElement('span');
      span3.classList.add('text-green');
      const span3Text = document.createTextNode(answer);

      span2.appendChild(span2Text);
      span3.appendChild(span3Text);

      div.appendChild(span2);
      div.appendChild(span3);
    } else {
      const span1 = document.createElement('span');
      const span1Text = document.createTextNode(value);
      span1.classList.add('text-red');

      const span2 = document.createElement('span');
      const span2Text = document.createTextNode('→');

      const span3 = document.createElement('span');
      span3.classList.add('text-green');
      const span3Text = document.createTextNode(answer);

      span1.appendChild(span1Text);
      span2.appendChild(span2Text);
      span3.appendChild(span3Text);

      div.appendChild(span1);
      div.appendChild(span2);
      div.appendChild(span3);
    }
  }

  td.appendChild(div);

  return td;
}
/**
 * もう1回ボタンを返す
 * @return {HTMLDivElement}
 */
function createAgainButton() {
  const div = document.createElement('div');
  div.classList.add('center');

  const button = document.createElement('button');
  button.classList.add('button');
  button.addEventListener('click', start);

  const buttonText = document.createTextNode('もう1回');

  button.appendChild(buttonText);

  div.appendChild(button);

  return div;
}

/**
 * スタート画面
 */
function start() {
  playDiv.innerHTML = '';

  const startDiv = createStartDiv();

  playDiv.appendChild(startDiv);
}

/**
 * プレイ
 */
function play() {
  const methodSelect = document.getElementById('method-select');

  const method = methodSelect.value;

  const [columns, rows] = createQuestion(method, LEN);

  playDiv.innerHTML = '';

  const questionDiv = createQuestionDiv(method, columns, rows);
  playDiv.appendChild(questionDiv);
}

/**
 * 答え合わせ
 * @param {string} method 
 * @param {number[]} columns 
 * @param {number[]} rows 
 */
function checkAnswers(method, columns, rows) {
  const answers = getAnswers(method, columns, rows);
  const inputValues = getInputValue();

  const results = [];
  for (let i = 0; i < answers.length; i++) {
    results.push(answers[i] === inputValues[i]);
  }

  const resultDiv = createResultDiv(method, columns, rows, inputValues, answers, results);

  playDiv.innerHTML = '';

  playDiv.appendChild(resultDiv);
}

window.addEventListener('load', start)

