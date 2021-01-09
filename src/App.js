import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Palette from './Palette';
import PaletteList from './PaletteList';
import SingleColorPalette from './SingleColorPalette'
import Page from './Page';
import NewPaletteFrom from './NewPaletteFrom';
import seedColors from './seedColors';
import { generatePalette } from './colorHelpers';

class App extends Component {
  constructor(props) {
    super(props);
    const savedPalettes = JSON.parse(window.localStorage.getItem('palettes'));
    this.state = { palettes: savedPalettes || seedColors}
  }

  findPalette = (id) => {
    return this.state.palettes.find(c => c.id===id);
  }

  deletePalette= (id) => {
    this.setState(
      st => ({palettes: st.palettes.filter(palette => palette.id !== id)}),
      this.syncLocalStorage
    );
  }

  savePalette = (newPalette) => {
      this.setState({ palettes: [...this.state.palettes, newPalette]},
        this.syncLocalStorage
        );
  }

  syncLocalStorage(){
    window.localStorage.setItem('palettes', JSON.stringify(this.state.palettes));
  }

  render() {
    return(
      <Route render={({ location }) =>(
        <TransitionGroup>
          <CSSTransition 
          classNames='page'
          timeout={500}
            key={location.key }
          >
            <Switch location={location}>
              <Route
                exact
                path='/palette/new'
                render={(routeProps) =>(
                <Page>
                  <NewPaletteFrom 
                    savePalette={this.savePalette} 
                    {...routeProps} 
                    palettes={this.state.palettes} 
                    />
                </Page>
                )}
              />
              <Route
                exact
                path="/palette/:paletteId/:colorId"
                render={(routeProps) =>(
                  <Page>
                  <SingleColorPalette
                    colorId={routeProps.match.params.colorId}
                    palette={generatePalette(
                      this.findPalette(routeProps.match.params.paletteId)
                    )} />
                  </Page>
                )}
              />

              <Route
                exact
                path='/'
                render={(routeProps) => (
                  <Page>
                  <PaletteList 
                    palettes={this.state.palettes} 
                    deletePalette={this.deletePalette} 
                    {...routeProps} 
                    />
                  </Page>
                )}
              />
              <Route
                exact
                path='/'
                render={() =>(
                  <Page>
                  <h1>Palette list goes here</h1>
                  </Page>
                )}
              />
              <Route
                exact
                path='/palette/:id'
                render={(routeProps) =>(
                  <Page>
                  <Palette palette={generatePalette(
                    this.findPalette(routeProps.match.params.id)
                  )} />
                  </Page>
                )} />
              <Route 
                render={(routeProps) => (
                  <Page>
                    <PaletteList
                      palettes={this.state.palettes}
                      deletePalette={this.deletePalette}
                      {...routeProps}
                    />
                  </Page>
                )}/>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      ) }/>
      
    );
  }
}
export default App;
