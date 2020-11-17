import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import * as routes from 'constants/routes';
import * as themes from 'constants/themes';
import Navigation from 'components/Navigation';
import Footer from 'components/Footer';
import { CMS_BASE_URL } from 'constants/baseURL';

import Home from 'pages/home';
import Selection from 'pages/selection';

class App extends Component {
  state = {
    title: 'Plan Your Vote',
    themeName: null,
    images: [
      {
        id: '',
        placement: 'Logo',
        type: '',
        value: '',
        description: '',
        format: ''
      },
      {
        id: '',
        placement: 'Footer Logo',
        type: '',
        value: '',
        description: '',
        format: ''
      }
    ],
    themeHref: ''
  };


  componentDidMount() {
    this.loadApiData().then(() => {
      this.setTheme();
    });
    console.log(this.state.images[0].placement)
    console.log(this.state.images[1].placement)
  }

  loadApiData = async () => {
    await fetch(`${CMS_BASE_URL}/api/theme`)
      .then(res => res.json())
      .then(result => {
        this.setState({
          themeName: result.SelectedTheme.ThemeName,
          images: result.Images
        });
      });
  };

  setTheme = () => {
    switch (this.state.themeName) {
      case 'Maple':
        this.setState({ themeHref: `${themes.BASE}${themes.MAPLE}` });
        break;
      case 'Snowdrop':
        this.setState({ themeHref: `${themes.BASE}${themes.SNOWDROP}` });
        break;
      default:
        this.setState({ themeHref: `${themes.BASE}${themes.DEFAULT}` });
        break;
    }
    console.log("images", this.state.images);
  };

  render() {
    return (
      <>
        <Helmet>
          <title>{this.state.title}</title>
          <link rel='stylesheet' href={this.state.themeHref} id='theme' />
        </Helmet>
        <Router>
          <Navigation
            logo={this.state.images.find(image => {
              return image.placement === 'Logo';
            })}
          />
          <Switch>
            <Route exact path={routes.HOME} component={() => <Home />} />
            <Route path={routes.SELECTION} component={() => <Selection />} />
            <Route render={() => <h1>Page not found</h1>} />
          </Switch>
          <Footer
            logo={this.state.images.find(image => {
              return image.placement === 'Footer Logo';
            })}
          />
        </Router>
      </>
    );
  }
}

export default App;
