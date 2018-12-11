const inputText = document.querySelector('#input-text');
const inputCheckbox = document.querySelector('#input-checkbox');
const inputColor = document.querySelector('#input-color');
const inputButton = document.querySelector('#input-button');
const textContainer = document.querySelector('#text-container');

const availableChars = {
  ' ': {
    noSvg: true
  },
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
    flip: 'horizontal-vertical'
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
    flip: 'vertical-horizontal'
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
    flip: 'vertical-horizontal'
  }
};



// CHECKBOX
inputCheckbox.addEventListener('change', () => {
  if (inputCheckbox.checked) {
    textContainer.classList.add('vertical');
  }
  else {
    textContainer.classList.remove('vertical');
  }
});

// COLOR
const changeColor = () => {
  const paths = document.querySelectorAll('svg .st0');
  Array.from(paths).forEach((path) => {
    // why doesn't path.style.fill work?
    path.setAttribute('style', 'fill: ' + inputColor.value + ' !important');
  });
};
inputButton.addEventListener('click', changeColor);

// WELCOME TExt
const availableCharsText = Object.keys(availableChars).join('');
// inputText.value = 'nsz';
inputText.value = 'HI ANIKA HI GEORG';

const svgFlip = (svgText, flipDirection) => {
  const x = flipDirection.includes('horizontal') ? -1 : 1;
  const y = flipDirection.includes('vertical') ? -1 : 1;
  const style = `style="transform: scale(${x}, ${y})"`;
  return svgText.replace('svg', `svg ${style}`);
}

const parseInput = () => {
  const value = inputText.value;
  console.log(value);

  const allRequests = [];

  newHtml = ``;
  for (let i = 0; i < value.length; i++) {
    const currentChar = value[i].toLowerCase();
    const charDetails = availableChars[currentChar];
    if (!charDetails) {
      continue;
    }

    let request;
    // fetch svg as text
    if (charDetails.noSvg) {
      request = new Promise((resolve, reject) => {
        resolve({
          svgText: ' ',
          currentChar,
          charDetails
        });
      })
    }
    else {
      request = fetch(`./assets/System_Alphabet_${currentChar.toUpperCase()}.svg`)
      .then((response) => {
        return response.text();
      })
      .then((svgText) => {
        // make all ids unique otherwise defs and references interfere with each other
        svgText = svgText.replace('SVGID', `SVGID${currentChar}${i}`);
        return {
          svgText,
          currentChar,
          charDetails
        };
      });
    }
    allRequests.push(request);
  }

  // make sure characters get processed in right order
  Promise.all(allRequests)
  .then((charInfos) => {
    console.log(charInfos);
    for(let i = 0; i < charInfos.length; i++) {
      const charInfo = charInfos[i];
      // process svg as inline
      let charHtml = `
        <div class="character ${charInfo.charDetails.flip} ${charInfo.currentChar}">`;
      // flip?
      if (charInfo.charDetails.flip) {
        charHtml += `${svgFlip(charInfo.svgText, charInfo.charDetails.flip)}`;
      }
      charHtml += `${charInfo.svgText}</div></div>`;
      newHtml += charHtml;
    }
    textContainer.innerHTML = newHtml;

    // persist color change
    changeColor();
  });

};


parseInput();
inputText.addEventListener('input', parseInput);

