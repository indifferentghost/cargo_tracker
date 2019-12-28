import React, { Component } from "react";

import Firebase from "firebase";
import firebaseConfig from "./components/config";

class App extends Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(firebaseConfig);

    this.state = {
      developers: []
    };
  }

  // CRUD start
  writeUserData = () => {
    Firebase.database()
      .ref("/")
      .set(this.state);
  };

  getUserData = () => {
    let ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
    console.log("DATA RETRIEVED");
  };

  updateData = developer => {
    this.refs.uid.value = developer.uid;
    this.refs.name.value = developer.name;
    this.refs.role.value = developer.role;
  };

  removeData = developer => {
    const { developers } = this.state;
    const newState = developers.filter(data => {
      return data.uid !== developer.uid;
    });
    this.setState({ developers: newState });
  };
  // CRUD end

  handleSubmit = event => {
    event.preventDefault();
    let name = this.refs.name.value;
    let role = this.refs.role.value;
    let uid = this.refs.uid.value;

    if (uid && name && role) {
      const { developers } = this.state;
      const devIndex = developers.findIndex(data => {
        return data.uid === uid;
      });
      developers[devIndex].name = name;
      developers[devIndex].role = role;
      this.setState({ developers });
    } else if (name && role) {
      const uid = new Date().getTime().toString();
      const { developers } = this.state;
      developers.push({ uid, name, role });
      this.setState({ developers });
    }

    this.refs.name.value = "";
    this.refs.role.value = "";
    this.refs.uid.value = "";
  };

  componentDidMount() {
    // app launched
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState) {
    // check previous state and only write if its different from new state
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }

  render() {
    const { developers } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <h1>Firebase Development Team</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            {developers.map(developer => (
              <div
                key={developer.uid}
                className="card float-left"
                style={{ width: "18rem", marginRight: "1rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">{developer.name}</h5>
                  <p className="card-text">{developer.role}</p>
                  <button
                    onClick={() => this.removeData(developer)}
                    className="btn btn-link"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => this.updateData(developer)}
                    className="btn btn-link"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <h1>Add new team member here</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-row">
                <input type="hidden" ref="uid" />
                <div className="form-group col-md-6">
                  <label>Name</label>
                  <input
                    type="text"
                    ref="name"
                    className="form-control"
                    placeholder="Name"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Role</label>
                  <input
                    type="text"
                    ref="role"
                    className="form-control"
                    placeholder="Role"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
