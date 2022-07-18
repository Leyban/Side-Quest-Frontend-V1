const Broadcaster = (props) => {
    return (  
        <div className="broadcaster">
            <h5 className="greeting" key={props.greet}>{props.greet}</h5>
            <h5 className="notification" key={props.notification}>{props.notification}</h5>
        </div>
    );
}
 
export default Broadcaster;