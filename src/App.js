import React from 'react';
import {Layout} from 'antd';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import './App.css';
import Game from "./components/Game";
import NameModal from "./components/NameModal";
import { HeartTwoTone, } from '@ant-design/icons';
import CopyToClipboard from "./components/CopyToClipboard";


const { Footer } = Layout;

function App() {
  return (
      <React.Fragment>


          <Layout className="layout header-page">
              <CopyToClipboard/>
          <Footer style={{ textAlign: 'center' }}>
              created by <HeartTwoTone  className="pulse" twoToneColor="#eb2f96" /> <a target="_blank" rel="noopener noreferrer" href="https://github.com/georgeshokry">George Shokry</a>
          </Footer>
          </Layout>
          <br/>
        <Router>
            <Switch>
             <Route path="/" exact>
                <NameModal/>
             </Route>
             <Route path="/play/:uid" exact>

                <Game/>

             </Route>
             <Redirect to="/"/>
            </Switch>
        </Router>
      </React.Fragment>
);
}

export default App;
