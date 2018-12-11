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
  },
  k: {
    flip: false,
  },
  l: {
    flip: false,
  },
  m: {
    flip: 'horizontal',
  },
  n: {
    flip: false
  },
  o: {
    flip: 'vertical'
  },
  p: {
    flip: false
  },
  q: {
    flip: false
  },
  r: {
    flip: false
  },
  s: {
    flip: 'vertical'
  },
  t: {
    flip: 'horizontal'
  },
  u: {
    flip: 'horizontal'
  },
  v: {
    flip: 'horizontal'
  },
  w: {
    flip: 'horizontal'
  },
  x: {
    flip: 'vertical'
  },
  y: {
    flip: 'horizontal'
  },
  z: {
    flip: 'vertical'
  }
};

const availableCharsText = Object.keys(availableChars).join('');

input.value = availableCharsText;

const parseInput = () => {
  const value = input.value;
  console.log(value);

  const allRequests = [];

  newHtml = ``;
  for (let i = 0; i < value.length; i++) {
    const currentChar = value[i].toLowerCase();
    const charDetails = availableChars[currentChar];
    if (!charDetails) {
      continue;
    }
    const request = fetch(`./assets/System_Alphabet_${currentChar.toUpperCase()}.svg`)
    .then((response) => {
      return response.text();
    })
    .then((svgText) => {
      return {
        svgText,
        currentChar,
        charDetails
      };
    });
    allRequests.push(request);
  }

  Promise.all(allRequests)
  .then((charInfos) => {
    console.log(charInfos);
    for(let i = 0; i < charInfos.length; i++) {
      const charInfo = charInfos[i];
      const charHtml = `
        <div class="character ${charInfo.charDetails.flip} ${charInfo.currentChar}">${charInfo.svgText}</div>`;
      newHtml += charHtml;
    }
    textContainer.innerHTML = newHtml;
  });

};
parseInput();
input.addEventListener('input', parseInput);

