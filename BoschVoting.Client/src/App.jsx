
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import First from "./First";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChartDraw from "./componets/new/ChartDraw";
import WebSocketConnectTest from "./WebSocketConnectTest";
import Registration from "./componets/new/Registration";
import GridTable from "./componets/new/GridTable";
import { useEffect } from 'react';

const ws = new WebSocketConnectTest()
function App() {
   
    useEffect(() => {


    }, [])


    return (
        <Router>
            <div className="App" >
                <Routes>
                    <Route path="/" element={<First ws={ws} />} />
                    <Route path="/two" element={<ChartDraw ws={ws} />} />
                    <Route path="/third" element={<Registration ws={ws} />} />
                    <Route path="/fourth" element={<GridTable ws={ws} />} />
                </Routes>
            </div>
        </Router>
    );
    

}

export default App;