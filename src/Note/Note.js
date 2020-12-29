import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css';
import ApiContext from '../ApiContext';
import config from '../config';
import PropTypes from 'prop-types';//refactored for proptypes
export default class Note extends React.Component {

  static contextType = ApiContext;

  handleClickDelete = e => {
    e.preventDefault()
    const noteId = this.props.id

    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
      })
      .then(() => {
          this.context.deleteNote(noteId)
      })
      .catch(error => {
        console.error({ error })
      })
  }
  render(){
    const {name,id,modified}  = this.props
    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>
            {name}
          </Link>
        </h2>
        <button className='Note__delete' type='button'
          onClick={this.handleClickDelete}>
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>
    )
  }
  }
  Note.propTypes = {
    onDeleteNote: PropTypes.func,
    id:PropTypes.string,
    name:PropTypes.string,
    modified:PropTypes.string
  }
