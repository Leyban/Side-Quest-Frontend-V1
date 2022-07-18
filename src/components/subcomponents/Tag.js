const Tag = ({tag, width=9, height=14, onClick=(()=>{}) }) => {
    return (  
        <svg className="tag" onClick={onClick} width={width} height={height} viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M7 0H0V10L3.5 13.5L7 10V0Z" fill={tag.color}/>
        </svg>
    );
}
 
export default Tag;