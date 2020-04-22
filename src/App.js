import React, { Component } from 'react';
import styles from './app.module.scss';
import List from './List';
import AddListAfter from './addListAfter';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [{}],
      cards: [{}],
      cardsMain: [{}],
      profile: "",
      searchQuery: "",
      expandList: false

    };
  }

  handleSearchQuery = evt => {
    this.setState({ searchQuery: evt.target.value });
  };

  handleSearchQuery = evt => {
    console.log("entered into search :: ", evt.target.value)
    this.setState({ searchQuery: evt.target.value });
  };
  handleExpandList = (val) => {
    console.log("coming here all the timekjhweidc :: ", val)
    this.setState({ expandList: val })
  }

  handleCards = (val)=>{
    console.log("entered into handle cards")
    this.setState({cards : val, cardsMain: val})
  }
  handleLists = (val)=>{
    console.log("entered into handle lists");
    console.log("val:: ", val)
    this.setState({lists : val})
  }
  async componentWillMount() {
    await this.getLists('http://localhost:3000/posts/');
    await this.getCards('http://localhost:3000/comments/');
    await this.getProfile('http://localhost:3000/profile/')
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery && this.state.searchQuery.trim().length > 0) {
      let responseJson = prevState.cardsMain.filter(x => x.body.includes(this.state.searchQuery));
      this.setState({ cards: responseJson })
    }
    else if (prevState.searchQuery !== this.state.searchQuery && this.state.searchQuery.trim().length == 0) {
      await this.getCards('http://localhost:3000/comments/');
      // this.setState({ cards: prevState.cardsMain})
    }
  }

  async getProfile(query) {
    await fetch(query)
      .then(response => response.json())
      .then((responseJson) => {
        if (query.indexOf("posts")) {
          this.setState({
            profile: responseJson.name,
          })
        }
        // if(query.indexOf("comments")){
        //   console.log("entered in to comments")
        //   this.setState({ cards: responseJson
        //   })
        // }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getLists(query) {
    await fetch(query)
      .then(response => response.json())
      .then((responseJson) => {
        if (query.indexOf("posts")) {
          console.log("entered in to posts")
          this.setState({
            lists: responseJson,
          })
        }
        // if(query.indexOf("comments")){
        //   console.log("entered in to comments")
        //   this.setState({ cards: responseJson
        //   })
        // }

      })
      .catch((error) => {
        console.error(error);
      });
  }


  async getCards(query) {
    await fetch(query)
      .then(response => response.json())
      .then((responseJson) => {
        if (query.indexOf("comments")) {
          this.setState({
            cards: responseJson, cardsMain: responseJson
          })
        }

      })
      .catch((error) => {
        console.error(error);
      });


  }


  render() {
    const { lists,
      cards,
      expandList,
      profile,
      searchQuery, cardsMain
    } = this.state;
    return (
      <div>
        <div className={styles.search}>
          <input className={styles["button"]}
            type="search" name="list title" maxLength="512"
            placeholder="Search for Cards"
            value={searchQuery}
            // onChange={(e) => this.setState({searchQuery: e.target.value})}
            onChange={this.handleSearchQuery}
          ></input>
        </div>

        <div id="app" className={styles.App}>
          {Object.keys(lists).map(b => (

            <List cardsMain={cardsMain} 
            list={lists[b]} cards={cards.filter(x => x.postId === lists[b].id).map(x => x)} 
            id={lists[b].id} 
            lists = {lists}
            handleCards = {this.handleCards}
            handleLists = {this.handleLists}
            />
          ))}

          <div id="board" className={styles.board}>
            {
              !(expandList) ?
                <button className={styles.button}
                  onClick={() => this.handleExpandList(!expandList)}
                > &#43; Add a list
            </button>
                : <AddListAfter buttonData="Add List"
                  handleExpandList={this.handleExpandList}
                  expandList={expandList} lists={lists} 
                  handleLists = {this.handleLists}
                  />
            }
          </div>
        </div>

      </div>
    );
  }
}


export default App;


