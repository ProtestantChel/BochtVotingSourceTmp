import "./Main.css"
import BottomMenu from "./componets/new/BottomMenu";
import DrawingBoard from "./componets/new/DrawingBoard";
import {Context} from "./Context";
import {useEffect, useState} from "react";
import axios from "axios";
import ListTest from "./componets/test/ListTest";
import ParticipantsList from "./componets/test/ParticipantsList";

export default function Main({ws}){



    const [img, setImg] = useState('');
    const [imgSize, setImgSize] = useState({});
    const [showGrid, setShowGrid] = useState(false);
    const [arrayX, setArrayX] = useState([]);
    const [arrayY, setArrayY] = useState([]);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [showPop, setShowPop] = useState(false);
    const [setting, setSetting] = useState(false);
    const [show, setShow] = useState(false);
    const [count, setCount] = useState(1);
    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);
    const [scale, setScale] = useState(0);
    const [participantsList, setParticipantsList] = useState([])
    const [arrSeats, setArrSeats] = useState([])
    const [seat, setSeat] = useState("");
    const [seats, setSeats] = useState([]);

    const [notes, setNotes] = useState([]);
    const [posCanvasWidth, setPosCanvasWidth] = useState(window.innerWidth);
    const [posCanvasHeight, setPosCanvasHeight] = useState(window.innerHeight);
    const [sticky, setSticky] = useState(false);
    const [registration, setRegistration] = useState(false);
    const [seatCanvas, setSeatCanvas] = useState([]);
    const [aaa, setAAA] = useState([])


    const configureListShow = () => {
        ws.send({
            messageId: 0,
            operation: "getSeats",
            parameters: {}
        })

        setSetting(!setting)
    };
    useEffect(() => {
        document.title = "Управление"
        window.addEventListener("wheel", function(e) {
            if (e.ctrlKey) {
                e.preventDefault();
                let arr_st_1 = document.getElementsByClassName("col-canvas")
                for (let i = 0; i < arr_st_1.length; i++) {
                    // let deltaY = e.deltaY || e.detail || e.wheelDelta;
                    // let deltaX = e.deltaX || e.detail || e.wheelDelta;
                    //
                    // console.log(e);
                    //
                    // arr_st_1.item(i).style.width = arr_st_1.item(i).offsetWidth + e.deltaY + "px"
                    // arr_st_1.item(i).style.height = arr_st_1.item(i).offsetHeight+ e.deltaY + "px"
                }
            }
        });
        ws.ws.addEventListener('message', (event) => {
            let request = JSON.parse(event.data)
            if (request.operation === "registerEvents") {
                ws.send({
                    messageId: 0,
                    operation: "getDiscussionList",
                    parameters: {}
                });
            }
            if (request.operation === "getParticipants") {
                setRegistration(true)
            }
            if (request.operation === "getSeats") {
                let seats_list = request.parameters.seats
                axios.post('/api/Values/seats', seats_list)
                    .then(response => console.log(response))
                    .catch(err => console.log(err));
                setSeats(seats_list)
                axios.get('/api/Values/seatCanvas').then(resp => {
                    let sCanvas = resp.data
                    console.log(sCanvas, resp.data)
                    let arr_st = sCanvas !== null && sCanvas.length > 0 ? seats_list.filter(seat => !sCanvas.map(m => m.id).includes(seat.seatId)) : seats_list
                    arr_st.sort((a, b) => {
                        let textA = a.seatName.toUpperCase();
                        let textB = b.seatName.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    }).filter(f => f !== undefined && f !== null);
                    setArrSeats(arr_st)
                    axios.post('/api/Values/seatList', arr_st)
                        .then(response => console.log(response))
                        .catch(err => console.log(err));
                    let arr = seatCanvas.length > 0 ? seatCanvas : sCanvas
                    if (arr.length > 0) {
                        const aa = arr.map(seatCan => {
                            seatCan.seatedParticipantId = seats_list.find(f => f.seatId === seatCan.id).seatedParticipantId
                            seatCan.text = seats_list.find(f => f.seatId === seatCan.id).screenLine
                            return seatCan
                        })
                        setSeatCanvas(aa)
                        axios.post('/api/Values/seatCanvas', aa)
                            .then(response => console.log(response))
                            .catch(err => console.log(err));
                    }
                })

            }
            if (request.operation === "getDiscussionList") {
                setAAA(request.parameters.discussionList.map(m => m.seatId))
            }
        });

    },[])


 

    useEffect(() => {
        axios.get('/api/Values/seatList').then(resp => {
            const array = resp.data
            console.log(array, resp)

            if (array !== null && array.length > 0) {
                let index = array.findIndex(f => f === null)
                index !== -1 && array.splice(index, 1)
                let arr_st_1 = [...document.getElementsByClassName("col-canvas")]
                let arr_st_2 = array.filter(a => !arr_st_1.map(m => m.parentNode.id).includes(a.seatId))
                setArrSeats(arr_st_2)
            }
        })


    },[setting])


    return (
        <Context.Provider value={{
            img, setImg,
            imgSize, setImgSize,
            showGrid, setShowGrid,
            arrayX, setArrayX,
            arrayY, setArrayY,
            posX, setPosX,
            posY, setPosY,
            showPop, setShowPop,
            setting, setSetting,
            show, setShow,
            count, setCount,
            handleClose,
            toggleShow,
            configureListShow,
            scale, setScale,
            arrSeats, setArrSeats,
            seat, setSeat,
            seats, setSeats,
            notes, setNotes,
            posCanvasWidth, setPosCanvasWidth,
            posCanvasHeight, setPosCanvasHeight,
            sticky, setSticky,
            seatCanvas, setSeatCanvas, ws, aaa, setAAA,
            registration, setRegistration,
            participantsList, setParticipantsList
        }}>

            <div id="main-container">
                <DrawingBoard />
                <BottomMenu/>
                {setting && <ListTest />}
                {registration && <ParticipantsList />}

            </div>

        </Context.Provider>
    );
}