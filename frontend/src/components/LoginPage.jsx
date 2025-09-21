import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div
      className=" flex flex-column gap-4  align-items-center justify-content-center "
      style={{ height: "95vh" }}
    >
      <Card className="w-4">
        <div className="flex flex-column gap-4 w-full  align-items-center justify-content-center">
          <div className="text-xl">Login User</div>
          <div className="flex flex-column gap-2  w-full">
            <div>Name</div>
            <InputText value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-column gap-2  w-full">
            <div>Password</div>
            <InputText
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button label="Register" className="w-full" />
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
