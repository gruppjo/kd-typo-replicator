'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONFIG = {
  canvasHologram: true,
  fontType: 'simplon'
};

var CanvasRenderer = function () {
  function CanvasRenderer(charsService) {
    _classCallCheck(this, CanvasRenderer);

    this.charsService = charsService;

    this.dom = {
      canvas: null,
      canvasWidth: 0,
      canvasHeight: 0
    };
    this.config = {
      lineHeight: 40,
      spaceWidth: 20,
      paddingCharacter: 5,
      paddingLine: 5,
      repeat: 300
    };

    this.resetState();
  }

  _createClass(CanvasRenderer, [{
    key: 'resetState',
    value: function resetState() {
      this.state = {
        text: '',
        previousCharHeight: 0,
        previousCharWidth: 0,
        previousCharFlipped: false,
        offsetX: 0,
        offsetY: 0
      };
    }
  }, {
    key: 'setCanvas',
    value: function setCanvas(canvas) {
      console.log('CanvasRenderer.canvas', canvas);
      this.dom.canvas = canvas;
      var boundingRect = canvas.getBoundingClientRect();
      this.dom.canvasWidth = canvas.width = boundingRect.width;
      this.dom.canvasHeight = canvas.height = boundingRect.height;
      this.dom.ctx = canvas.getContext('2d');
    }
  }, {
    key: 'getCanvas',
    value: function getCanvas() {
      return this.dom.canvas;
    }
  }, {
    key: 'setRepeat',
    value: function setRepeat(repeat) {
      this.config.repeat = repeat;
    }
  }, {
    key: 'updateText',
    value: function updateText(text, repeat) {
      var _this = this;

      this.stopRepeat();

      var charsService = this.charsService;
      var canvasWidth = this.dom.canvasWidth;
      var canvasHeight = this.dom.canvasHeight;
      var ctx = this.dom.ctx;
      // console.log(text.length);

      if (!text.length || text.length === 1) {
        // also capture selecting all, then typing
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.resetState();
      }
      if (!text.length) {
        return;
      }

      // char & its data
      var char = text[text.length - 1];
      var charData = charsService.charsData[char];

      if (!charData) {
        // like space
        this.state.offsetX += this.config.spaceWidth;
        console.log('here');
      } else {
        var charDetails = charData.charDetails;
        var img = new Image();
        img.onload = function () {
          console.log('draw image');
          // charHeight/Width, aspectRatio
          // characterOffsetY
          var aspectRatio = img.width / img.height;
          var lineHeight = _this.config.lineHeight;
          var characterOffsetY = 0;
          var charWidth = void 0,
              charHeight = void 0;
          switch (charDetails.flip) {
            case 'horizontal':
            case 'horizontal-vertical':
              {
                charWidth = lineHeight * aspectRatio;
                charHeight = lineHeight;
                break;
              }
            case 'vertical':
            case 'vertical-horizontal':
              {
                charWidth = lineHeight / 2 * aspectRatio;
                charHeight = lineHeight / 2;
                characterOffsetY = 0;
                break;
              }
            default:
              {
                charWidth = lineHeight * aspectRatio;
                charHeight = lineHeight;
              }
          }
          // offsets, direction & collision detection
          var offsetX = _this.state.offsetX;
          var offsetY = _this.state.offsetY;

          if (repeat) {
            if (charDetails.flip.startsWith('horizontal')) {
              offsetX += charWidth;
            } else {
              offsetY += charHeight;
            }
          }
          if (!repeat) {
            offsetX = offsetX + _this.state.previousCharWidth + _this.config.paddingCharacter;
          }

          if (offsetX + charWidth > canvasWidth) {
            offsetX = 0;
            offsetY += lineHeight + _this.config.paddingLine;
          }
          if (offsetY + lineHeight > canvasHeight) {
            offsetX += _this.state.previousCharWidth + _this.config.paddingCharacter;
            offsetY = 0;
          }

          // draw
          ctx.imageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.drawImage(img, offsetX, offsetY + characterOffsetY, charWidth, charHeight);
          console.log('width', img.width, charData);

          // update state
          _this.state.text = text;
          _this.state.offsetX = offsetX;
          _this.state.offsetY = offsetY;
          _this.state.previousCharHeight = charHeight;
          _this.state.previousCharWidth = charWidth;
          _this.state.previousCharFlipped = repeat ? !_this.state.previousCharFlipped : false;

          // repeat
          if (charDetails.flip) {
            _this.startRepeat();
          }
        };
        var x = 1;
        var y = 1;
        switch (charDetails.flip) {
          case 'horizontal':
            {
              x = !repeat ? -1 : this.state.previousCharFlipped ? -1 : 1;
              break;
            }
          case 'vertical':
            {
              y = !repeat ? -1 : this.state.previousCharFlipped ? -1 : 1;
              break;
            }
          case 'horizontal-vertical':
          case 'vertical-horizontal':
            {
              x = !repeat ? -1 : this.state.previousCharFlipped ? -1 : 1;
              y = !repeat ? -1 : this.state.previousCharFlipped ? -1 : 1;
              break;
            }
          default:
            {
              x = 1;
              y = 1;
            }
        }

        var dataUri = 'data:image/svg+xml;utf8,' + this.charsService.charsData[char].svgText.replace(/\r?\n|\r/g, '').replace(/\s\s+/g, ' ').replace('style="', 'style="transform: scale(' + x + ', ' + y + '); fill: #000 !important;');

        img.src = dataUri;
        console.log(dataUri);
      }
    }
  }, {
    key: 'startRepeat',
    value: function startRepeat() {
      var _this2 = this;

      this.interval = window.setInterval(function () {
        var text = _this2.state.text;
        _this2.updateText(text + text[text.length - 1], true); // add same character
      }, this.config.repeat);
    }
  }, {
    key: 'stopRepeat',
    value: function stopRepeat() {
      clearInterval(this.interval);
    }
  }]);

  return CanvasRenderer;
}();

