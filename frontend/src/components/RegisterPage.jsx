import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import routes from "../constant";
function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [ avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const RegisterCall = useMutation({
    mutationFn:()=> {
    const formData = new FormData();
    formData.append("username", name);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("fullName", fullname);
    formData.append("avatar", avatar); 
    formData.append("coverImage", coverImage);

    return axios.post(routes.user, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
    onSuccess:(data)=>{
      console.log("user registered",data.data)
      setName("")
      setPassword("")
      setEmail("")
      setFullname("")
      setAvatar(null)
      setCoverImage(null)
    }
  })
  console.log("avatar",avatar)

  return (
    <div
      className=" flex flex-column gap-4  align-items-center justify-content-center "
      style={{ height: "95vh" }}
    >
      <Card className="w-4">
        <div className="flex flex-column gap-4 w-full  align-items-center justify-content-center">
          <div className="text-xl">Register User</div>
          <div className="flex flex-column gap-2  w-full justify-content-center align-items-center">
            <div className="circle-avatar">
              <InputText type="file"
            
                onChange={(e)=>
               
                  setAvatar(e.target?.files[0])
            
              }/>
            </div>
            <div>Avatar</div>
          </div>
           <div className="flex flex-column gap-2  w-full">
            <div>Fullname</div>
            <InputText value={fullname} onChange={(e) => setFullname(e.target.value)} />
          </div>
         
          <div className="flex flex-column gap-2  w-full">
            <div>Email</div>
            <InputText  type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
         
          <div className="flex flex-column gap-2  w-full">
            <div>Password</div>
            <InputText
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
           <div className="flex flex-column gap-2  w-full">
            <div>Username</div>
            <InputText value={name} onChange={(e) => setName(e.target.value)} />
          </div>
           <div className="flex flex-column gap-2  w-full">
            <div>Cover Image</div>
            <InputText type="file"
            onChange={(e)=> setCoverImage(e.target?.files[0])}
            />
          </div>
          <Button label="Register" className="w-full" 
          onClick={RegisterCall.mutate}/>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
