import { myCookies } from '../App';

export const IsSub = props => {
  const onClick = () => {
    fetch("http://localhost:5000/api/subscribe/delete_service", {
      method: "DELETE",
      headers : { 
        'Content-Type': 'application/json',
        'jwt': myCookies.cookies.get('jwt')
      },
      body: JSON.stringify({
        "name_service": props.name
      })
    }).then(() => {
      fetch("http://localhost:5000/api/subscribe/subscribe_list", {
        method: "GET",
        headers : { 
          'Accept': 'application/json',
          'jwt': myCookies.cookies.get('jwt')
        },
      }).then((res) => {
          res.json().then((data) => {
            props.setList(data.list_service);
          })
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
  };

  return (<button onClick={onClick} className="btn btn-danger">- Unsubscribe</button>)
};

export const IsNotSub = props => {
  const onClick = () => {
    fetch("http://localhost:5000/api/subscribe/subscribe_service", {
      method: "POST",
      headers : { 
        'Content-Type': 'application/json',
        'jwt': myCookies.cookies.get('jwt')
      },
      body: JSON.stringify({
        "name_service": props.name
      })
    }).then(() => {
      fetch("http://localhost:5000/api/subscribe/subscribe_list", {
        method: "GET",
        headers : { 
          'Accept': 'application/json',
          'jwt': myCookies.cookies.get('jwt')
        },
      }).then((res) => {
          res.json().then((data) => {
            props.setList(data.list_service);
          })
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
  };

  return (<button onClick={onClick} className="btn btn-primary">+ Subscribe</button>)
};
