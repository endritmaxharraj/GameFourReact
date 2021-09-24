import React, { useState, useEffect } from 'react';
import './board.css'
import chkWinner from './winner'

class Board extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {value1: 'green', value2: 'red', value3: false, value4: true};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeValue1 = this.handleChangeValue1.bind(this);
        this.handleChangeValue2 = this.handleChangeValue2.bind(this);
        this.onCheckbox1Changed = this.onCheckbox1Changed.bind(this);
        this.onCheckbox2Changed = this.onCheckbox2Changed.bind(this);
    }
    player1 = null
    player2 = null
    restartGame = false
    board = [
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
    ];
    currentPlayer = null;
    errorMessage = null;
    isRobot = false;
    isRobotTurn = false;
    allowedColors = ['blue', 'green', 'red', 'black', 'pink', 'orange', 'purple', 'lightblue']

    async onClickCell(column, isRobotTurn) {
        const col = this.board[column];
        let canGoToRobot = true;
        if (this.checkIfCellAvailable(col) !== null) {
            if (this.isRobot) {
                this.isRobotTurn = isRobotTurn;
            }
            this.board[column][this.checkIfCellAvailable(col)] = this.currentPlayer;
            this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1
        } else {
            canGoToRobot = false
            if (this.isRobotTurn) {
                this.playRobot(100)
            }
        }
        if ((this.isRobot && isRobotTurn) && canGoToRobot) {
            this.playRobot(500)
        }
        this.forceUpdate()
        this.playerHasWon()
    }

    checkIfCellAvailable(column) {
        let availableSpace = null;

        for (let i = column.length - 1; i >= 0; i--) {
                if (parseInt(column[i]) === 0) {
                    availableSpace = i
                    break;
            }   
        }

        return availableSpace;
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.allowedColors.includes(this.state.value1) && this.allowedColors.includes(this.state.value2)) {
            this.player1 = this.state.value1;
            this.player2 = this.state.value2;
            this.currentPlayer = this.player1;
            this.errorMessage = null;
            if (this.state.value4 === true && this.state.value3 === false) { 
                this.isRobot = true
            }
        } else {
            this.errorMessage = 'Please make sure you type a valid color! Valid colors are ' + this.allowedColors.join(', ') + '!';
        }
        this.forceUpdate();
    }
    
    handleChangeValue1(event) {
        this.setState({value1: event.target.value});
    }

    handleChangeValue2(event) {
        this.setState({value2: event.target.value})
    }

    onCheckbox1Changed() {
        this.setState({value3: true})
        this.setState({value4: false})
    }
    onCheckbox2Changed() {
        this.setState({value3: false})
        this.setState({value4: true})
    }

    randomPick() {
        let choice = Math.floor(Math.random() * this.board.length);
        return choice;
    }

    playRobot(time) {
        setTimeout(() => {
            this.onClickCell(this.randomPick(), false)
        }, time)
    }

    async playerHasWon() {
        if(chkWinner(this.board) !== 0) {
            await this.wait(200);
            if (chkWinner(this.board) === this.player1) {
                alert('Player 1 has won')
            } else {
                if (this.isRobot) {
                    alert('Robot has won')
                } else {
                    alert('Player 2 has won')
                }
            }
            this.currentPlayer = this.player1;
            this.board = [
                [ 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0 ]
            ];            
            this.forceUpdate();
        }
    }

    wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

    render() {
            return <div>
            <div></div>
            {this.player1 && this.player2 ?
            <div className="container">
               <div style={{'margin-bottom': '20px'}}>{this.isRobot === true ? 'Player 1 vs Robot' : 'Player 1 vs Player 2'} </div>
               <div className="board">
                    {this.board.map((e, index) => (
                        <div className="board-column-container" key={index}>
                            {e.map((element, i) => (
                                <div key={i} className="button-wrapper">
                                    <button key={i}  onClick={() => this.isRobotTurn === false && this.onClickCell(index, true)}
                                        style={{border: '3px solid black', backgroundColor: this.board[index][i] !== 0 ? this.board[index][i] : 'white'}} className="cells">
                                        </button>
                                </div>
                            ))}
                        </div>   
                    ))}
                </div>
            </div>
            : <div className="form-wrapper">
                    <h3 className="form-header">Choose Color & Game Mode</h3>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-input">
                            <input type="text" placeholder="Please choose color for player1" value={this.state.value1} onChange={this.handleChangeValue1} />
                        </div>
                        <div className="form-input">
                            <input type="text" placeholder="Please choose color for player2" value={this.state.value2} onChange={this.handleChangeValue2} />
                        </div>
                        <div className="game-mode">
                            <input type="radio" name="multiplayer" 
                                   value={this.state.value3} 
                                   checked={this.state.value3 === true} 
                                   onChange={this.onCheckbox1Changed} />Multiplayer
                            <input type="radio" name="computer" 
                                   value={this.state.value4}  
                                   checked={this.state.value4 === true} 
                                   onChange={this.onCheckbox2Changed} />Robot
                        </div>
                        <input type="submit" value="Submit" />
                    </form>
                    { 
                        this.errorMessage && <div className="error-form">{this.errorMessage}</div>
                    }
                </div>}
          </div>
    }
}


export default Board;
