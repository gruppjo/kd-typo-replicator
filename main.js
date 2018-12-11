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

  newHtml = ``;
  for (let i = 0; i < value.length; i++) {
    const currentChar = value[i].toLowerCase();
    const charDetails = availableChars[currentChar];
    if (!charDetails) {
		  continue;
    }
    const charHtml = `
      <div class="character ${charDetails.flip}"><img src="./assets/System_Alphabet_${currentChar.toUpperCase()}.svg"></div>`;
      newHtml += charHtml;
  }

  textContainer.innerHTML = newHtml;
};
parseInput();
input.addEventListener('input', parseInput);

