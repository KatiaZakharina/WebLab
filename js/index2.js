document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.table');

  let keys = [],
    str = '';

  function createHeading() {
    let tmp = '';
    tmp += '<thead><tr>';
    for (let key in bd[0]) {
      keys.push(key);
      tmp += '<th> ' + key + '</th>';
    }
    tmp += '</tr></thead>';
    table.innerHTML = tmp;
  }
  createHeading();

  function createTableItems(item) {
    str += '<tr>';
    for (let key of keys) {
      str += `<td>` + item[key] + '</td>';
    }
    str += '<td><button class="close-btn" data-close></button></td></tr>';
  }
  bd.forEach(createTableItems);
  table.innerHTML += str;

  function createResultingRow(operation, result) {
    const tr = document.createElement('tr');
    let tmp = '';
    keys.forEach((key, index) => {
      tmp += !index ? `<td class=${operation}>${operation}:</td>` : `<td></td>`;
    });
    table.append(tr);
    tr.innerHTML = tmp;
    showResult(result);
  }
  function showResult(
    result,
    resultingRow = table.rows[table.rows.length - 1]
  ) {
    for (let i = 1; i < keys.length; i++) {
      resultingRow.cells[i].textContent = result[i];
    }
  }
  function showAverage() {
    let avg = getAvg();

    if (document.querySelector('.Average')) {
      let avgEl = document.querySelector('.Average');
      showResult(avg, avgEl.parentElement);
    } else {
      createResultingRow('Average', avg);
    }
  }
  function getAvg() {
    let avg = [];
    for (let j = 0; j < keys.length - 1; j++) {
      let sum = 0;
      for (let i = 1; i < bd.length - 1; i++) {
        sum += +table.rows[i].cells[j].textContent;
      }
      avg.push(!isNaN(sum / bd.length) ? ~~(sum / bd.length) : '');
    }
    return avg;
  }

  function showSum() {
    let sumRes = getSum();

    if (document.querySelector('.Sum')) {
      let sumEl = document.querySelector('.Sum');
      showResult(sumRes, sumEl.parentElement);
    } else {
      createResultingRow('Sum', sumRes);
    }
  }
  function getSum() {
    let sumRes = [];
    for (let j = 0; j < keys.length - 1; j++) {
      let sum = 0;
      for (let i = 1; i < bd.length - 1; i++) {
        sum += +table.rows[i].cells[j].textContent;
      }
      sumRes.push(!isNaN(sum) ? sum : '');
    }
    return sumRes;
  }

  showAverage();
  showSum();

  const postForm = document.querySelector('.post-inputs');
  function createInputs() {
    keys.forEach((key) => {
      const input = document.createElement('input');
      input.classList.add('post-input');
      input.type = 'text';
      input.required = true;
      input.placeholder = key;
      postForm.append(input);
    });
    const postBtn = document.createElement('button');
    postBtn.classList.add('post-btn');
    postBtn.type = 'submit';
    postBtn.textContent = 'Push';
    postForm.append(postBtn);
    addInputs = document.querySelectorAll('.post-input');
  }
  createInputs();
  const postBtn = document.querySelector('.post-btn'),
    postInputs = document.querySelectorAll('.post-input');
  postBtn.addEventListener('click', (e) => {
    addData(e);
  });

  function addData(e) {
    let isValid = true;
    postInputs.forEach((i) => {
      if (!i.validity.valid) isValid = false;
    });
    if (isValid) {
      e.preventDefault();
      const postedRow = document.createElement('tr');
      let str = '';
      postInputs.forEach((input) => {
        str += `<td>${input.value}</td>`;
      });
      str += '<td><button class="close-btn" data-close></button></td></tr>';
      table.prepend(postedRow);
      postedRow.innerHTML = str;
      addDataInBD(postInputs);
      postForm.reset();
      showAverage();
      showSum();
    }
    function addDataInBD(postInputs) {
      let obj = {};
      postInputs.forEach((input, index) => {
        obj[keys[index]] = input.value;
      });
      bd.unshift(obj);
    }
  }
  table.addEventListener('click', removeData);
  function removeData(e) {
    if (e.target.tagName == 'BUTTON') {
      console.dir(e.target.parentElement.parentElement);
      e.target.parentElement.parentElement.remove();
      // removeDataInBD(e.target.rowIndex);
    }
  }
});
