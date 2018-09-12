import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 1,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Andrew Clark, Dan Abramov',
    num_comments: 2,
    points: 5,
    objectID: 2,
  },
];

class User {
  constructor (first, last) {
    this.first = first;
    this.last = last;
  }
  getName () {
    return this.first + " " + this.last;
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      list: null,
      result: null,
      searchTerm: DEFAULT_QUERY,
    }
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
  }

  componentDidMount() {
      const {searchTerm} = this.state;
      const url = 'https://hn.algolia.com/api/v1/search?query=redux';
      console.log('URL to fetch from ' + `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`);
      //
      fetch(url).
          then(response => {
            const respJSON = response.json();
            console.log(respJSON);
            return respJSON;
          }).
          then(result => this.setSearchTopStories(result)).
          catch (error => error);
  }

  setSearchTopStories(result) {
      this.setState({result});
      this.setState({list: result.hits});
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onDismiss(id) {
    const updatedList = this.state.result.hits.filter(item => {
      return item.objectID != id;
    });
    this.setState(
      {list: updatedList
      }
    );
  }

  render() {
    const {list, result, searchTerm} = this.state;
    if (!list) return null;

    function find(searchTerm) {
      return function(item) {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());;
      }
    }

    const greet = 'Welcome to React, Mr. ';
    const user = new User('Kapil', 'Sharma');
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search book by title:
          </Search>
        </div>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

const Search = ({value, onChange, children}) =>
      <form>
        {children} <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>

const Table = ({list, pattern, onDismiss}) =>
{
      function isSearched(pattern) {
        return function(item) {
          return item.title.toLowerCase().includes(pattern.toLowerCase());
        }
      }
      return <div className="table">
        {
          list.filter(isSearched(pattern)).map(
            item =>
            <div key={item.objectID} className="table-row">
              <span style={{width: '40%'}}>
                 <a href={item.url}> {item.title} </a>
              </span>
              <span style={{width: '30%'}}>
                  {item.author}
              </span>
              <span style={{width: '10%'}}>
                  {item.num_comments}
              </span>
              <span style={{width: '10%'}}>
                  {item.points}
              </span>
              <span style={{width: '10%'}}>
                <Button
                  onClick={() => onDismiss(item.objectID)}
                  className="button-inline"
                >
                  Dismiss the book
                </Button>
              </span>
            </div>
          )
        }
      </div>
}

const Button = ({onClick, className, children}) =>
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>

export default App;
