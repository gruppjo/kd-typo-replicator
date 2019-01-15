'use strict';

const CONFIG = {
  canvasHologram: true
};

class CanvasRenderer {
  constructor(charsService) {
    this.charsService = charsService;

    this.dom = {
      canvas: null,
      canvasWidth: 0,
      canvasHeight: 0,
    };
    this.resetState();
  }
  resetState() {
    this.config = {
      lineHeight: 50,
      paddingCharacter: 5,
      paddingLine: 5,
      repeat: 500
    };

    this.state = {
      text: '',
      previousCharHeight: 0,
      previousCharWidth: 0,
      offsetX: 0,
      offsetY: 0
    };
  }

  setCanvas(canvas) {
    console.log('CanvasRenderer.canvas', canvas);
    this.dom.canvas = canvas;
    const boundingRect = canvas.getBoundingClientRect();
    this.dom.canvasWidth = canvas.width = boundingRect.width;
    this.dom.canvasHeight = canvas.height = boundingRect.height;
    this.dom.ctx = canvas.getContext('2d');
  }

  getCanvas() {
    return this.dom.canvas;
  }

  updateText(text, repeat) {
    this.stopRepeat();

    const charsService = this.charsService;
    const canvasWidth = this.dom.canvasWidth;
    const canvasHeight = this.dom.canvasHeight;
    const ctx = this.dom.ctx;
    // console.log(text.length);

    if (!text.length || text.length === 1) { // also capture selecting all, then typing
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      this.resetState();
    }
    if (!text.length) {
      return;
    }

    // char & its data
    const char = text[text.length - 1];
    const charData = charsService.charsData[char];
    const charDetails = charData.charDetails;

    const img = new Image();
    img.onload = () => {
      console.log('draw image');
      // charHeight/Width, aspectRatio
      // characterOffsetY
      const aspectRatio = img.width / img.height;
      const lineHeight = this.config.lineHeight;
      let characterOffsetY = 0;
      let charWidth, charHeight;
      switch (charDetails.flip) {
        case 'horizontal': {
          charWidth = lineHeight * aspectRatio;
          charHeight = lineHeight;
          break;
        }
        case 'vertical': {
          charWidth = lineHeight / 2 * aspectRatio;
          charHeight = lineHeight / 2;
          characterOffsetY = lineHeight / 2;
          break;
        }
        default: {
          charWidth = lineHeight * aspectRatio;
          charHeight = lineHeight;
        }
      }
      // offsets, direction & collision detection
      let offsetX = this.state.offsetX;
      let offsetY = this.state.offsetY;

      if (repeat) {
        if (charDetails.flip.startsWith('horizontal')) {
          offsetX += charWidth;
        }
        else {
          offsetY += charHeight;
        }
      }
      if (!repeat) {
        offsetX = offsetX + this.state.previousCharWidth + this.config.paddingCharacter;
      }

      if (offsetX + charWidth > canvasWidth) {
        offsetX = 0;
        offsetY += lineHeight + this.config.paddingLine;
      }
      if (offsetY + lineHeight > canvasHeight) {
        offsetY = 0;
      }

      // draw
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.drawImage(img, offsetX, offsetY + characterOffsetY, charWidth, charHeight);
      console.log('width', img.width, charData);

      // update state
      this.state.text = text;
      this.state.offsetX = offsetX;
      this.state.offsetY = offsetY;
      this.state.previousCharHeight = charHeight;
      this.state.previousCharWidth = charWidth;

      // repeat
      if (charDetails.flip) {
        this.startRepeat();
      }
    };
    img.src = charData.charUrl;
  }

  startRepeat() {
    this.interval = window.setInterval(() => {
      const text = this.state.text;
      this.updateText(text + text[text.length - 1], true); // add same character
    }, this.config.repeat);
  }
  stopRepeat() {
    clearInterval(this.interval);
  }
}


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
      console.log('charsData', charsData);
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
      const charUrl = `./assets/System_Alphabet_${char.toUpperCase()}.svg`;
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
          charDetails,
          charUrl
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

const canvasRenderer = new CanvasRenderer(charsService);

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
      // console.log('clear');
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
    // const char = value[value.length - 1];
    // console.log(char);
  }

  render() {
    let canvasRef;

    const svgChars = this.state.value.split('').map((char) => {
      return charsService.getCharJSX(char);
    });

    if (CONFIG.canvasHologram) {
      if (!canvasRenderer.getCanvas()) {
        canvasRef = React.createRef();
        // TODO: super dirty HACK to make sure cavnasRef.current is set
        window.setTimeout(() => {
          console.log(canvasRef);
          canvasRenderer.setCanvas(canvasRef.current);

          if (canvasRef.current) {
            console.log('ref available');
            canvasRenderer.updateText(this.state.value);
          }
          else {
            window.location.reload();
          }
        }, 5);
      }
      else {
        canvasRenderer.updateText(this.state.value);
      }

    }

    return (
      <div className="system">
        <h1>Typo Replicator</h1>
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
        {CONFIG.canvasHologram ?
          (
            <canvas id="canvas"
              ref={canvasRef}>
            </canvas>
          )
          : (
            <div id="text-container">
              {svgChars}
            </div>
          )
        }
      </div>
    );
  }
}