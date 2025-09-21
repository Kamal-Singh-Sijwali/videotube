import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
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
              hi
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
            <InputText type="file" />
          </div>
          <Button label="Register" className="w-full" />
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