var CharsService = function () {
  // use
  // .bootstrap
  // .charData and
  // .getCharJSX
  function CharsService() {
    _classCallCheck(this, CharsService);

    this.availableCharsDetails = {
      ' ': {
        noSvg: true
      },
      a: {
        flip: 'horizontal'
      },
      ä: {
        flip: 'horizontal'
      },
      b: {
        flip: 'vertical'
      },
      c: {
        flip: 'vertical'
      },
      d: {
        flip: 'vertical'
      },
      e: {
        flip: 'vertical'
      },
      f: {
        flip: false
      },
      g: {
        flip: false
      },
      h: {
        flip: 'horizontal'
      },
      i: {
        flip: 'vertical'
      },
      j: {
        flip: false
      },
      k: {
        flip: false
      },
      l: {
        flip: false
      },
      m: {
        flip: 'horizontal'
      },
      n: {
        flip: false
      },
      o: {
        flip: 'vertical'
      },
      ö: {
        flip: 'vertical'
      },
      p: {
        flip: false
      },
      q: {
        flip: 'horizontal'
      },
      r: {
        flip: false
      },
      s: {
        flip: false
      },
      t: {
        flip: 'horizontal'
      },
      u: {
        flip: 'horizontal'
      },
      ü: {
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
        flip: false
      }
    };
    this.availableCharsJoined = Object.keys(this.availableCharsDetails).join('');
  }

  _createClass(CharsService, [{
    key: 'bootstrap',
    value: function bootstrap() {
      var _this3 = this;

      return this.fetchAllChars().then(function (charsData) {
        console.log('all loaded');
        console.log('charsData', charsData);
        _this3.charsData = {};
        charsData.map(function (charData) {
          _this3.charsData[charData.char] = charData;
        });
      });
    }
  }, {
    key: 'fetchAllChars',
    value: function fetchAllChars() {
      var _this4 = this;

      var allRequests = [];

      // fetch all char files

      var _loop = function _loop(i) {
        var char = _this4.availableCharsJoined[i];
        var charDetails = _this4.availableCharsDetails[char];
        if (!charDetails || charDetails.noSvg) {
          return 'continue';
        }

        var request = void 0;
        // fetch svg file as text
        var charUrl = './assets/' + CONFIG.fontType + '/' + char.toUpperCase() + '.svg';
        request = fetch(charUrl).then(function (response) {
          return response.text();
        })
        // make manipulations to svgText and return charData object
        .then(function (svgText) {
          // make all ids unique otherwise defs and references interfere with each other
          svgText = svgText.replace('SVGID', 'SVGID' + char + i);
          return {
            svgText: svgText,
            char: char,
            charDetails: charDetails,
            charUrl: charUrl
          };
        });
        allRequests.push(request);
      };

      for (var i = 0; i < this.availableCharsJoined.length; i++) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
      }

      // make sure characters get processed in right order
      return Promise.all(allRequests);
    }
  }, {
    key: 'getCharJSX',
    value: function getCharJSX(char, duplicate, flip, invert) {
      var charData = this.charsData[char];
      // process svg as inline svg


      // flip? - hack: always flip and on flip don't flip
      // character svgs are improperly formatted
      // mirrored characters
      var svgHtml = void 0;
      if (charData.charDetails.flip) {
        svgHtml = '' + (invert ? charData.svgText : this.svgFlip(charData.svgText, charData.charDetails.flip));
        if (duplicate) {
          svgHtml += '' + (!flip ? this.svgFlip(charData.svgText, charData.charDetails.flip) : charData.svgText);
        }
      }
      // non mirrored characters
      else {
          svgHtml = '' + charData.svgText;
        }
      var className = 'character ' + charData.charDetails.flip + ' ' + (!duplicate ? 'no-duplicate' : '') + ' ' + charData.char;
      return React.createElement('div', { className: className, dangerouslySetInnerHTML: { __html: svgHtml } });
    }
  }, {
    key: 'getCharInlineSVG',
    value: function getCharInlineSVG(char, flip, invert) {
      var charData = this.charsData[char];
      if (!charData) {
        console.warn('CharsService.getCharInlineSVG() - character ' + char + ' not available');
        return;
      }

      // non-mirrored characters
      if (!charData.charDetails.flip) {
        return '' + charData.svgText;
      }
      // mirrored character
      else {
          return '' + (invert ? charData.svgText : this.svgFlip(charData.svgText, flip));
        }
    }
  }, {
    key: 'svgFlip',
    value: function svgFlip(svgText, flipDirection) {
      var x = flipDirection.includes('horizontal') ? -1 : 1;
      var y = flipDirection.includes('vertical') ? -1 : 1;
      var style = 'style="transform: scale(' + x + ', ' + y + ')"';
      return svgText.replace('svg', 'svg ' + style);
    }
  }]);

  return CharsService;
}();

