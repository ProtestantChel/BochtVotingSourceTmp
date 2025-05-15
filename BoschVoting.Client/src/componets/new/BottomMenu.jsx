import {Button, Form, Navbar, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import MicSensitivity from "./MicSensitivity";
import { Gear, MicMute, Download, XSquare, CardChecklist} from "react-bootstrap-icons";
import {useState, useRef, useContext} from "react";
import Slider from "./Slider";
import GridSvg from "./GridSvg";
import GridSnap from "./GridSnap";
import { Context } from "../../Context";
import axios from "axios";
export default function BottomMenu(){
    const { setImg, setImgSize, setShowGrid, configureListShow, setSticky, ws, registration, setRegistration} = useContext(Context);
    const [showSlider, setShowSlider] = useState(false);
    const [micMute, setMicMute] = useState(false);
    const fileInputRef = useRef();
    const handleChange = (event) =>{
        if (event.target.files.length > 0){
            const file = event.target.files[0];
            setImg(URL.createObjectURL(file))
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
            let formData = new FormData();
            formData.append("files", file);
            axios.post('api/ImageUpload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

    }
    const clickText = () => {
        ws.send(JSON.stringify({
            messageId: 1,
            operation: "login",
            parameters: {
                password: "",
                user: "Admin"
            }
        }));
        // let a = Math.floor(Math.random() * 20)
        // let b = Math.floor(Math.random() * (20 - a))
        // let c = Math.floor(Math.random() * (20 - a - b))
        // let d = 20 - (a + b + c)
        // setXX( {
        //     "messageId": 95,
        //     "operation": "getVotingResults",
        //     "parameters": {
        //         "votingResults": [
        //             {
        //                 "count": a,
        //                 "answer": "for"
        //             },
        //             {
        //                 "count": b,
        //                 "answer": "against"
        //             },
        //             {
        //                 "count": c,
        //                 "answer": "abstain"
        //             },
        //             {
        //                 "count": d,
        //                 "answer": "not vote"
        //             }
        //         ]
        //     }
        // } )
    }
    return (
        <Navbar className="bg-body-tertiary justify-content-between" fixed="bottom">
            <div className="button-menu">
                <div style={{ display: "inline-block", borderRight: '1px solid #ced4da' }}>
                    <Button style={{}} variant="light" onClick={configureListShow}
                            title="Конфигурирование"><Gear
                        style={{fontSize: '2rem'}}/></Button>
                    <Button style={{}} variant="light" onClick={() => fileInputRef.current.click()}
                            title="Загрузить фон"><Download
                        style={{fontSize: '2rem'}}/></Button>
                    <Button style={{}} variant="light" onClick={() => setImg('')}
                            title="Очистить фон"><XSquare
                        style={{fontSize: '2rem'}}/></Button>
                </div>
                {/*<div style={{*/}
                {/*    display: "inline-block",*/}
                {/*    padding: '0px 5px 0px 5px',*/}
                {/*    margin: '0px 5px 0px 5px',*/}
                {/*    borderLeft: '1px solid #ced4da',*/}
                {/*    borderRight: '1px solid #ced4da'*/}
                {/*}}>*/}
                {/*    <Button style={{}} variant="light" onClick={() => setShowSlider(!showSlider)}*/}
                {/*            className="bg-MicSensitivity"><MicSensitivity/></Button>*/}
                {/*    <Button style={{}} variant="light" onClick={() => setMicMute(!micMute)}><MicMute*/}
                {/*        style={{fontSize: '2rem', color: micMute ? 'red' : 'black'}}/></Button>*/}
                {/*</div>*/}

                <ToggleButtonGroup type="checkbox" onChange={(e) => {
                    if (e.includes(1)) setShowGrid(true)
                    else setShowGrid(false)

                    if (e.includes(2) && !e.includes(1)) {
                        e.splice(0, e.length)
                        return
                    }
                    if (e.includes(2) && e.includes(1)) setSticky(true)
                    else setSticky(false)


                }}>
                    <ToggleButton variant="light" id="tbg-check-1" value={1}>
                        <GridSvg/> Показать сетку
                    </ToggleButton>
                    <ToggleButton variant="light" id="tbg-check-2" value={2}>
                        <GridSnap/> Прикрепить к сетке
                    </ToggleButton>

                </ToggleButtonGroup>
                <div style={{
                    display: "inline-block",
                    borderLeft: '1px solid #ced4da',
                    borderRight: '1px solid #ced4da'
                }}>
                    <Button variant="light" onClick={() => setRegistration(!registration)}><CardChecklist style={{ fontSize: '2rem' }} /></Button>

                </div>

            </div>

            <Form.Select aria-label="Макеты" inline style={{width: '300px'}} onChange={(e) => {
                if (e.target.value.includes('1'))
                    window.open('/two', '_blank', 'noopener,noreferrer')
                if (e.target.value.includes('2'))
                    window.open('/third', '_blank', 'noopener,noreferrer')
                if (e.target.value.includes('3'))
                    window.open('/fourth', '_blank', 'noopener,noreferrer')
            }
            }>
                <option>Выбрать представления</option>
                <option value="1">Голосование</option>
                <option value="2">Регистрация</option>
                <option value="3">Посещаемость</option>
                {/*<option value="3">Three</option>*/}
            </Form.Select>
            {showSlider && <Slider/>}
            <input onChange={handleChange} multiple={false} ref={fileInputRef} type='file' hidden/>

        </Navbar>
    )
}