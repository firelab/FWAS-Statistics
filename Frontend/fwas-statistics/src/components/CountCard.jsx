function CountCard(props){
    return (
        <div className={props.class1}>
            <span className="h10">{props.count}</span>
            <br/>
            <span className="h9">{props.title}</span>
        </div>
    );
}
export default CountCard