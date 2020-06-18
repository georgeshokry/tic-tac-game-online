import React from 'react';
import './Square.css';


const Square = (props) =>{
    return(
        <button value={props.value} className={props.value === "X" ? 'square' : 'squre O'} onClick={props.onClick}>
            {props.value}
        </button>
    )
};

export default Square;