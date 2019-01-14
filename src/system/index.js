'use strict';

class CharsService {
  // use
  // .bootstrap
  // .charData and
  // .getCharJSX
  constructor() {
    this.availableCharsDetails = {
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
    this.availableCharsJoined = Object.keys(this.availableCharsDetails).join('');
  }

  bootstrap() {
    return this.fetchAllChars()
    .then((charsData) => {
      console.log('all loaded');
      console.log(charsData);
      this.charsData = {};
      charsData.map((charData) => {
        this.charsData[charData.char] = charData;
      });
    });
  }

  fetchAllChars() {
    const allRequests = [];

    // fetch all char files
    for (let i = 0; i < this.availableCharsJoined.length; i++) {
      const char = this.availableCharsJoined[i];
      const charDetails = this.availableCharsDetails[char];
      if (!charDetails) {
        continue;
      }

      let request;
      // fetch svg file as text
      request = fetch(`./assets/System_Alphabet_${char.toUpperCase()}.svg`)
      .then((response) => {
        return response.text();
      })
      // make manipulations to svgText and return charData object
      .then((svgText) => {
        // make all ids unique otherwise defs and references interfere with each other
        svgText = svgText.replace('SVGID', `SVGID${char}${i}`);
        return {
          svgText,
          char,
          charDetails
        };
      });
      allRequests.push(request);
    }


    // make sure characters get processed in right order
    return Promise.all(allRequests);
  }

  getCharJSX(char, duplicate, flip, invert) {
    const charData = this.charsData[char];
    // process svg as inline svg


    // flip? - hack: always flip and on flip don't flip
    // character svgs are improperly formatted
    // mirrored characters
    let svgHtml;
    if (charData.charDetails.flip) {
      svgHtml = `${invert ? charData.svgText : this.svgFlip(charData.svgText, charData.charDetails.flip)}`;
      if (duplicate) {
        svgHtml += `${!flip ? this.svgFlip(charData.svgText, charData.charDetails.flip) : charData.svgText}`;
      }
    }
    // non mirrored characters
    else {
      svgHtml = `${charData.svgText}`;
    }
    const className = `character ${charData.charDetails.flip} ${!duplicate ? 'no-duplicate' : ''} ${charData.char}`;
    return (
      <div className={className} dangerouslySetInnerHTML={{__html:
        svgHtml}}></div>
    );
  }

  getCharInlineSVG (char, flip, invert) {
    const charData = this.charsData[char];
    if (!charData) {
      console.warn(`CharsService.getCharInlineSVG() - character ${char} not available`);
      return;
    }

    // non-mirrored characters
    if (!charData.charDetails.flip) {
      return `${charData.svgText}`;
    }
    // non-mirrored character
    else {
      return `${invert ? charData.svgText : this.svgFlip(charData.svgText, flip)}`;
    }
  }

  svgFlip (svgText, flipDirection) {
    const x = flipDirection.includes('horizontal') ? -1 : 1;
    const y = flipDirection.includes('vertical') ? -1 : 1;
    const style = `style="transform: scale(${x}, ${y})"`;
    return svgText.replace('svg', `svg ${style}`);
  }

}

const charsService = new CharsService();
charsService.bootstrap()
.then(() => {
  const systemEl = document.querySelector('#system');
  if (systemEl) {
    ReactDOM.render(
      <System/>,
      systemEl
    );
  }
});

class System extends React.Component {
  render() {
    return (
      <InputArea />
    );
  }
}

class InputArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'yo'
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleKeyDown(event) {
    // console.log(event.key, event.keyCode);
    // clear on backspace
    if (event.keyCode === 8) { // backspace
      console.log('clear');
      // clear value
      this.setState({
        value: ''
      });
    }
    // do nothing on these chars
    if ( charsService.availableCharsJoined.indexOf(event.key.toLowerCase()) === -1 ) {
      event.preventDefault();

    }
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      value: value,

    });

    // print character
    // change event doesn't fire on backspace with onKeyDown
    const char = value[value.length - 1];
    console.log(char);
  }

  render() {

    const svgChars = this.state.value.split('').map((char) => {
      return charsService.getCharJSX(char);
    })

    return (
      <div>
        <section id="nav-configuration">
          <input id="input-vertical" type="checkbox" />
          <label htmlFor="input-vertical">Vertikal?</label>
          <input id="input-duplicate" type="checkbox" checked /> Duplizieren?
          <input id="input-flip" type="checkbox" checked /> Flip?
          <input id="input-color" type="text" value="turquoise" />
          <label htmlFor="input-color">hexcolor</label>
          <input id="input-button" type="button" value="Farbe Anwenden" />
        </section>
        <input id="input-text" type="text" autoFocus
          value={this.state.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
        />
        <div id="text-container">
          {svgChars}
        </div>
      </div>
    );
  }
}
