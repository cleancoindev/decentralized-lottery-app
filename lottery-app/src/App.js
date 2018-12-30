import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  // constructor(props)
  // {
  //   super(props);
  //   this.state = { manager : ""};
  // }

  state = {
    manager: '',
    players: [],
    balance : '',
    value: '',
    message: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager,players,balance});
  }

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({message:"Waiting on transction success..."});
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    });
    this.setState({message:"You have been entered!"});
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({message:"Picking Winner.."});
    await lottery.methods.pickWinner().send({
      from:accounts[0]
    });
    this.setState({message:"Winner is picked up!"});
  };

  render() {
    return (
      <div>
        <h1>lottery contract</h1>
        <p>contract managed by : {this.state.manager}</p>
        <p>Players : {this.state.players.length}</p>
        <p>Balance : {web3.utils.fromWei(this.state.balance,'ether')}</p>

        <hr/>

        <form onSubmit = {this.onSubmit}>
          <h4>Want to try luck?</h4>
          <div>
            <label>Amount of ether to Enter</label>
            <input
              value={this.state.value}
              onChange = {event => this.setState({value:event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr/>
          <h4>Pick a winner</h4>        
          <button onClick={this.onClick}>Pick awinner</button>
        <hr/>

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;