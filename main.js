const input = document.querySelector('#input');
const textContainer = document.querySelector('#text-container');

input.addEventListener('input', () => {
  const value = input.value;
  console.log(value);

  newHtml = ``;
  for (let i = 0; i < value.length; i++) {
    const currentChar = value[i];
    const charHtml = `
      <div>${currentChar}</div>`;
      newHtml += charHtml;
  }

  textContainer.innerHTML = newHtml;
});
