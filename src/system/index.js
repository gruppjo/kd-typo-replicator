'use strict';

class System extends React.Component {

  render() {
    return (
      <div>
        <InputArea />
      </div>
    );
  }
}

class InputArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this!';
    }

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
        <input id="input-text" type="text" autoFocus />
      </div>
    );
  }
}

ReactDOM.render(
  <System/>,
  document.querySelector('#system')
);