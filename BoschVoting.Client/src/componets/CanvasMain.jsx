/* eslint-disable react/jsx-key */
import {useContext, useEffect, useRef, useState} from "react";
import { Mic, MicMute, MicMuteFill, CheckCircleFill, DashCircleFill, XCircleFill, MicFill } from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";
import {Context} from "../Context";
import Draggable from "react-draggable";
import "../jquery.min.js";
import { isEmptyObject } from "../helpers";
import axios from "axios";
export default function CanvasMain() {
    const {
        arrSeats,
        setArrSeats,
        seats,
        setting,
        sticky,
        setArrayX,
        setArrayY,
        showPop,
        setShowPop,
        showGrid,
        img,
        setImg,
        imgSize,
        setImgSize,
        seatCanvas,
        setSeatCanvas,
        aaa,
        setAAA,
        ws
    } = useContext(Context);
    let arrX = []
    let arrY = []
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [discussionList, setDiscussionList] = useState([]);
    const refImg = useRef(null)
    const canvas = useRef(null)
    let windows_width = window.innerWidth;

 

    const [seats_voting, setSeats_voting] = useState([]);


    function debounce(func) {
        let timer;
        return function (event) {

            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(func, 100, event);
        };
    }

    useEffect(() => {
        ws.ws.addEventListener('message', (event) => {
            let request = JSON.parse(event.data)
            if (request.operation === "registerEvents") {
                ws.send({
                    messageId: 0,
                    operation: "getSeatVotingResults",
                    parameters: {}
                });
                ws.send({
                    messageId: 0,
                    operation: "getSeats",
                    parameters: {}
                });
                ws.send({
                    messageId: 0,
                    operation: "getDiscussionList",
                    parameters: {}
                });

            }
            if (request.operation === "getSeatVotingResults") {
                setSeats_voting(request.parameters.votingResults)
            }
            if (request.operation === "getSeats") {
                setArrSeats(request.parameters.seats)
            }

            if (request.operation === "getDiscussionList") {
                setDiscussionList(request.parameters.discussionList)
            }



        });

        refImg.current.style.width = window.innerWidth >= 1050 ? window.innerWidth + "px" : 1050 + "px";
        refImg.current.style.height = window.innerHeight - document.querySelector("nav").offsetHeight + "px";
        axios.get('/api/Values/seatCanvas')
            .then(response => {
                setSeatCanvas(response.data)
            })
        window.addEventListener("resize", debounce(function (e) {
            console.log("end of resizing", refImg.current.style.width);
        }));
        axios.get("api/ImageUpload/info").then((res) => {
            if (res.data !== undefined && res.data.length > 0 && res.data !== "NO") {
                axios({
                    url: "image/" + res.data,
                    method: 'GET',
                    responseType: 'blob',
                }).then((response) => {
                    const file = response.data;
                    setImg(URL.createObjectURL(file));
                    const imgObj = new Image();
                    imgObj.src = URL.createObjectURL(file);
                    imgObj.onload = function () {
                        let x = this.width
                        let y = this.height
                        setImgSize(prev => ({
                            ...prev,
                            width: x,
                            height: y
                        }))
                    }
                }).catch(e => console.log(e));
            }
        }).catch((e) => console.log(e));
    }, []);



    useEffect(() => {
        axios.get('/api/Values/seatCanvas')
            .then(response => {
                setSeatCanvas(response.data.map(m => {
                    if (aaa.includes(m.id))
                        m.isMute = 1
                    else
                        m.isMute = 0
                    return m;
                }));
                axios.post('/api/Values/seatCanvas', response.data.map(m => {
                    if (aaa.includes(m.id))
                        m.isMute = 1
                    else
                        m.isMute = 0
                    return m;
                }))
                    .then(response => console.log(response))
                    .catch(err => console.log(err));
            }).catch(err => console.log(err));

    }, [aaa])
    const resize_window_canvas = (ctx) => {
        if (canvas.current) {
            canvas.current.width = window.innerWidth;
            canvas.current.height = window.innerHeight - document.querySelector("nav").offsetHeight;
            let y = 0;
            for (let i = 0; i < canvas.current.height; i = i + 10) {
                let x = 0;
                arrY[y] = i
                for (let j = 0; j < canvas.current.width; j = j + 10) {
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(j, i, 1, 0, 2 * Math.PI)
                    ctx.fill();
                    arrX[x] = j
                    x++
                }
                y++;
            }
            setArrayX(arrX)
            setArrayY(arrY)
        }
    }
    let k_left = [windows_width]
    let k_top = []
    const resize_window_drawing = () => {
        if (refImg.current) {
            refImg.current.style.width = window.innerWidth >= 1050 ? window.innerWidth + "px" : 1050 + "px";
            refImg.current.style.height = window.innerHeight - document.querySelector("nav").offsetHeight + "px";
            console.log(imgSize)
            if (!isEmptyObject(imgSize)) {
                let y_height = Math.round((imgSize.height * window.innerWidth) / imgSize.width)


                refImg.current.style.backgroundSize = `${window.innerWidth}px ${y_height}px`



                if (k_left.length === 2) {
                    k_left.shift();
                    k_top.shift();
                }
                k_left.push(window.innerWidth)
                k_top.push(isNaN(y_height) ? 0 : y_height)
                let g = [...seatCanvas]
                let xx = (Math.round(((k_left[1] / k_left[0]) + Number.EPSILON) * 100) / 100)
                let yy = (Math.round(((k_top[1] / k_top[0]) + Number.EPSILON) * 100) / 100)

                if (k_left.length > 1) {
                    setSeatCanvas(seatCanvas.map(m => {
                        if (y_height >= m.top) {
                            m.left = Math.round(g.find(ff => ff.id === m.id).left * xx);
                            m.top = Math.round(((g.find(ff => ff.id === m.id).top * (isNaN(yy) ? xx : yy)) + Number.EPSILON) * 100) / 100;
                        }

                        return m;
                    }))
                }

                console.log(k_left, k_top)
            }
        }
    }
    $(window).on("load", function () {
        axios.get('/api/Values/seatCanvas')
            .then(response => {
                setSeatCanvas(response.data)
            })
            .catch(err => console.log(err));
    });
    useEffect(() => {


        window.addEventListener('resize', debounce(function (e) {
            resize_window_drawing()
        }));


    }, [imgSize])
    useEffect(() => {
        const canvas_current = canvas.current;
        if (canvas_current !== null) {
            const ctx = canvas_current.getContext('2d');
            resize_window_canvas(ctx)
            window.addEventListener('resize', function (event) {
                resize_window_canvas(ctx)
            }, true);
        }


    }, [showGrid])



    useEffect(() => {
        refImg.current.style.backgroundImage = `url(${img})`
        refImg.current.style.backgroundSize = `${window.innerWidth}px`

    }, [img])

    const handleDrag = (event) => {
        event.preventDefault()
        const element = event.target.parentNode;
        if (element === window.document) return
        event.target.hidden = true

        let configure_list = document.querySelector(".configure-list")


        if (configure_list !== null && configure_list.offsetLeft < event.clientX && event.clientX < (configure_list.offsetWidth + configure_list.offsetLeft)) {
            let array = axios.get('/api/Values/seatList').data 

            axios.get('/api/Values/seatCanvas').then(resp => {
                let sCanvas = resp.data
                const seat = arrSeats.find(elem => elem.seatId === element.id)
                if (seat === undefined) {
                    let arr_01 = [...arrSeats, seats.find(elem => elem.seatId === element.id)]
                    axios.post('/api/Values/seatList', arr_01.sort((a, b) => {
                        let textA = a.seatName.toUpperCase();
                        let textB = b.seatName.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    }))
                        .then(response => console.log(response))
                        .catch(err => console.log(err));

                    let inx = arr_01.findIndex(find => find === undefined)
                    if (inx !== -1) {
                        arr_01.splice(inx, 1)
                    }
                    if (arr_01.filter(f => f.seatId === undefined).length < 1) {
                        setArrSeats(arr_01)
                        let res = sCanvas.filter(f => f.id !== element.id)

                        setSeatCanvas(res)

                        axios.post('/api/Values/seatCanvas', res)
                            .then(response => console.log(response))
                            .catch(err => console.log(err));

                        // fetch('/api/Values/seatCanvas', {
                        //     method: 'POST',
                        //     headers: { 'Content-Type': 'application/json' },
                        //     body: JSON.stringify(res)
                        // }).then(response => {
                        //     })
                        //     .catch(error => {
                        //         console.error(error);
                        //     });
                    }

                }
            })

        } else {
            let str = $(element).css("transform")
            if (str !== "none") {
                let s_st = str.indexOf("(") + 1;
                let e_str = str.indexOf(")");
                let str_f = str.substring(s_st, e_str)
                let strs = str_f.split(",")
                let x = parseInt(strs[4].trim())
                let y = parseInt(strs[5].trim())

                let arr_st_1 = [...document.getElementsByClassName("col-canvas")]

                let arr_st_2 = arr_st_1.map(m => m.parentNode.id)


                let scs = [...seatCanvas.filter(f => arr_st_2.includes(f.id))]

                let arr_1 = scs.map(m => {
                    if (m.id === element.id) {
                        m.left = x;
                        m.top = y;
                    }
                    return m;
                })
                let arr_3 = [...arr_1]
                let arr_2 = arr_1.reduce((result, item) => {
                    return result.filter(f => f.id === item.id).length > 0 ? result : [...result, item];
                }, []);

                setSeatCanvas(arr_1)

                axios.post('/api/Values/seatCanvas', arr_2)
                    .then(response => console.log(response))
                    .catch(err => console.log(err));
            }
        }
        event.target.hidden = false

    }
    const votingState = (id) => {
        const sea = seats_voting.filter(f => f.seatId === id)
        if (sea !== undefined && sea.length > 0) {
            if (sea[0].votingAnswer === "for") {
                return (
                    <CheckCircleFill style={{ color: '#3bb63b' }} />
                )
            }
            if (sea[0].votingAnswer === "abstain") {
                return (
                    <DashCircleFill style={{ color: '#ffc107' }} />
                )
            }
            if (sea[0].votingAnswer === "against") {
                return (
                    <XCircleFill style={{ color: '#d13636' }} />
                )
            }
        }
        return (<div></div>)
    }
    const discuss = (id) => {
        const dis = discussionList?.find(f => f.seatId === id)
        if (dis !== undefined && dis !== null) {
            if (dis.speakerType === "isSpeaker") {
                return (
                    <MicFill style={{ color: '#d13636' }} />
                );
            }
            if (dis.speakerType === "isRequest") {
                return (
                    <div className="speakers">
                        <MicFill />
                    </div>
                    
                );
            }
        }
        return ""
    }

    return (
        <div id="drawing_board" style={{ width: '100%', height: '100%' }} onDragOver={(e) => {
            e.preventDefault();
        }} onClick={() => setShowPop(false)}>
            <div ref={refImg} className="drawing">
                {seatCanvas.length > 0 && seatCanvas?.map((item, index) => (
                    <Draggable grid={sticky && [10, 10]} scale={1} onStop={handleDrag} disabled={!setting} bounds="parent" position={{ x: item.left, y: item.top }}>
                        <div id={item.id} style={{ position: "absolute", zIndex: 1060 }} key={index} onClick={() => {
                            if (!setting) {
                                const dis = discussionList?.find(f => f.seatId === item.id)
                                if (dis !== undefined && dis !== null) {
                                    if (dis.speakerType === "isSpeaker") {
                                        ws.send({
                                            messageId: 0,
                                            operation: "removeSeatFromDiscussionList",
                                            parameters: {
                                                seatId: item.id
                                            }
                                        });
                                    }
                                    if (dis.speakerType === "isRequest") {
                                        ws.send({
                                            messageId: 0,
                                            operation: "addSeatToSpeakers",
                                            parameters: {
                                                seatId: item.id
                                            }
                                        });
                                    }
                                }
                                else {
                                    ws.send({
                                        messageId: 0,
                                        operation: "addSeatToSpeakers",
                                        parameters: {
                                            seatId: item.id
                                        }
                                    });
                                }
                            }
                        }}
                        onContextMenu={(event) => {
                                event.preventDefault()
                                setPosX(event.pageX)
                                setPosY(event.pageY)
                                setShowPop(true)
                            }}>
                            <div className={`col-canvas${item.seatedParticipantId !== "" ? " col-canvas-reg" : ''}`} ></div>
                            <div>{item.text}</div>
                            <div className="icon-seat">{votingState(item.id)}</div>
                            <div className="icon-seat-speakers">{discuss(item.id)}</div>
                        </div>
                    </Draggable>
                ))}

                {/*<img className="img-drawing" src={img}/>*/}
            </div>
            {showGrid && <canvas ref={canvas}></canvas>}
            {/*<Dropdown.Menu show={showPop} style={{ position: 'absolute', top: posY, left: posX, zIndex: 1061 }}>*/}
            {/*    <Dropdown.Item href="#/action-1"><Mic size="20" style={{ marginRight: '5px' }} onClick={() => {*/}
            {/*        setShowPop(false)*/}
            {/*    }} />Включить</Dropdown.Item>*/}
            {/*    <Dropdown.Item href="#/action-2"><MicMute size="20" style={{ marginRight: '5px' }} onClick={() => {*/}
            {/*        setShowPop(false)*/}
            {/*    }} />Отключить</Dropdown.Item>*/}
            {/*    <Dropdown.Item href="#/action-3">*/}
            {/*        <MicMuteFill size="20" style={{ marginRight: '5px' }} color="#dc3545"*/}
            {/*            onClick={() => {*/}
            {/*                setShowPop(false)*/}
            {/*            }} />Заблокировать*/}
            {/*    </Dropdown.Item>*/}
            {/*</Dropdown.Menu>*/}
        </div>

    )
}