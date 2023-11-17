"use client"

import { useRef, useState } from "react";

import { tableButtons, possibilitiesWins } from "@/lib/constants";
import Button from "./components/Button";

const App = () => {
    const [ currentTable, setCurrentTable ] = useState<number | null>(null);
    const [ buttonsCliked, setButtonsClicked ] = useState<string[]>([]);
    const [ currentPlayer, setCurrentPlayer ] = useState<"Jogador 1 - X" | "Jogador 2 - O">("Jogador 1 - X");
    
    const tablesWins = useRef<Set<string>>(new Set());

    function handleButtonClick(table_button: string) {
        const [ table, button ] = table_button.split("-");

        if(typeof document !== undefined) {
            const buttonElement = document.getElementsByName(table_button)[0];

            const tag = currentPlayer === "Jogador 1 - X" ? "X" : "O"

            buttonElement.innerHTML = tag;
            var buttons = [...buttonsCliked];
            buttons.push(`${table_button}_${tag}`);

            setButtonsClicked(buttons);
        }

        setCurrentTable(parseInt(button));
        currentPlayer === "Jogador 1 - X" ? setCurrentPlayer("Jogador 2 - O") : setCurrentPlayer("Jogador 1 - X");
    }

    function checkIsDisabled(table: number, button: number): boolean {
        // verifies if any table is fully completed, and, if true, disable the button that redirect to table
        let count = 0;

        buttonsCliked.forEach(btn => {
            const [ table ] = btn.split("-");

            if(button === parseInt(table)) {
                count += 1;
            }
        });

        if(count === 9) {
            return true
        }

        return currentTable !== table
        || 
        buttonsCliked.includes(`${table}-${button}`)
        || 
        // verifies if table is wined, and, if true, disable the button that redirect to table
        tablesWins.current.has(button.toString() + "_X")
        || 
        tablesWins.current.has(button.toString() + "_O");
    }

    function checkTableWin(table: number) {
        const buttonsClickedFiltered = buttonsCliked.filter(btn => btn.includes(`${table}-`));

        for(let possibilities of possibilitiesWins) {
            var count = 0;

            // X check
            for(let p of possibilities) {
                p = p + "X";

                buttonsClickedFiltered.forEach(button => {
                    button = button.slice(2, 5);

                    if(p === button) count += 1;
                })
                
                if(count === 3) return "X";
            };
            
            count = 0;
            // O Check
            for(let p of possibilities) {
                p = p + "O";

                buttonsClickedFiltered.forEach(button => {
                    button = button.slice(2, 5);
                    
                    if(p === button) count += 1;
                })
                
                if(count === 3) return "O";
            };
        }
    }

    return (
        <main className="w-full min-h-screen flex flex-col gap-10 items-center justify-center bg-zinc-700 text-white select-none">

            <h1 className="capitalize font-semibold text-4xl">{ currentPlayer }</h1>

            <div className="grid grid-cols-3 gap-5">

                { tableButtons.map((buttons, key1) => {
                    let win = checkTableWin(key1);

                    if(win) {
                        tablesWins.current.add(key1 + "_" +  win);

                        return <div key={key1} className="uppercase flex justify-center items-center font-extrabold text-9xl bg-zinc-500 rounded-lg min-w-[152px] min-h-[152px]">
                            { win }
                        </div>
                    }

                    return (
                        <div key={key1} className="grid grid-cols-3 gap-1">
                            { buttons.map((_, key2) => (
                                <Button 
                                    key={key2} 
                                    disabled={currentTable === null ? false : checkIsDisabled(key1, key2) ? true : false} 
                                    onClick={(btn: any) => handleButtonClick(btn.target.name)} 
                                    table={key1} 
                                    button={key2}
                                />
                            )) }
                        </div>
                    )
                }) }

            </div>
        </main>
    );
}
 
export default App;