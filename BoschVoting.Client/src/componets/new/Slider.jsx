import {useEffect, useRef} from "react";
import SensitivityLow from "./SensitivityLow";
import SensitivityHigh from "./SensitivityHigh";

export default function Slider(){
    const style_slider  = {
            borderRadius: '5px',
            backgroundColor: '#282c34',
            width: '3px',
            height: '70px',
            marginTop: '5px',
            marginBottom: '5px',
            marginLeft: '8px',
            zIndex: 1046,


    }
    const style_thumb = {
        width: '15px',
        height: '15px',
        borderRadius: '15px',
        position: 'relative',
        left: '-6px',
        top: '24px',
        background: '#fff',
        cursor: 'pointer',
        border: '1px solid #000',
    }
    const sliderRef = useRef(null);
    const thumbRef = useRef(null);
    useEffect(() => {

        let slider = sliderRef.current;
        let thumb = thumbRef.current;


        thumb.onmousedown = function(event) {
            event.preventDefault(); // предотвратить запуск выделения (действие браузера)

            let shiftX = event.clientY - thumb.getBoundingClientRect().top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            function onMouseMove(event) {
                let newTop = event.clientY - shiftX - slider.getBoundingClientRect().top;

                if (newTop < 0) {
                    newTop = 0;
                }
                let bottomEdge = slider.offsetHeight - thumb.offsetHeight;
                if (newTop > bottomEdge) {
                    newTop = bottomEdge;
                }

                thumb.style.top = newTop + 'px';
            }

            function onMouseUp() {
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('mousemove', onMouseMove);
            }

        };

        thumb.ondragstart = function() {
            return false;
        };
    }, []);

    return (
        <div style={{
            position: 'absolute',
            left: '210px',
            top: '-130px',
            width: '20px'
        }}>
            <SensitivityHigh/>
            <div ref={sliderRef} className="slider" style={style_slider}>
                <div ref={thumbRef} className="thumb" style={style_thumb}></div>
            </div>
            <SensitivityLow />
        </div>

    )
}