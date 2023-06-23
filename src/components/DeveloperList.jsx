import React,{useState,useEffect} from "react";
import { Link,Navigate,useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import  axios  from 'axios';

let DeveloperList = () => {
  const [user,setUser]=useState({});
  
  const [loggedIn,setLoggedIn] = useState(false);
  const [profiles,setProfiles]=useState([]);
  const [profile,setProfile]=useState([]);
  const [loading,setLoading] = useState(true);
  const fetchProfiles = async() =>{
    const { data } = await axios.get("https://ronak-dev.onrender.com/api/profiles/all",{
      headers: {
        "Content-Type": "application/json",
      },
    });
   setProfiles(data.profiles);
   setLoading(false);
// console.log(data.profiles)
    
  }
  useEffect(() => {
    if (localStorage.getItem("devroom")) {
      
      setLoggedIn(true)
    }
    
    
    
    
  }, []);



  const getUser =async()=>{
    let { data } = await axios.get("https://ronak-dev.onrender.com/api/users/me", {
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${localStorage.getItem("devroom")}`,
     },
   });
   setUser(data.user);
   console.log(data.user._id);
   setLoading(false);
    }
    const getProfile = async() =>{
      let {status,data} = await axios.get("https://ronak-dev.onrender.com/api/profiles/me",{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("devroom")}`,
        },
      })
       console.log(data)
      if (status==200){
        setProfile(data.profile);
        
      }
      ;
  
    }
  
    useEffect(() => {
      if(loggedIn) {
      getUser();
      getProfile();
      }
    }, [loggedIn]);
  let clickLikePost = async(profileId) => {
    if(!loggedIn){
      alert("Plese login to use this");
      return;
    }
    if(profile.length===0){
      alert("Please create your profile to use this feature");
      return;
    }
    const {data} = await axios.put(`https://ronak-dev.onrender.com/api/profiles/follow/${profileId}`,{},{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      }
    });
   fetchProfiles();
  };

  useEffect(() => {
    
   fetchProfiles()
  }, []);

  return (
    <React.Fragment>
      <section className="p-3">
        <div className="container">
          <div className="row animated zoomIn">
            <div className="col">
              <p className="h3 text-teal">
                <i className="fa fa-user-tie" /> Developers
              </p>
              <p>List of registered developers</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {profiles.length > 0 ? (
              <React.Fragment>
                <div className="container">
                  <div className="row">
                    <div className="col">
                      {profiles.map((profile) => {
                        return (
                          <div
                            className="card my-2 animated zoomIn"
                            key={profile._id}
                          >
                            <div className="card-body bg-light-grey">
                              <div className="row">
                                <div className="col-md-2">
                                  <img
                                    src={profile.user.avatar}
                                    className="img-fluid img-thumbnail"
                                    alt=""
                                  />
                                </div>
                                <div className="col-md-5">
                                  <h2>{profile.user.name}</h2>
                                  <small className="h6">
                                    {profile.website}
                                  </small>
                                  <br />
                                  <small className="h6">
                                    {profile.designation}
                                  </small>
                                  <br />
                                  <small className="h6">
                                    {profile.company}
                                  </small>
                                  <br />
                                  <small>{profile.location}</small>
                                  <br />
                                  <Link
                                    to={`/developers/${profile._id}`}
                                    className="btn btn-teal btn-sm"
                                  >
                                    View Profile
                                  </Link>




                                
                                  {profile.user._id!=user._id ?
                                  (user && profile.followers.includes(user._id) ? (
                                    <button
                                      className="btn btn-like btn-sm me-2"
                                      onClick={clickLikePost.bind(
                                        this,
                                        profile._id
                                      )}
                                      style={{ color: "white" }}
                                    >
                                      <i
                                        // className="fa fa-thumbs-up me-2"
                                        style={{ color: "white" }}
                                      />{" "}
                                      Unfollow
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-primary btn-sm me-2"
                                      onClick={clickLikePost.bind(
                                        this,
                                        profile._id
                                      )}>
                                      
                                    Follow
                                    </button>
                                  ))
                                
                                : " "}




                                </div>
                                <div className="col-md-5 d-flex justify-content-center flex-wrap ">
                                  {profile.skills.length > 0 &&
                                    profile.skills.map((skill, index) => {
                                      return (
                                        <div key={index}>
                                          <span className="badge badge-success p-2 m-1">
                                            <i className="fa fa-check-circle" />{" "}
                                            {skill}
                                          </span>
                                          <br />
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}
      </section>
    </React.Fragment>
  );
};
export default DeveloperList;
