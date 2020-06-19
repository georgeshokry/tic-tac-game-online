import React, {Component} from 'react';
import {Spin, Button, Typography} from 'antd';
import { withRouter } from "react-router-dom";
import Board from './Board';
import * as firebase from 'firebase';
import './Game.css';

const { Title } = Typography;



class Game extends Component{
    constructor(props){
        super(props);
        this.state={
            showModal: false,
            stepNum: 0,
            history: [
                { squares: Array(9).fill("") }
            ],
            uidExist: null,
            loading: true,
            nextPlayer: "",
            waitingContender: false,
            playArray: [],
            whoWins: "",

            xIsNext: true,
            contender: "",
            userName: "",
            X: "",
            O: ""
        }
    }

    checkFirstUrl() {
        let newData = this;

        firebase.database().ref('/playXo/' + this.props.match.params.uid).on('value', function (snapshot) {
            newData.setState({
                ...newData.state,
                xIsNext: snapshot.val().xIsNext,
                userName: snapshot.val().username,
                contender: snapshot.val().contender.username,
                nextPlayer: snapshot.val().nextPlayer,
                X: snapshot.val().X,
                O: snapshot.val().O,
                history: [
                    { squares: snapshot.val().playArray }
                ],
                loading: false,
                whoWins: snapshot.val().whoWins

            });

            console.log("WHO WINS",newData.whoWins);
        });

    }

    componentWillMount() {
        this.checkFirstUrl();
    }

    handelClick(position){
        const history = this.state.history.slice(0, this.state.stepNum + 1);
        const current = history[history.length - 1];
        const squares = current.squares;

        if( squares[position] === "" && this.state.whoWins === ""){

            squares[position] = this.state.xIsNext ? 'X' : 'O';
            const whoWins = calculateWinner(squares);
            const checkNail = squares.some(el => el === "");
            this.setState({
                history: history.concat(
                    {squares: squares}
                ),
                xIsNext: !this.state.xIsNext,
                stepNumber: history.length,
                whoWins: whoWins
            });
            console.log(
                "his", history, "CU", current, "SQ", squares, "WINNER", whoWins, "CHACK", checkNail
            );
            firebase.database().ref().child('/playXo/' + this.props.match.params.uid).update({
                xIsNext: !this.state.xIsNext,
                playArray: [...squares],
                whoWins: checkNail ? whoWins : "nail",
                nextPlayer: this.state.xIsNext ? this.state.O : this.state.X
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    handelReset=()=>{
        this.setState({
            ...this.state,
                showModal: false,
                userName: '',
                xIsNext: true,
                stepNum: 0,
                history: [
                    { squares: Array(9).fill("") }
                ],
                uidExist: null,
                loading: true,
                contender: "",
                nextPlayer: "",
                waitingContender: false,
                playArray: [],
                whoWins: ""
        });
        firebase.database().ref().child('/playXo/' + this.props.match.params.uid).update(  {
            xIsNext: true,
            playArray:  Array(9).fill(""),
            whoWins: ""
        }).catch((error)=>{
            console.log(error);
        });
    };


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNum];
        const whoWins = this.state.whoWins;

        let resetButton;

        if(whoWins || whoWins === "nail"){
            resetButton =  <Button type="primary" className="resetBtn" block onClick={this.handelReset}>Play Again</Button>
        } else {
            resetButton  = null;
        }

        if(this.state.loading === true){
            return (
                <div className="contain">
                <Spin size="large" tip="Loading..." spinning={this.state.loading}>

                </Spin>
                </div>
            )
        }else {
           return(
               <>

                    <Title level={4} className="turnName">{whoWins === "X" ||  whoWins === "O" ? "WINNER IS "+this.state[whoWins] : whoWins ==="nail" ? "Game Over" : ""}</Title>
                    <Board
                        onClick={(position)=>{this.handelClick(position)}}
                        squares={current.squares}
                    />
                    <Title level={4} className="turnName">{ whoWins === "" ? this.state.nextPlayer + " Turn" : ""}</Title>

                    {resetButton}

                    <br/>
                    <br/>
                    </>
           )
        }
    }
}

export default withRouter(Game);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            console.log("CALCUL:",squares[a]);
            return squares[a];
        }
    }
    console.log("CALCUL:","NONE");
    return "";

}

