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


const setupClarifai = (imageUrl) => {
      const PAT = '3019e98844444670871e5fde9dd3f399';
        // Specify the correct user_id/app_id pairings
        // Since you're making inferences outside your app's scope
      const USER_ID = 'raj';       
      const APP_ID = 'face-detection';
        // Change these to whatever model and image URL you want to use
        // const MODEL_ID = 'face-detection';
        // const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';  
        // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';  
      const IMAGE_URL = imageUrl;

      const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
 
      const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
}; 

      return requestOptions


}



     


class App extends Component {
      constructor() {
        super();
        this.state = {
          input: '',
          imageUrl: '',
          box: {},
          route: 'signin',
          isSignedIn: false
        }
      }

      calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        // console.log(width, height);
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


      onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, setupClarifai(this.state.input))
        
        
        .then(response => response.json())
        //.then(result => console.log(result))
        .then(res => this.displayFaceBox(this.calculateFaceLocation(res)))
        
        .catch(error => console.log('error', error));

             
    }

      onRouteChange = (route) => {
        if (route === 'signout') {
          this.setState({isSignedIn: false})
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
               <Rank />    
               <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
               />       
               <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
             </div>
           : (this.state.route === 'signin' 
               ? <SignIn onRouteChange={this.onRouteChange} />
               : <Register onRouteChange={this.onRouteChange} />
                 )
            
            }
        </div>
      );
     }
    }

export default App;
    
