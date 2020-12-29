import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

import { AuthProvider } from './context/auth'
import AuthRoute from './common/utils/AuthRoute'

import Home from '../src/pages/Home'
import Login from '../src/pages/Login'
import Register from '../src/pages/Register'
import SinglePost from '../src/pages/SinglePost'
import MenuBar from '../src/components/MenuBar'

function App() {
  return (
    // Use redux instead of context
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postID" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  )
}

export default App