var charsService = new CharsService();
charsService.bootstrap().then(function () {
  var systemEl = document.querySelector('#system');
  if (systemEl) {
    ReactDOM.render(React.createElement(System, null), systemEl);
  }
});

var canvasRenderer = new CanvasRenderer(charsService);

var System = function (_React$Component) {
  _inherits(System, _React$Component);

  function System() {
    _classCallCheck(this, System);

    return _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).apply(this, arguments));
  }

  _createClass(System, [{
    key: 'render',
    value: function render() {
      return React.createElement(InputArea, null);
    }
  }]);

  return System;
}(React.Component);

var InputArea = function (_React$Component2) {
  _inherits(InputArea, _React$Component2);

  function InputArea(props) {
    _classCallCheck(this, InputArea);

    var _this6 = _possibleConstructorReturn(this, (InputArea.__proto__ || Object.getPrototypeOf(InputArea)).call(this, props));

    _this6.state = {
      value: ''
    };

    _this6.handleKeyDown = _this6.handleKeyDown.bind(_this6);
    _this6.handleChange = _this6.handleChange.bind(_this6);
    _this6.handleBlur = _this6.handleBlur.bind(_this6);
    return _this6;
  }

  _createClass(InputArea, [{
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      // console.log(event.key, event.keyCode);
      // clear on backspace
      if (event.keyCode === 8) {
        // backspace
        // console.log('clear');
        // clear value
        this.setState({
          value: ''
        });
      }
      // do nothing on these chars
      if (charsService.availableCharsJoined.indexOf(event.key.toLowerCase()) === -1) {
        event.preventDefault();
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      var value = event.target.value;
      this.setState({
        value: value

      });

      // print character
      // change event doesn't fire on backspace with onKeyDown
      // const char = value[value.length - 1];
      // console.log(char);
    }
  }, {
    key: 'handleBlur',
    value: function handleBlur(event) {
      event.target.focus();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var canvasRef = void 0;

      var svgChars = void 0;
      if (!CONFIG.canvasHologram) {
        svgChars = this.state.value.split('').map(function (char) {
          return charsService.getCharJSX(char);
        });
      }

      if (CONFIG.canvasHologram) {
        if (!canvasRenderer.getCanvas()) {
          canvasRef = React.createRef();
          // TODO: super dirty HACK to make sure cavnasRef.current is set
          window.setTimeout(function () {
            console.log(canvasRef);
            canvasRenderer.setCanvas(canvasRef.current);

            if (canvasRef.current) {
              console.log('ref available');
              canvasRenderer.updateText(_this7.state.value);
            } else {
              window.location.reload();
            }
          }, 5);
        } else {
          canvasRenderer.updateText(this.state.value);
        }
      }

      return React.createElement(
        'div',
        { className: 'system' },
        React.createElement('input', { id: 'input-text', type: 'text', autoFocus: true,
          value: this.state.value,
          onKeyDown: this.handleKeyDown,
          onChange: this.handleChange,
          onBlur: this.handleBlur
        }),
        React.createElement(Slider, null),
        CONFIG.canvasHologram ? React.createElement('canvas', { id: 'canvas',
          ref: canvasRef }) : React.createElement(
          'div',
          { id: 'text-container' },
          svgChars
        )
      );
    }
  }]);

  return InputArea;
}(React.Component);

var Slider = function (_React$Component3) {
  _inherits(Slider, _React$Component3);

  function Slider(props) {
    _classCallCheck(this, Slider);

    var _this8 = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props));

    _this8.state = {
      repeat: 300
    };

    _this8.handleRangeChange = _this8.handleRangeChange.bind(_this8);
    return _this8;
  }

  _createClass(Slider, [{
    key: 'handleRangeChange',
    value: function handleRangeChange() {
      var repeat = event.target.value;
      this.setState({
        repeat: repeat
      });
      canvasRenderer.setRepeat(repeat);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'slide-container' },
        React.createElement('input', { type: 'range', min: '50', max: '700', value: this.state.repeat, className: 'slider', id: 'myRange',
          onChange: this.handleRangeChange })
      );
    }
  }]);

  return Slider;
}(React.Component);