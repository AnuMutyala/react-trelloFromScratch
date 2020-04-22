import React, { Component } from 'react';
import styles from './app.module.scss';
import AddCardAfter from './addCardAfter';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [{}],
      expanded: false,
      editCard: "",
      styleCondition: false
    };
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
  }


  handleExpandClick = (val) => {
    // console.log("coming here all the timekjhweidc :: ", val)
    this.setState({ expanded: val })
  }

  handleStyleCondition = (val) => {
    // console.log("coming here all the timekjhweidc :: ", val)
    this.setState({ styleCondition: val })
  }


  async getCards(query) {
    await fetch(query)
      .then(response => response.json())
      .then((responseJson) => {
        if (query.indexOf("comments")) {
          this.setState({
            cards: responseJson
          })
        }
      })
      .catch((error) => {
        console.error(error);
      });


  }

  handleRemoveItem = async (id) => {
    await fetch('http://localhost:3000/comments/' + id, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
    }).then(function (response) {
      // if(response.status === 200){alert(`Registered successfully`)}
      // else{alert(`Please check there is some error`)}
    });
  }

  handleRemoveList = async (id) => {
    await fetch('http://localhost:3000/posts/' + id, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
    }).then(function (response) {
      console.log("response :: ", response)
      // if(response.status === 200){alert(`Registered successfully`)}
      // else{alert(`Please check there is some error`)}
    });
  }

  handleEditItem = async (id, data) => {
    await fetch('http://localhost:3000/comments/' + id, {
      method: 'PATCH',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }).then(function (response) {
      console.log("response :: ", response)
      // if(response.status === 200){alert(`Registered successfully`)}
      // else{alert(`Please check there is some error`)}
    });
  }
  handleDragStart = (e, name) => {
    e.dataTransfer.setData("id", name);
    e.dataTransfer.getData("id");
  }

  handleDragOver = (e) => {
    e.preventDefault()
  }
  handleOnDrop = (e, status) => {
    let id = e.dataTransfer.getData("id")
    console.log("listId after dragging:: ", status)
    let list = this.props.cardsMain.filter((task) => {
      console.log("task:: ", task)
      if (task.body === id) {
        task.postId = status
        console.log("task after:: ", task)
        this.handleEditItem(task.id, { postId: status })
      }
      return task
    });
    console.log("list:: ", list)
    // this.setState({ cards: list })

  }

  render() {
    let { expanded,styleCondition } = this.state
    return (
      <div id="board" draggable="true" className={styles.board}
        onDragOver={(e) => this.handleDragOver(e)}
        onDrop={(e) => this.handleOnDrop(e, this.props.list.id)}>
        <div id="list" draggable="true" className={styles.list}
        >
          <div id="listHead" className={styles.listHead}>{this.props.list.title}
            <button className={styles.delete} onClick={() => this.handleRemoveList(this.props.list.id)}>
              <img src="del.png" alt="Delete perfomers" height="10px" ></img>
            </button>
          </div>
        </div>
        <div id="listItems" key={this.props.list.id} className={styles.listItems}>
          {Object.keys(this.props.cards).map(b => (
            <div
              onDragStart={(e) => { this.handleDragStart(e, this.props.cards[b].body) }}
              draggable="true" key={b}>
              <div id="item" className={styles.item}>
                <div id="item-name" className={styles.itemName}>
                  {this.props.cards[b].body}
                </div>

{/* <div id="item-container" className={styles.itemContainer} >
<p >
                abcjdbaijdbladsf;aodnfaldknbf;oadfabcjdbaijdbladsf;aodnfaldknbf;oadfabcjdbaijdbladsf;aodnfaldknbf;oadfabcjdbaijdbladsf;aodnfaldknbf;oadf
                </p>
  </div> */}
                
                <p id="item-container" 
                className={styleCondition ? styles.itemContainerEnlarge : styles.itemContainer} 
                // onClick={this.setState({styleCondition: true})}
                onClick={() => this.handleStyleCondition(!styleCondition)}
                // className={styles.itemContainer} 
                >
                  {this.props.cards[b].description}
                </p>

                <div id="item-performers" className={styles.itemPerformers}>
                  <button id="delete" className={styles.delete} onClick={() => this.handleRemoveItem(this.props.cards[b].id)}>
                    <img src="del.png" alt="Delete perfomers" height="10px" ></img>
                  </button>

                  <button id="edit" className={styles.delete} >
                    <img src="edit.png" alt="Edit perfomers" height="10px" onClick={() => this.handleEditItem(this.props.cards[b].id, { "body": "edited" })}></img>
                  </button>
                </div>


              </div>
            </div>
          ))}


          <div id="addCardDiv" className={styles.addButton}>
            {
              !(expanded) ?
                <button id="addcard" className={styles.addButton}
                  onClick={() => this.handleExpandClick(!expanded)}
                > &#43; Add Card
            </button>
                : <AddCardAfter buttonData="Add Card"
                  handleExpandClick={this.handleExpandClick}
                  ListId={this.props.list.id}
                  cardsMain={this.props.cardsMain}
                  expanded={expanded} />
            }
          </div>
        </div>
      </div>

    );
  }
}


export default List;

