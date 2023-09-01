import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import classNames from "classnames";

export default function Quiz() {
    const [questionsData, setQuestionsData] = useState(() => []);
    const [userAnswers, setUserAnswers] = useState([-1, -1, -1, -1, -1]);
    const [isGameEnd, setIsGameEnd] = useState(false)
    const [isGameReload, setIsGameReload] = useState(false)
    const [correctAnswers, setCorrectAnswers] = useState(0)

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then((res) => res.json())
            .then((res) => {
                res = Array.from(res.results)
                res.map((question) => {
                let randomNumber = Math.floor(Math.random() * 3);
                    let answers = [
                        ...question.incorrect_answers.slice(0, randomNumber),
                        question.correct_answer,
                        ...question.incorrect_answers.slice(randomNumber),
                    ];
                    question.answers = Array.from(answers)
                    question.correct = randomNumber
                })
                setQuestionsData(res)
            })
    }, [isGameReload]);
    
    function changeAnswer(question, answer){
        setUserAnswers((prevAnswers) => {
            console.log('b',prevAnswers)
            let newAnswers = Array.from(prevAnswers)
            newAnswers[question] = answer
            console.log(newAnswers)
            return newAnswers;
        })
    }

    function checkResult(){
        let counter = 0;
        for(let i=0; i<userAnswers.length; i++)
            if(userAnswers[i] === questionsData[i].correct )
                counter += 1
        setCorrectAnswers(counter)
        setIsGameEnd(true)
    }

    function toogleGameEnd() {
        setIsGameEnd(!isGameEnd)
        setUserAnswers([-1, -1, -1, -1, -1])
        setIsGameReload(!isGameReload)
    }
    const questionsElements = questionsData.map((question, index) => {
        let answersElements = question.answers.map((ans, pindex) => {  
            let isFocused = userAnswers[index] === pindex
            let isCorrect = pindex === question.correct
            let isWrong = isFocused && userAnswers[index] !== question.correct
            return (
                <p
                    className={classNames({
                        'quiz__answer': true,
                        'quiz__selected': !isGameEnd && isFocused,
                        "quiz__correct": isGameEnd && isCorrect,
                        "quiz__wrong": isGameEnd && isWrong
                    })}
                    key={nanoid()}
                    onClick={() => !isGameEnd && changeAnswer(index, pindex)}
                >
                    {decode(ans)}
                </p>
            );
        });
        return (
            <div className="quiz__question" key={nanoid()}>
                <p className="quiz__title">{decode(question.question)}</p>
                <div className="quiz__answers">{answersElements}</div>
            </div>
        );
    });
    
    return (
        <div className="quiz">
            {questionsElements}
            <div className="quiz__container">
                {isGameEnd && <p>You scored {correctAnswers}/5 correct answers</p>}
                <button onClick={isGameEnd ? toogleGameEnd : checkResult} className="quiz__button">
                    {isGameEnd ? "Play again" : "Submit"}
                </button>
            </div>

        </div>
    );
}
