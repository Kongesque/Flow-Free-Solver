import React, { useState, useEffect } from 'react';
import './Flow.css';
import { solve } from './Solver.tsx';

const Flow = () => {
    const [size, setSize] = useState(5);

    const sizeOptions = [5, 6, 7, 8, 9, 10];

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(event.target.value);
        setSize(newSize);
        resetBoard(newSize);
    };

    const renderBoard = () => {
        const rows: JSX.Element[] = [];
        for (let i = 0; i < size; i++) {
            const boxes: JSX.Element[] = [];
            for (let j = 0; j < size; j++) {
                boxes.push(
                    <div key={j} className="boxes" onClick={() => handleCellClick(j, i)}>
                        {board[j][i] !== 0 ? board[j][i] : ''}
                    </div>
                );
            }
            rows.push(
                <div key={i} className={`row${i + 1}`}>    
                    {boxes}
                </div>
            );
        }
        return rows;
    };
    
    const initializeBoard = (boardSize: number) => {
        const initialBoard: number[][] = [];
        for (let i = 0; i < boardSize; i++) {
            const row: number[] = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(0);
            }
            initialBoard.push(row);
        }
        return initialBoard;
    };

    const [board, setBoard] = useState<number[][]>(initializeBoard(size));
    const [solvedBoard, setSolvedBoard] = useState<number[][] | null>(null);
    const [currentNum, setCurrentNum] = useState(1);
    const [clickCount, setClickCount] = useState(0);
    const [previousNum, setPreviousNum] = useState<number | null>(null);

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        const cellValue = board[rowIndex][colIndex];
        let newBoard;

        if (cellValue !== 0 && clickCount % 2 !== 1) {
            newBoard = board.map((row, i) =>
                row.map((cell, j) => (i === rowIndex && j === colIndex ? 0 : cell))
            );
            setClickCount(clickCount - 1);
            setPreviousNum(currentNum);
            setCurrentNum(cellValue);
        } else if (cellValue === 0) {
            newBoard = board.map((row, i) =>
                row.map((cell, j) => (i === rowIndex && j === colIndex ? currentNum : cell))
            );
            setClickCount(clickCount + 1);

            if ((clickCount + 1) % 2 === 0) {
                setCurrentNum(previousNum ?? currentNum + 1);
                setPreviousNum(null);
            }
        } else {
            newBoard = board;
        }

        setBoard(newBoard);
    };

    const solveBoard = () => {
        const solved = solve(board);
        setSolvedBoard(solved);
    };

    const resetBoard = (newSize: number = size) => {
        setBoard(initializeBoard(newSize));
        setSolvedBoard(null);
        setCurrentNum(1);
        setClickCount(0);
        setPreviousNum(null);
    };

    const displayBoard = () => {
        if (!solvedBoard) return null;
        return solvedBoard[0].map((_, colIndex) => (
            <div key={colIndex} className={`col${colIndex + 1}`}>
                {solvedBoard.map((row, rowIndex) => (
                    <div key={rowIndex} className="boxes">
                        {row[colIndex] !== 0 ? row[colIndex] : ''}
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div className='container'>
            <h1 className='title'>Flow Free Solver</h1>
            
            <div className="size">
                <select className='size-dropdown' value={size} onChange={handleSizeChange}>
                    {sizeOptions.map(option => (
                        <option key={option} value={option}>{option}x{option}</option>
                    ))}
                </select>
            </div>
            <div className="board">
                {solvedBoard ? displayBoard() : renderBoard()}
            </div>
            <button className='solve' onClick={solveBoard}>Solve</button>
            <button className='reset' onClick={() => resetBoard()}>Reset</button>
        </div>
    );
};

export default Flow;
