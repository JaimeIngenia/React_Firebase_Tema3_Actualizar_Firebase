import { useEffect, useState } from "react";
import { getUsers, addUsers,deleteUsers,actualizarUsers,db } from "./getData";
import corazon from "./images/corazon.svg"
import { doc, onSnapshot } from "firebase/firestore";

const INITIAL_FORM_DATA ={
  Nombre:"",
  Correo:""
}

function App() {
  {/* ------------------ESTADOS------------------ */}
  const [usersData, setUsersData]=useState([]);
  const [dataForm,setDataForm]=useState(INITIAL_FORM_DATA);
  const [watchPerson,setWatchPerson]=useState(INITIAL_FORM_DATA);
  
  useEffect(()=>{
    
  const unsub = onSnapshot(doc(db, "users", "lvMMPPxLkwQHbdvGNy8W"), (doc) => {
    console.log("Current data: ", doc.data());
    setWatchPerson(doc.data());
}
);
return ()=>{
  unsub()
}

    // getUsers()
    // .then((data) => {
    //   console.log(data);
    //   setUsersData(data);
    // })
    // .catch((error) => console.log("error"));
  },[])
  {/* ------------------EVENTOS----------------- */}
  const manejarSubmit =(e)=>{
    e.preventDefault();
    addUsers(dataForm).then((id)=>{
      console.log(id);
      setUsersData((prev)=>{
        return[...prev,dataForm]
      })
      setDataForm(INITIAL_FORM_DATA)
    });
  };

  const cambiarNombre=(e)=>{
    setDataForm((prev)=>{
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const manejarDelete=(e)=>{
    console.log(e.target.id);
    deleteUsers(e.target.id).then((id)=>{
      const newUsers = usersData.filter((user)=>{
        return user.id !== id;
      })
      setUsersData(newUsers);
    }) ;
  }

  const likeUser = (id, likes=0)=>{
    // console.log("Me gusta"+ id);
    actualizarUsers(id,{
      likes: likes
    })
  }
  // console.log(dataForm);
  
  return (
    <div className="App">
      <h1>Firebase tema 3</h1>
      {usersData.map((u)=>{
        return(
          <div key={u.id}>
            <span>{u.Correo}</span>
            <span>{u.Nombre}</span>
            <button 
            className="delete"
            id={u.id}
            onClick={manejarDelete}
            >x</button>
            <button onClick={()=>likeUser(u.id,200)}>
              <img  
              src={corazon}
              height ="13px"
               > 
              </img>
              <span>
              {u.likes}
              </span>
            </button>
          </div>
        );
      })}
      {/* ------------------formulario------------------ */}

      <form onSubmit={manejarSubmit} >
        <div>
          <span>Nombre</span>
          <input name="Nombre" 
                value={dataForm.Nombre} 
                onChange={cambiarNombre}></input>
        </div>
        <div>
          <span>Email</span>
          <input  name="Correo" 
                  type="email"
                  value={dataForm.Correo} 
                   onChange={cambiarNombre} 
          ></input>
        </div>
        <button>Enviar</button>
      </form>
        <div key={watchPerson.id}>
              <span>{watchPerson.Correo}</span>
              <span>{watchPerson.Nombre}</span>
              {/* <button 
              className="delete"
              id={watchPerson.id}
              onClick={manejarDelete}
              >x</button> */}
              <button onClick={()=>likeUser("lvMMPPxLkwQHbdvGNy8W",400)}>
                <img  
                src={corazon}
                height ="13px"
                > 
                </img>
                <span>
                  {watchPerson.likes}
                </span>
              </button>
            </div>
    </div>
  );
}

export default App;
