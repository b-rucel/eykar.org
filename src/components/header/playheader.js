import "./header.css"

import { Link } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'

function Account({ gameState, setGameState }) {
    const { account } = useWeb3React();
    if (account)
        return (gameState !== 3) ?

            <div className="header button highlighted button_div">
                <svg className="header icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="header button_text">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </span>
            </div>
            :
            <button className="header button highlighted button_div" onClick={() => setGameState(2)}>
                <svg className="header icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="header button_text" >
                    My colonies
                </span>
            </button>


    return (<div className="header button error button_div">
        <svg className="header icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span className="header button_text">
            Not connected
        </span>
    </div>)
}

function PlayHeader({ gameState, setGameState }) {
    return (
        <nav className="header">
            <div className="header icons">

                <Account gameState={gameState} setGameState={setGameState} />

                <Link className="header button normal" to="/discover" >
                    <div className="header button_div">
                        <svg className="header icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="header button_text">
                            Discover
                        </p>
                    </div>
                </Link>
                <Link className="header button normal" to="/explore">
                    <div className="header button_div">
                        <svg className="header icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <p className="header button_text">
                            Explore
                        </p>
                    </div>
                </Link>
            </div>
        </nav>
    );

}
export default PlayHeader;
