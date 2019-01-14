'use strict';

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
      text: 'yo'
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      text: event.target.value
    });
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
          value={this.state.text}
          onChange={this.handleChange}
        />
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