import React, {Component} from 'react';
import {Spin, Button, Typography, Row, Col, Divider} from 'antd';
import {Redirect, withRouter} from "react-router-dom";
import Board from './Board';
import * as firebase from 'firebase';
import './Game.css';

const { Title, Text } = Typography;



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
            O: "",
            scoreX: 0,
            scoreO: 0,
            scoreLimit: 3,
            scoreLimitReached: false,
        }
    }

    checkFirstUrl() {
        let newData = this;

        firebase.database().ref('/playXo/' + this.props.match.params.uid).on('value', function (snapshot) {
            if(snapshot.exists()) {

                newData.setState({
                    ...newData.state,
                    xIsNext: snapshot.val().xIsNext,
                    userName: snapshot.val().username,
                    contender: snapshot.val().contender.username,
                    nextPlayer: snapshot.val().nextPlayer,
                    X: snapshot.val().X,
                    O: snapshot.val().O,
                    history: [
                        {squares: snapshot.val().playArray}
                    ],
                    loading: false,
                    whoWins: snapshot.val().whoWins,
                    scoreX: snapshot.val().scoreX,
                    scoreO: snapshot.val().scoreO,
                    scoreLimit: snapshot.val().scoreLimit,
                    scoreLimitReached: snapshot.val().scoreLimit === snapshot.val().scoreX ? true : snapshot.val().scoreLimit === snapshot.val().scoreO ? true : false

                });

                console.log("WHO WINS", newData.state.scoreLimitReached);
            }else {
                newData.setState({
                    ...newData.state,
                    uidExist: false,
                    loading: false,
                });
            }
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
            console.log("before set state:", whoWins)
            this.setState({
                ...this.state,
                history: history.concat(
                    {squares: squares}
                ),
                xIsNext: !this.state.xIsNext,
                stepNumber: history.length,
                whoWins: whoWins,

            });
            console.log(
                "his", history, "CU", current, "SQ", squares, "WINNER", whoWins, "CHACK", checkNail
            );
            firebase.database().ref().child('/playXo/' + this.props.match.params.uid).update({
                xIsNext: !this.state.xIsNext,
                playArray: [...squares],
                whoWins: checkNail === false && whoWins ==="" ? "nail" : whoWins,
                nextPlayer: this.state.xIsNext ? this.state.O : this.state.X,
                scoreX: whoWins === "X" ? this.state.scoreX + 1 : this.state.scoreX,
                scoreO: whoWins === "O" ? this.state.scoreO + 1 : this.state.scoreO,
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
            history: [{
                    squares: Array(9).fill("")
                }],
            uidExist: null,
            loading: true,
            contender: "",
            nextPlayer: "",
            waitingContender: false,
            playArray: [],
            whoWins: "",
            scoreX: this.state.scoreLimitReached ? 0 : this.state.scoreX,
            scoreO: this.state.scoreLimitReached ? 0 : this.state.scoreO,
        });
        firebase.database().ref().child('/playXo/' + this.props.match.params.uid).update(  {
            xIsNext: true,
            playArray:  Array(9).fill(""),
            whoWins: ""
        }).catch((error)=>{
            console.log(error);
        });
    };

    handelNewScore = () =>{
        this.setState({
            ...this.state,
            showModal: false,
            userName: '',
            xIsNext: true,
            stepNum: 0,
            history: [{
                squares: Array(9).fill("")
            }],
            uidExist: null,
            loading: true,
            contender: "",
            nextPlayer: "",
            waitingContender: false,
            playArray: [],
            whoWins: "",
            scoreX: 0,
            scoreO: 0,
            scoreLimitReached: false
        });
        firebase.database().ref().child('/playXo/' + this.props.match.params.uid).update(  {
            xIsNext: true,
            playArray:  Array(9).fill(""),
            whoWins: "",
            scoreX: 0,
            scoreO: 0,
        }).catch((error)=>{
            console.log(error);
        });
    };


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNum];
        const whoWins = this.state.whoWins;
        const scoreReched = this.state.scoreLimitReached;

        let resetButton;
        let board;

        if(this.state.scoreLimitReached ){
            board = <Title level={3} className="turnName">Score Limit Reached</Title>

        }else {
            board =
                <Board
                    onClick={(position)=>{this.handelClick(position)}}
                    squares={current.squares}/>
        }

        if((whoWins || whoWins === "nail") && scoreReched === false){
            resetButton =  <Button type="primary" className="resetBtn" block onClick={this.handelReset}>Next Round</Button>
        } else if(scoreReched === true){
            resetButton =  <Button type="ghost" className="resetBtn" block onClick={this.handelNewScore}>Reset Score</Button>
        } else {
            resetButton  = null;
        }

        if(this.state.loading === true && this.state.uidExist === null){
            return (
                <div className="contain">
                <Spin size="large" tip="Loading..." spinning={this.state.loading}>

                </Spin>
                </div>
            )
        }else if(this.state.loading === false && this.state.uidExist === null){
           return(
               <>

                   <Row justify="space-around">
                       <Col >
                           <Row>
                               <Title level={4} className="x-score">
                                   X
                               </Title>
                           </Row>
                           <Title level={3} className="turnName">
                               {this.state.scoreX}
                           </Title>
                           </Col>
                       <Divider type="vertical" className="ver-divider"/>
                       <Col >
                           <Row>
                           <Title level={4} className="o-score">
                               O
                           </Title>
                           </Row>
                           <Title level={3} className="turnName">
                           {this.state.scoreO}
                           </Title>
                       </Col>
                   </Row>
                   <Row justify="space-around">
                       <Text strong={true}>
                           Limit : {this.state.scoreLimit}
                       </Text>
                   </Row>
                    <Title level={3} className="turnName">{whoWins === "X" ||  whoWins === "O" ? "WINNER IS "+this.state[whoWins] : whoWins ==="nail" ? "Game Over" : ""}</Title>
                   {board}
                    <Title level={3} className="turnName">{ whoWins === "" && this.state.scoreLimitReached === false ? this.state.nextPlayer + " Turn" : ""}</Title>

                    {resetButton}

                    <br/>
                    <br/>
                    </>
           )
        }else if(this.state.loading === false && this.state.uidExist === false){
            return(
                <Redirect to="/"/>
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

