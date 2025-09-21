import React from 'react'
import { Menubar } from 'primereact/menubar';

function Dashboard() {
  const items = [
        {
            label: 'Home',
            icon: 'pi pi-home'
        },
        {
            label: 'MyVideos',
            icon: 'pi pi-star'
        },
        {
            label: 'Stats',
            icon: 'pi pi-search',
           
        },
        {
            label: 'Log In',
            icon: 'pi pi-envelope'
        },
          {
            label: 'Sign Up',
            icon: 'pi pi-envelope'
        }
    ];
  return (
    <div><Menubar model={items} />
      </div>
  )
}

export default Dashboard