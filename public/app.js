class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      description: '',
      todos: []
    }
  }

  componentDidMount() {
    fetch('/todos')
      .then(response => response.json())
      .then(todos => {
        this.setState({
          todos: todos
        });
      });
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit = () => {
    event.preventDefault();
    fetch('/todos', {
      body: JSON.stringify({ description: this.state.description }),
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(createdToDo => {
      return createdToDo.json();
    }).then(jsonedToDo => {
      this.setState({
        description: '',
        todos: [jsonedToDo, ...this.state.todos]
      })
    }).catch(error => {
      console.log(error);
    });
  }

  deleteToDo = (id, index) => {
    fetch('todos/' + id,
      {
        method: 'DELETE'
      })
      .then(data => {
        this.setState({
          todos: [
            ...this.state.todos.slice(0, index),
            ...this.state.todos.slice(index + 1)
          ]
        })
      });
  }

  updateToDo = (todo, index) => {
    todo.complete = !todo.complete;
    fetch('todos/' + todo._id, {
      body: JSON.stringify(todo),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        fetch('/todos')
          .then(response => response.json())
          .then(todos => {
            this.setState({ todos: todos })
          });
      })
  }

  render() {
    return (
      <div>
        <h1> To Dos </h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='description'>description</label>
          <input type='text' value={this.state.description} onChange={this.handleChange} id='description' />
          <input type='submit' />
        </form>
        <h2>
          <table>
            <tbody>
              {this.state.todos.map((todo, index) => {
                return (
                  <tr>
                    <td className={todo.complete ? 'complete' : ''}> {todo.description} </td>
                    <td onClick={() => this.deleteToDo(todo._id, index)}> X </td>
                    <td onClick={() => this.updateToDo(todo, index)} > complete </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </h2>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('.container')
)