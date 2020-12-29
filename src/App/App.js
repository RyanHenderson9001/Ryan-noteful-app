import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import ApiContext from '../ApiContext';
import Error from '../Error';
import config from '../config';
import './App.css';
class App extends Component {
    state = {
        notes: [],
        folders: [],
        newFolder: {
          hasError: false,
          touched: false,
          name: '',
        },
        newNote: {
          name: {
            touched: false,
            value: '',
          },
          folder_id: {
            touched: false,
            value: '',
          },
          content: {
            touched: false,
            value: '',
          },
        },
      };

    componentDidMount() {
      setTimeout(() => this.setState(dummyStore), 600);
        Promise.all([
          fetch(`${config.API_ENDPOINT}/notes`),
          fetch(`${config.API_ENDPOINT}/folders`),
        ])
        .then(([notesRes,folderRes])=>{
          if(!notesRes.ok) return notesRes.json().then(event => Promise.reject(event))
          if(!folderRes.ok) return folderRes.json().then(event => Promise.reject(event))

          return Promise.all([notesRes.json(),folderRes.json()])
        })
        .then(([notes,folders])=> {
          this.setState({notes,folders})
        })
        .catch(error => {
          console.error({error})
        })
    }
    updateNewFolderName = name => {
        this.setState({
          newFolder: {
            hasError: false,
            touched: true,
            name: name,
          },
        })
      }
    
      updateNewNoteData = (input, value) => {
        this.setState({
          newNote: {
              ...this.state.newNote,
            [input]: {
              touched: true,
              value: value,
            },
          },
        })
      }
    
      handleAddFolder = newFolder => {
        this.setState({
          folders: [...this.state.folders, newFolder],
        })
      }
    
      handleAddNote = note => {
        this.setState({
          notes: [...this.state.notes, note],
        })
      }
    
      handleDeleteNote = noteId => {
        this.setState({
          notes: this.state.notes.filter(note => note.id !== noteId),
        })
    
      }

    renderNavRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <NoteListNav
                                folders={folders}
                                notes={notes}
                                {...routeProps}
                            />
                        )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folderId);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        const {notes} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            const {folderId} = routeProps.match.params;
                            const notesForFolder = getNotesForFolder(
                                notes,
                                folderId
                            );
                            return (
                                <NoteListMain
                                    {...routeProps}
                                    notes={notesForFolder}
                                />
                            );
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId);
                        return <NotePageMain {...routeProps} note={note} />;
                    }}
                />
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote} />
            </>
        );
    }

    render() {
        const value = {
          notes: this.state.notes,
          folders: this.state.folders,
          deleteNote: this.handleDeleteNote,
          addFolder: this.handleAddFolder,
          newFolder: this.state.newFolder,
          updateNewFolderName: this.updateNewFolderName,
          newNote: this.state.newNote,
          handleAddNote: this.handleAddNote,
          updateNewNoteData: this.updateNewNoteData
        }
        return (
          <ApiContext.Provider value={value}>
            <div className="App">
              <Error>
              <nav className="App__nav">{this.renderNavRoutes()}</nav>
              <header className="App__header">
                <h1>
                  <Link to="/">Noteful</Link>{' '}
                  <FontAwesomeIcon icon="check-double" />
                </h1>
              </header>
              <main className="App__main">{this.renderMainRoutes()}</main>
              </Error> 
            </div>
          </ApiContext.Provider>
        )
      }
    }

export default App;
