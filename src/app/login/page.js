// import Login from "../components/loginform"
import dynamic from "next/dynamic";

const Login=dynamic(()=>import("../components/loginform"),{
    ssr:false
})
export default function LoginPage(){

    return(
        <Login />
        )
}