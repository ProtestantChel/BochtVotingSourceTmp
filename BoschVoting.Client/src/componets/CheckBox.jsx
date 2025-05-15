export default function CheckBox(props) {
    const style = {
        marginLeft: '10px',
        display: 'inline-block',
    }
    return (
        <div style={props.style}>
            <label >
                <input type="checkbox" checked={props.checked} onChange={props.onChange} />
                <p style={style}> {props.label} </p>
            </label>
        </div>
    )
}