import React, { Component } from 'react';
import css from '../styles/L2PageInfoBox.scss';

// pass in a map as props (question, answer pair): question is key, answer is item
export class L2PageInfoBox extends Component {
  render() {
    return (
      // questionsToAnswers is a map
      <div className={css.container}>
        <div className = {css.largeContainer}>
        {Array.from(this.props.questionsToAnswers.keys()).filter(question => question === 'Voice').map((question) => {
            return (
              <div className = {css.largeVTContainer}>
                  <div className = {css.voice}>{question}</div>
                  <div className = {css.text}>{this.props.questionsToAnswers.get(question)}</div>
              </div>)
          },)}
        </div>    
        <div className = {css.smallContainer}>
          {Array.from(this.props.questionsToAnswers.keys()).filter(question => question !== 'Voice').map((question) => {
            return (
              <div className = {css.smallVTContainer}>
                  <div className = {css.voice}>{question}</div>
                  <div className = {css.text}>{this.props.questionsToAnswers.get(question)}</div>
              </div>)
          },)}
        </div>
      </div>
    );
  }
}