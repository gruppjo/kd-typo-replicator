'use strict';

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

const availableCharsJoined = Object.keys(availableChars).join('');

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
    if ( availableCharsJoined.indexOf(event.key.toLowerCase()) === -1 ) {
      event.preventDefault();

    }
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      value: value
    });

    // print character
    // change event doesn't fire on backspace with onKeyDown
    const char = value[value.length - 1];
    console.log(char);
  }

  render() {

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
        </div>
      </div>
    );
  }
}

const systemEl = document.querySelector('#system');
if (systemEl) {
  ReactDOM.render(
    <System/>,
    systemEl
  );
}