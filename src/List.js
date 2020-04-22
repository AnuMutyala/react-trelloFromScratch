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
      styleCondition: false,
      activeIndex:null,
      newList:"",
      newDescription:"",
      editModeState: false
    };
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
  }


  handleExpandClick = (val) => {
    this.setState({ expanded: val })
  }

  handleStyleCondition = (styleCon,index) => {
    this.setState({ styleCondition: styleCon, activeIndex: index })
  }

  handleEntertitle = evt => {
    this.setState({ newList: evt.currentTarget.textContent, editModeState: true });
  };

  handleEnterDescription = evt => {
    this.setState({ newDescription: evt.currentTarget.textContent, editModeState: true });
  };

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
    await fetch('https://my-json-server.typicode.com/AnuMutyala/fakeData1/comments/' + id, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
    })
    
    .then(r => r.json()).then(data => {
      let val = this.props.cardsMain || [];
      const result = val.filter(list => list.id != id);
      this.handleCards(result);
    });
  }

  handleCards= (data) => {
    
    this.props.handleCards(data);
  }
  handleLists= (data) => {
    this.props.handleLists(data);
  }

  handleRemoveList = async (id) => {
    await fetch('https://my-json-server.typicode.com/AnuMutyala/fakeData1/posts/' + id, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
    })
    .then(r => r.json()).then(data => {
      let val = this.props.lists || [];
      const result = val.filter(list => list.id != id);
      this.handleLists(result);
      this.handleCards(this.props.cardsMain);
    });
  }

  handleEditItem = async (id, data) => {
    await fetch('https://my-json-server.typicode.com/AnuMutyala/fakeData1/comments/' + id, {
      method: 'PATCH',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    })
    .then(r => r.json()).then(data => {
      let val = this.props.cardsMain;
      this.handleCards(val);
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
    let list = this.props.cardsMain.filter((task) => {    
      if (task.id == id) {
        task.postId = status
        this.handleEditItem(task.id, { postId: status })
      }
      return task
    });
  }

  handleEditCard = (id, data) => {
    if(data.body.trim().length>0){
      let list = this.props.cardsMain.filter((task) => {
        if (task.id == id) {
          task.body = data.body;
          // task.description = data.description;
          this.handleEditItem(task.id, { body: data.body })
        }
        return task
      });
    }
    this.setState({newList:"",
    newDescription:"", editModeState: false})
    
  }


  // handleEditCard = (id, data) => {

  //   let list = this.props.cardsMain.filter((task) => {
  //     if (task.id == id) {
  //       task.body = data.body;
  //       task.description = data.description;
  //       this.handleEditItem(task.id, { body: data.body,description: data.description })
  //     }
  //     return task
  //   });
  //   // this.setState({ cards: list })

  // }

  handleLists= (data) => {
    this.props.handleLists(data);
  }
  
  render() {
    let { expanded,styleCondition, newList, newDescription,editModeState } = this.state;
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
              onDragStart={(e) => { this.handleDragStart(e, this.props.cards[b].id) }}
              draggable="true" key={b}>
              <div id="item" className={styles.item}>
                <div id="item-name" 
                className={styles.itemName} 
                onInput={this.handleEntertitle}
                contentEditable= {true}
                suppressContentEditableWarning={true}
                >
                  {this.props.cards[b].body}
                </div>
                
                <div id="item-container"  
                className={((this.props.cards[b].id === this.state.activeIndex) && styleCondition) ? styles.itemContainerEnlarge : styles.itemContainer} 
                // style={ index === this.state.activeIndex ? { backgroundColor: this.state.bgColor } : null}
                onClick={() => this.handleStyleCondition(!styleCondition,this.props.cards[b].id )}
                >
                  {this.props.cards[b].description}
                </div>

                <div id="item-performers" className={styles.itemPerformers}>
                  <button id="delete" className={styles.delete} onClick={() => this.handleRemoveItem(this.props.cards[b].id)}>
                    <img src="del.png" alt="Delete perfomers" height="10px" ></img>
                  </button>

                  <button type ="button" id="edit" className={styles.delete} disabled= {true}>
                    <img src="edit.png" alt="Edit perfomers" height="10px" onClick={() => this.handleEditCard(this.props.cards[b].id, {  body: newList })}></img>
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
                  expanded={expanded} 
            handleCards = {this.handleCards}
            handleLists = {this.handleLists}/>
            }
          </div>
        </div>
      </div>

    );
  }
}


export default List;

