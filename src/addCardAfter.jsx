import React, { Component } from 'react';
import styles from './addCardAfter.module.scss';

class AddCardAfter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      newList:"",
      newDescription:""
    }
  }

   handleAddList = async(listId) => {
    this.setState({expanded: !this.state.expanded})
    if(!this.props.cardsMain.some(el => el.body.toLowerCase().trim() === this.state.newList.toLowerCase().trim())){
    let data = {
      "body": this.state.newList,
    "description": this.state.newDescription,
    postId:listId
  }
    await fetch('http://localhost:3000/comments/'
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
            let val = this.props.cardsMain;
            val.push(data)
            this.handleCards(val);
            this.handleClose();
          });
  }

    else{alert(`Card with same title already exists`)}
}
handleCards= (data) => {
  this.props.handleCards(data);
}
  handleExpandClick = () => {
    let expanded = this.state.expanded;
    this.props.handleExpandClick(expanded);
  }
  handleClose = () => {
    this.setState({ expanded: !this.props.expanded })
    this.handleExpandClick();
  }
    handleEntertitle = evt => {
      this.setState({ newList: evt.target.value });
    };

    handleEnterDescription = evt => {
      this.setState({ newDescription: evt.target.value });
    };

  render() {
    const { expanded, newList,newDescription} = this.state;
    return (
      <div className= {styles.addCard}>
        <input className={styles["button"]} 
        type="text" name="list title" maxLength="512" 
        placeholder="Enter Card title"
        value={newList}
        onChange={this.handleEntertitle}
        ></input>
        <textarea className={styles["button"]} 
        type="text" name="list Description" maxLength="512" 
        placeholder="Enter Card Description"
        rows= {100} maxLength={100}
        value={newDescription}
        onChange={this.handleEnterDescription}
        ></textarea>
        <div className={styles["button"]}>
          <button
            // className ={styles["button"]}
            onClick={()=>this.handleAddList(this.props.ListId)}
          >  {this.props.buttonData}
          </button>
          <button
            // className ={styles["button"]}
            onClick={this.handleClose}
            onChange={this.handleExpandClick}
          >  &#10005;
            </button>
        </div>
      </div>

    )
  }
}
export default AddCardAfter