import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef } from "react";

function App() {
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [emojis, setEmojis] = useState([])
  const [userPics, setUserPics] = useState([])
  const [reactions, setReactions] = useState([])
  const apiUrl = 'https://graph.facebook.com/'
  const token = 'access_token=EAALEUBAJuFgBAGRUH80dYDNB1stt76WfN723UcKZB9O0uat3npvP05ZA8kkXEhBBtpPAnEMZCUiMqTzeZA761tFBJWbK1yudU1dKEXZCv5u6GSfQELwcf4R10gZBWPLhIxPKwMPhmzUlSfTK2T1NRTwuZAjYyGt0PdAxYw7ilYwkQqswumLnxZCT9TeUjQuGmOxtO5AE2eiXZAQZDZD'

  // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
      fetch(apiUrl + '241540867013420/comments?' + token)
        .then(res => res.json())
        .then(
          (result) => {
            setItems(result.data);
            console.log(result)
          },

          (error) => {
            setError(error);
            console.log(error)
          }
        )
    }, [])

    const  showAllPics = async () => {
    let urls = []
    items.forEach( item => {
      urls.push(item.from.id)
    })
    let getPics = urls.map(params => {
      return new Promise((resolve, reject) =>{
     
        fetch(apiUrl + params + '?' + 'fields=id,picture' + '&' + token)
        .then(res => res.json())
        .then(
          (result) => {
            resolve(result)
          },
          (error) => {
  
          }
        )
      })
    })
    Promise.all(getPics).then(data => {
      setUserPics(data)
      console.log(data)
    })

    };

    const showEmoji = ()=> {
      let list = []
      items.forEach((e)=>{
        let matches  = e.message.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,
        '').match(/\W+$/)
        if (matches) {
          list.push({
            id:e.id,
            emoji:matches[0]
          })
      }
    })
    console.log(list)
    setEmojis(list)
    }

    const  showReactions = async () => {
      let comments = []
      items.forEach( item => {
        comments.push(item.id)
      })
      let getReactions = comments.map(params => {
        return new Promise((resolve, reject) =>{
          fetch(apiUrl + params + '/' + 'reactions' + '?' + token)
          .then(res => res.json())
          .then(
            (result) => {
              resolve({
                commentId: params,
                reaction: result.data
              })
            },
            (error) => {
    
            }
          )
        })
      })
      Promise.all(getReactions).then(data => {
        setReactions(data)
        console.log(data)
      })
  
      };
    return (
      <div>
        <h2>1, Display of post comments.</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.from.name} : {item.message}
          </li>
        ))}
      </ul>

      <h2 onClick={showAllPics}>2, Display the user's profile picture for each comment.</h2>
      <button onClick={showAllPics}>Retrive Profile</button>
      <ul>
        {userPics.map(item => (
          <li key={Math.random()}>
            {'User ID '+item.id }:
            <img src={item.picture.data.url} alt="" width="50" height="50"/>
          </li>
        ))}
      </ul>

      <h2>3, Display of reply threads for comments.</h2>
      <h3>------------------TO Do----------------------</h3>

      <h2>4. Display of pictures within posts (gifs,images,emojis).</h2>
      <button onClick={showEmoji}>Show Emoji</button>
      <ul>
        {emojis.map(emoji => (
          <li key={Math.random()}>
          User ID {emoji.id} : {emoji.emoji}
          </li>
        ))}
      </ul>


      <h2>5, Display of post reactions.</h2>
      <button onClick={showReactions}>Show Reactions for each comment</button>
      <ul>
        {reactions.map(item => (
          <li key={Math.random()}>
            {item.commentId}: {item.reaction.map(r => <div key={Math.random()} >Reaction: {r.id}---{r.name}---{r.type}</div>)}
            
          </li>
        ))}
      </ul>

      



      </div>
    );


  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
