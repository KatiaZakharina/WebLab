const table = document.querySelectorAll('#result');

function createHeading() {
  let tmp = '';
  tmp += '<thead><tr>';
  for (let key in bd[0]) {
    keys.push(key);
    tmp += '<th> ' + key + '</th>';
  }
  tmp += '</tr></thead>';
  result.innerHTML = tmp;
}

function createTableItems(item, i, bd) {
  str += '<tr>';
  let td = '';
  for (let key of keys) {
    str += `<td class="${key}">` + item[key] + '</td>';
  }
  str += '</tr>';
}

function createResultingRow() {
  str += '<tr>';
  keys.forEach((key, index) => {
    str += !index ? '<td>Total:</td>' : `<td class="total-${key}"> - </td>`;
  });
  str += '</tr>';
}

function showAverage(columnNum) {
  const columnElements = document.querySelectorAll(`.${keys[columnNum - 1]}`),
    result = document.querySelector(`.total-${keys[columnNum - 1]}`);
  let sum = 0;
  columnElements.forEach((item) => {
    sum += +item.textContent;
  });
  result.innerText = !isNaN(sum / bd.length)
    ? ~~(sum / bd.length)
    : 'Incorrect';
}

let keys = [],
  str = '';
createHeading();
bd.forEach(createTableItems);
createResultingRow();
result.innerHTML += str;
showAverage(4);
showAverage(2);
showAverage(3);
