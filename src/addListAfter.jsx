import React, { Component } from 'react';
// import './App.css';
import styles from './addListAfter.module.scss';

class AddListAfter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandList: false,
      newList: ""
    }
  }


  handleAddList = async () => {
    if (!this.props.lists.some(el => el.title.toLowerCase().trim() === this.state.newList.toLowerCase().trim())) {
      this.setState({ expandList: !this.state.expandList })
      let data = {
        "title": this.state.newList
      }
      await fetch('http://localhost:3000/posts/'
        , {
          method: 'post',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(data)
        })
        .then(r => r.json()).then(data => {
          let val = this.props.lists;
          val.push(data)
          this.handleLists(val);
          this.handleClose();
        });
    }
    else { alert(`List with same title already exists`) }
  }

  handleExpandList = () => {
    let expandList = this.state.expandList;
    this.props.handleExpandList(expandList);
  }

  handleLists = (data) => {
    this.props.handleLists(data);
  }

  handleClose = () => {
    this.setState({ expandList: !this.props.expandList })
    this.handleExpandList();
  }
  handleEntertitle = evt => {
    this.setState({ newList: evt.target.value });
  };

  render() {
    const { expandList, newList } = this.state;
    return (
      <div>
        <input className={styles["button"]}
          type="text" name="list title" maxLength="512"
          placeholder="Enter list title"
          value={newList}
          onChange={this.handleEntertitle}
        ></input>
        <div className={styles["button"]}>
          <button
            // className ={styles["button"]}
            onClick={this.handleAddList}
          >  {this.props.buttonData}
          </button>
          <button
            // className ={styles["button"]}
            onClick={this.handleClose}
            onChange={this.handleExpandList}
          >  &#10005;
            </button>
        </div>
      </div>

    )
  }
}
export default AddListAfter