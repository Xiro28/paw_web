
import img from "../images/loading.gif";

export default function LoadingScreen(){
    return (
        <div className="loadingpage">
           <img src={img} alt="Loading..." width={200} height={200} />
        </div>
    )
}