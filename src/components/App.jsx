import React from "react";
import { useState } from "react";
import Quiz from './Quiz'

export default function App() {
    const [isGameOn, setIsGameOn] = useState(false);
    return (
        <main>
            {isGameOn ? (
                <Quiz />
            ) : (
                <div className="load">
                    <h1 className="load__title">Quizzila</h1>
                    <p className="load__description">
                        Try the funniest quiz on the world
                    </p>
                    <button
                        className="load__button"
                        onClick={() => setIsGameOn(true)}
                    >
                        Start Quiz
                    </button>
                </div>
            )}
        </main>
    );
}
