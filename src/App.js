// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { Component } from 'react'; 
// import { useCallback } from "react";
// import Particles from "react-tsparticles";
// import { loadFull } from "react-tsparticles";
// import Particles from 'react-particles-js';

// import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


// const app = new Clarifai.App({
//  apiKey: '73ea6716270e4aac9610ec885082a40f'
// }); 






     
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined:  ''
  }
}

class App extends Component {
      constructor() {
        super();
        this.state = initialState;
      }

      loadUser = (data) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined:  data.joined
        }})
      }
    

      // componentDidMount() {
      //   fetch('http://localhost:3000/')
      //   .then(response => response.json())
      //   .then(console.log)
      // }

      calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        console.log(width, height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)

        }

      }


      displayFaceBox = (box) => {
        console.log(box);
        this.setState({box:box})
      }


      onInputChange = (event) => {
        this.setState({input: event.target.value});
      }


    //   onButtonSubmit = () => {
    //     this.setState({imageUrl: this.state.input});
    //     fetch("https://smart-brain-backend-czd2.onrender.com/imageurl", {
    //       method: 'post',
    //       headers: {'Content-Type': 'application/json'},
    //       body: JSON.stringify({
    //         input: this.state.input
    //       })
    //   })
    //     .then(response => response.json())
    //     // .then(result => console.log(result))
    //     .then(res => {
    //       if (res) {
    //         fetch('https://smart-brain-backend-czd2.onrender.com/image', {
    //             method: 'put',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify({
    //               id: this.state.user.id
    //             })
    //         })
    //         .then(ress => ress.json())
    //         .then(count => {
    //           this.setState(Object.assign(this.state.user, {entries: count}))
    //         })
    //         .catch(console.log)
    //       }
        
    //       this.displayFaceBox(this.calculateFaceLocation(res))
    //     }
    //     ).catch(error => console.log(error, "can not get data"));

             
    // }


    onButtonSubmit = () => {
      this.setState({ imageUrl: this.state.input });
    
      fetch("https://smart-brain-backend-czd2.onrender.com/imageurl", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: this.state.input
        })
      })
        .then(response => response.json())
        .then(res => {
          if (res) {
            fetch('https://smart-brain-backend-czd2.onrender.com/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(ress => ress.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count }));
                this.displayFaceBox(this.calculateFaceLocation(res));
              })
              .catch(console.log);
          } else {
            console.log('Error: Unable to fetch data.');
          }
        })
        .catch(error => console.log(error, "Error: Unable to get data."));
    }

    



      onRouteChange = (route) => {
        if (route === 'signout') {
          this.setState(initialState)
        } else if (route === 'home') {
          this.setState({isSignedIn: true})
        }
        this.setState({route: route});
      }    


      render() {
        return (
        
        <div className="App">
         
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
          { this.state.route === 'home'
           ? <div>
               <Logo />
               <Rank name={this.state.user.name} entries={this.state.user.entries} />    
               <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
               />       
               <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
             </div>
           : (this.state.route === 'signin' 
               ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
               : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
                 )
            
            }
        </div>
      );
     }
    }

export default App;



//image link:   https://cdn.pixabay.com/photo/2021/03/03/10/25/portrait-6064979_1280.jpg
