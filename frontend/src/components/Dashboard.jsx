import { Menubar } from "primereact/menubar";
import { Card } from "primereact/card";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const navbar = [
    {
      label: "Home",
      icon: "pi pi-home",
    },
    {
      label: "MyVideos",
      icon: "pi pi-star",
    },
    {
      label: "Stats",
      icon: "pi pi-search",
    },
    {
      label: "Log In",
      icon: "pi pi-envelope",
    },
    {
      label: "Sign Up",
      icon: "pi pi-envelope",
    },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  return (
    <div>
      <Menubar model={navbar} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          padding: "1rem",
          alignItems: "flex-start",
        }}
      >
        {data.map((item, index) => (
          <div className="p-col" key={index}>
            <Card>
              <img
                alt="background"
                src={item.backgroundImage}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              <img
                alt="profile"
                src={item.profileImage}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "2px solid white",
                  boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                }}
              />
              <h4 style={{ margin: 0 }}>{item.name}</h4>
              <div style={{ display: "flex", gap: "1rem" }}>
                <h6 style={{ margin: 0 }}>{item.views}</h6>
                <h6 style={{ margin: 0 }}>{item.uploaded}</h6>
              </div>
              <p>{item.description}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
