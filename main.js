const input = document.querySelector('#input');
const textContainer = document.querySelector('#text-container');

const availableChars = {
  a: {
    flip: 'horizontal',
  },
  b: {
    flip: 'vertical',
  },
  c: {
    flip: 'vertical',
  },
  d: {
    flip: 'vertical',
  },
  e: {
    flip: 'vertical',
  },
  f: {
    flip: false,
  },
  g: {
    flip: false,
  },
  h: {
    flip: 'horizontal',
  },
  i: {
    flip: 'vertical',
  },
  j: {
    flip: false,
  }
}

input.addEventListener('input', () => {
  const value = input.value;
  console.log(value);

  newHtml = ``;
  for (let i = 0; i < value.length; i++) {
    const currentChar = value[i].toLowerCase();
    const charDetails = availableChars[currentChar];
    if (!charDetails) {
		  return
    }
    const charHtml = `
      <div class="character ${charDetails.flip}"><img src="./assets/System_Alphabet_${currentChar.toUpperCase()}.svg"></div>`;
      newHtml += charHtml;
  }

  textContainer.innerHTML = newHtml;
});
